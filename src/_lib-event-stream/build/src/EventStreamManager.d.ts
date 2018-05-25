import EventBroker, { EventBrokerOptions, EventBrokerPayload } from "./adapaters/EventBroker";
import { ReadableStream } from "ts-stream";
import { EventStreamMethodOptions } from "./EventStreamMethodOptionsBuilder";
export declare enum ENTITY_EVENT_TYPES {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
}
export declare enum TAG_STRATEGIES {
    EXACT = 0,
    BEST_FIT = 1,
    NO_TAG_FILTER = 2,
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
    static getProcessChangesTopic(): string;
    private static readonly URN_DELIMITER;
    private static readonly URN_PREFIX;
    private static readonly TOPIC_DELIMITER;
    private static readonly ENTITY_TOPIC_PREFIX;
    private static readonly FIELD_TOPIC_PREFIX;
    private static readonly FIELD_TOPIC_EVENT_TYPE;
    private static readonly PROCESS_TOPIC_PREFIX;
    private static readonly PROCESS_TOPIC_EVENT_TYPE;
    private static deserializeValue(raw);
    private static getTopic(entityName, subResource);
    private static getNormalizedEntityName(entityName);
    private static getProcessUrn(serviceName, entityName, entityId, propertyName);
    private static getFieldUrn(serviceName, entityName, propertyName);
    private static getFieldTopic();
    private static getEntityTopic(entityName, eventType);
    private adapter;
    private options;
    private serviceName;
    private streams;
    private logger;
    private additionalTags;
    constructor(serviceName: string, adapaterClass: new () => EventBroker<EventBrokerOptions>, options: EventBrokerOptions);
    getServiceName(): string;
    emitEntityEvent(entityName: string, eventType: ENTITY_EVENT_TYPES, id: string, options?: EventStreamMethodOptions): Promise<void>;
    emitFieldChange(entityName: string, entityId: string, changes: EventStreamChanges, options?: EventStreamMethodOptions): Promise<void>;
    getEntityStream(entityName: any, eventType: ENTITY_EVENT_TYPES, tagStrategy?: TAG_STRATEGIES): Promise<ReadableStream<EntityStreamPayload>>;
    getFieldStream(tagStrategy?: TAG_STRATEGIES, topic?: string): Promise<ReadableStream<FieldStreamPayload>>;
    getProcessChangesStream(tagStrategy?: TAG_STRATEGIES): Promise<ReadableStream<ProcessStreamPayload>>;
    gracefulShutdown(): Promise<void>;
    private getTopicFromOptions(options, defaultFunc);
    private filterByTagStrategy<T>(stream, strategy);
    private getFieldPayload(entityName, entityId, fieldKey, value, options);
    private createEventCallback(topic);
    private getOrCreateTopicStream<T>(topic);
    private ensureReadyConnection();
    private emit(topic, payload);
}
