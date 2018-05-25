import EventStreamManager, { FieldStreamPayload } from "./EventStreamManager";
export interface EventStreamMethodOptions {
    tags: string[];
    userId: string;
    topic: string;
    getFieldPayload: (entityName: string, entityId: string, fieldKey: string, value: any, options: EventStreamMethodOptions) => Promise<FieldStreamPayload>;
}
export declare class EventStreamMethodOptionsBuilder {
    static getDefaultOptions(manager: any): EventStreamMethodOptions;
    private static readonly SYSTEM_USER_ID;
    private static readonly GET_FIELD_PAYLOAD_DEFAULT_NAME;
    private static getDefaultTags();
    private userId;
    private tags;
    private manager;
    private getFieldPayloadFunc;
    private topic;
    constructor(manager: EventStreamManager);
    setUserId(userId: string): EventStreamMethodOptionsBuilder;
    addTag(tag: string): EventStreamMethodOptionsBuilder;
    setCustomTopic(topic: string): EventStreamMethodOptionsBuilder;
    setGetFieldPayloadFunc(func: (entityName: string, entityId: string, fieldKey: string, value: any, options: EventStreamMethodOptions) => Promise<FieldStreamPayload>): EventStreamMethodOptionsBuilder;
    build(): EventStreamMethodOptions;
}
