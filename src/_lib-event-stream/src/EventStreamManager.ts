import EventBroker, {EventBrokerOptions, EventBrokerPayload} from "./adapaters/EventBroker";
import Stream, {ReadableStream} from "ts-stream";
import debug from "debug";
import {EventStreamMethodOptionsBuilder, EventStreamMethodOptions} from "./EventStreamMethodOptionsBuilder";

export enum ENTITY_EVENT_TYPES {
    CREATE= "create",
    UPDATE= "update",
    DELETE= "delete",
}

export enum TAG_STRATEGIES {
    EXACT,
    BEST_FIT,
    NO_TAG_FILTER,
}
export interface EventStreamChanges {
    [key: string]: any;
}
export interface EntityStreamPayload extends EventBrokerPayload {
    id: string;
}
export interface FieldStreamPayload extends EventBrokerPayload {
    process: string;
    field: string;
    value: string;
}

export interface ProcessStreamPayload extends EventBrokerPayload {
    process: string;
    field: string;
    value: string;
}

export default class EventStreamManager {

    public static getProcessChangesTopic() {
        return EventStreamManager.getTopic(
            EventStreamManager.PROCESS_TOPIC_PREFIX,
            EventStreamManager.PROCESS_TOPIC_EVENT_TYPE);
    }

    private static readonly URN_DELIMITER = ":";
    private static readonly URN_PREFIX = "urn";
    private static readonly TOPIC_DELIMITER = ".";
    private static readonly ENTITY_TOPIC_PREFIX = "Entities";
    private static readonly FIELD_TOPIC_PREFIX = "Fields";
    private static readonly FIELD_TOPIC_EVENT_TYPE = "Changed";
    private static readonly PROCESS_TOPIC_PREFIX = "Process";
    private static readonly PROCESS_TOPIC_EVENT_TYPE = "Changed";

