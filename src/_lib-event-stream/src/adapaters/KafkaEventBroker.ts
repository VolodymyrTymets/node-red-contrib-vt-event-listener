import debug from "debug";
import EventBroker, {EventBrokerOptions, EventBrokerPayload} from "./EventBroker";
import {Client, HighLevelProducer, ConsumerGroup} from "kafka-node";
import {Transform} from "stream";

export interface KafkaEventBrokerOptions extends EventBrokerOptions {
    host: string;
    groupId: string;
}
export default class KafkaEventBroker implements EventBroker<KafkaEventBrokerOptions>  {

    private producer: Promise<any>;

    private options: KafkaEventBrokerOptions;

    private consumerGroups: ConsumerGroup[];

    private logger: (msg: string) => void;
    constructor() {
        this.consumerGroups = [];
        this.logger = debug("event-stream:KafkaEventBroker");
    }
    public async connect(options: KafkaEventBrokerOptions) {
        this.options = Object.assign({
            sessionTimeout: 15000,
            protocol: ["roundrobin"],
            fromOffset: "earliest",
        }, options);
        await this.ensureProducerIsReady();
    }
    public async disconnect(): Promise<void> {

        const client = await this.producer;
        return new Promise<void>(async (resolve, reject) => {

            await Promise.all(this.consumerGroups.map((consumerGroup) => {
                return new Promise<void>((resolveConsumer, rejectConsumer) => {
                     consumerGroup.close(() => {
                        resolveConsumer();
                     });
                });
            }));
            client.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async subscribe(topic: any, callback: (payload: EventBrokerPayload) => void): Promise<void> {
        await this.ensureTopicExists(topic);
        await this.startConsumingTopics(topic, callback);
    }

    public async emit(topic, payload) {
        await this.ensureProducerIsReady();
        await this.ensureTopicExists(topic);
        await this.sendMessage(topic, payload);
    }

    private async ensureProducerIsReady() {
        if (!this.options) {
            throw new Error("you  have to call connect first!");
        }
        if (this.producer == null) {
            this.producer = this.createJKafkaProducer(this.options);
        }
        await this.producer;
    }

    private async startConsumingTopics(topic, callback: (...args) => any) {
        return new Promise((resolve, reject) => {
            const consumerGroup = new ConsumerGroup(this.options, topic);
            this.consumerGroups.push(consumerGroup);
            consumerGroup.on("error", (err) => {
                this.logger("Error subscription" + topic);
                reject(err);
            });
            consumerGroup.on("rebalanced", () =>  {
                this.logger("Subscribed to topic " + topic);
                resolve();
            });
            consumerGroup.on("message", (event: any) => {
                this.logger("Got event " + JSON.stringify(event));
                let result;
                try {
                    result = JSON.parse(event.value);
                } catch (e) {
                    throw new Error("kafkaEventBroker: cant pass json value for event: " + JSON.stringify(event));
                }
                callback(result);
            });
        });
    }

    private async ensureTopicExists(topic) {
        await this.ensureProducerIsReady();
        return new Promise(async (resolve, reject) => {
            const client = await this.producer;
            client.createTopics([topic], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.logger(`Created tipic: ${result}`);
                resolve(topic);
            });
        });
    }

    private createJKafkaProducer(options: KafkaEventBrokerOptions) {
        return new Promise(async (resolve, reject) => {
            let promiseCompleted = false;
            const client = new Client(options.host);
            const producer = new HighLevelProducer(client);

            this.logger(`Start connecting to ${options.host}`);
            producer.on("ready", () => {
                this.logger("Kafka is ready");
                if (!promiseCompleted) { resolve(producer); }
                promiseCompleted = true;
            });
            producer.on("error", (err) => {
                this.logger(`Droped Producer ${JSON.stringify(err, null, 4)}`);
                if (!promiseCompleted) { reject(err); }
                promiseCompleted = true;
            });
        });
    }

    private sendKafkaEvent(producer, topic, message) {
        let rets = 0;
        this.logger(`Send message: message ${message} to topic ${topic}`);
        return new Promise((resolve, reject) => {
            producer.send([
                { topic, messages: [message] },
            ], (err, data) => {
                if (err) { this.logger(`An error occured : ${err}`); } else {
                    resolve(data);
                    this.logger("send %d messages" +  ++rets);
                }
                if (rets === 10) {
                    reject("Max retries exceeded");
                }
            });
        });
    }

    private async sendMessage(topic, msg) {
        if (this.producer !== null) {
            const prod = await this.producer;
            return this.sendKafkaEvent(prod, topic, JSON.stringify(msg));
        }
        throw new Error(`Cant send ${msg} to ${topic}`);
    }

}
