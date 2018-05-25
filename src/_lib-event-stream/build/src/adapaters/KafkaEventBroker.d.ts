import EventBroker, { EventBrokerOptions, EventBrokerPayload } from "./EventBroker";
export interface KafkaEventBrokerOptions extends EventBrokerOptions {
    host: string;
    groupId: string;
}
export default class KafkaEventBroker implements EventBroker<KafkaEventBrokerOptions> {
    private producer;
    private options;
    private consumerGroups;
    private logger;
    constructor();
    connect(options: KafkaEventBrokerOptions): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(topic: any, callback: (payload: EventBrokerPayload) => void): Promise<void>;
    emit(topic: any, payload: any): Promise<void>;
    private ensureProducerIsReady();
    private startConsumingTopics(topic, callback);
    private ensureTopicExists(topic);
    private createJKafkaProducer(options);
    private sendKafkaEvent(producer, topic, message);
    private sendMessage(topic, msg);
}