    private static deserializeValue(raw: string): any {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            parsed = raw;
        }
        return parsed;
    }

    private static getTopic(entityName: string, subResource: string) {
        return [
            entityName.toLowerCase(),
            subResource.toLowerCase(),
        ].join(EventStreamManager.TOPIC_DELIMITER);
    }

    private static getNormalizedEntityName(entityName: string): string {
        // Remove dots from and just keep the record as entity name. E.g.  "manager.record" -> "record"
        return entityName.toLowerCase().split(".").pop();
    }
    private static getProcessUrn(serviceName, entityName, entityId, propertyName) {

        return [
            EventStreamManager.URN_PREFIX,
            serviceName.toLowerCase(),
            EventStreamManager.getNormalizedEntityName(entityName),
            entityId.toLowerCase(),
            propertyName.toLowerCase(),
        ].join(EventStreamManager.URN_DELIMITER);
    }

    private static getFieldUrn(serviceName, entityName, propertyName) {
        return [
            EventStreamManager.URN_PREFIX,
            serviceName.toLowerCase(),
            EventStreamManager.getNormalizedEntityName(entityName),
            propertyName.toLowerCase(),
        ].join(EventStreamManager.URN_DELIMITER);
    }
    private static getFieldTopic() {
        return EventStreamManager.getTopic(
            EventStreamManager.FIELD_TOPIC_PREFIX,
            EventStreamManager.FIELD_TOPIC_EVENT_TYPE);
    }

    private static getEntityTopic(entityName: string, eventType: ENTITY_EVENT_TYPES) {
        return EventStreamManager.getTopic(entityName, eventType.toString());
    }

    private  adapter: EventBroker<EventBrokerOptions>;
    private  options: EventBrokerOptions;

    private  serviceName: string;

    private streams: Map<string, Array<Stream<any>>>;
    private logger: (msg: string) => void;
    private additionalTags: string[];

    constructor(serviceName: string,
                adapaterClass: new () => EventBroker<EventBrokerOptions>, options: EventBrokerOptions ) {

        this.serviceName = serviceName;
        this.additionalTags = [];
        this.adapter = new adapaterClass();
        this.options = options;
        this.streams = new Map();
        this.logger = debug("event-stream:EventStreamManager");

    }
    public getServiceName(): string {
        return this.serviceName;
    }

    public async emitEntityEvent(entityName: string, eventType: ENTITY_EVENT_TYPES, id: string,
                                 options = EventStreamMethodOptionsBuilder.getDefaultOptions(this)) {

        this.logger(`emitEntityEvent: ${entityName} - ${eventType} for id ${id}`);

        await this.ensureReadyConnection();
        const topic = this.getTopicFromOptions(options, () => EventStreamManager.getEntityTopic(entityName, eventType));
        await this.emit(topic, {
            id,
            userId: options.userId,
            tags: options.tags,
        });
    }

    public async emitFieldChange(entityName: string, entityId: string, changes: EventStreamChanges,
                                 options = EventStreamMethodOptionsBuilder.getDefaultOptions(this)) {

        await this.ensureReadyConnection();

        const topic = this.getTopicFromOptions(options, () => EventStreamManager.getFieldTopic());

        const pendingEmits = Object.keys(changes)
            .map((key) => {
                const value = changes[key];
                return options.getFieldPayload(entityName, entityId, key, value, options);
            })
            .map(async (payloadPromise) => {
                const payload = await payloadPromise;
                return this.emit(topic, payload);
            });

        await Promise.all(pendingEmits);

    }
    public async getEntityStream(entityName,
                                 eventType: ENTITY_EVENT_TYPES,
                                 tagStrategy: TAG_STRATEGIES = TAG_STRATEGIES.BEST_FIT )
    : Promise<ReadableStream<EntityStreamPayload>> {

        await this.ensureReadyConnection();
        const topic = EventStreamManager.getEntityTopic(entityName, eventType);

        const stream =  await this.getOrCreateTopicStream<EntityStreamPayload>(topic);

        return this.filterByTagStrategy<EntityStreamPayload>(stream, tagStrategy);

    }

    public async getFieldStream(tagStrategy: TAG_STRATEGIES = TAG_STRATEGIES.BEST_FIT,
                                topic = EventStreamManager.getFieldTopic())
    : Promise<ReadableStream<FieldStreamPayload>> {
        await this.ensureReadyConnection();

        const stream =  await this.getOrCreateTopicStream<FieldStreamPayload>(topic);

        const filteredStream = await this.filterByTagStrategy<FieldStreamPayload>(stream, tagStrategy);
        return filteredStream.map((event) => {
            event.value = EventStreamManager.deserializeValue(event.value);
            return event;
        });
    }

    public async getProcessChangesStream(tagStrategy: TAG_STRATEGIES = TAG_STRATEGIES.BEST_FIT)
    : Promise<ReadableStream<ProcessStreamPayload>> {
        return this.getFieldStream(tagStrategy, EventStreamManager.getProcessChangesTopic());
    }

    public async gracefulShutdown() {
        this.streams.forEach((streams, key) => {
            streams.map((s) => s.end());
            this.streams.delete(key);
        });
    }

    private getTopicFromOptions(options: EventStreamMethodOptions, defaultFunc: () => string) {
        if (options.topic != null) {
            return options.topic;
        }
        return defaultFunc();

    }
    private async filterByTagStrategy<T extends EventBrokerPayload>(stream: ReadableStream<T>,
                                                                    strategy: TAG_STRATEGIES)
    : Promise<ReadableStream<T>> {

        if (strategy === TAG_STRATEGIES.NO_TAG_FILTER) {
            return stream;
        } else  {
            this.logger("WARNING: strategy: "  + strategy + " is not implemented! ");
        }

        return stream;
    }

    private async getFieldPayload(entityName: string, entityId: string, fieldKey: string, value: any,
                                  options: EventStreamMethodOptions) {

        const urnProcess = EventStreamManager.getProcessUrn(this.serviceName, entityName, entityId, fieldKey);
        const urnField = EventStreamManager.getFieldUrn(this.serviceName, entityName, fieldKey);

        return {
            process: urnProcess,
            field: urnField,
            value,
            userId: options.userId,
            tags: options.tags,
        };
    }

    private createEventCallback(topic) {
        return (event) => {
            const allStreams = this.streams.get(topic);

            Promise.all(allStreams .map((stream) => stream.write(event)))
                .catch((e) => {
                    this.logger("got exception during message handling  " + e.message);
            });
        };
    }
    private async getOrCreateTopicStream < T extends EventBrokerPayload >(topic: string): Promise < Stream < T >> {
        if (!this.streams.has(topic)) {
            this.streams.set(topic, []);
            await this.adapter.subscribe(topic, this.createEventCallback(topic));
        }

        const streams =  this.streams.get(topic);

        const newStream = new Stream<T>();
        streams.push(newStream);

        return newStream;
    }
    private async ensureReadyConnection() {
        await this.adapter.connect(this.options);
    }
    private async emit(topic, payload) {
        await this.adapter.emit(topic, payload);
    }
}
