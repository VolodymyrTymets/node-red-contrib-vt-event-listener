import EventStreamManager, {FieldStreamPayload} from "./EventStreamManager";

export interface EventStreamMethodOptions {
    tags: string[];
    userId: string;
    topic: string;
    getFieldPayload: (entityName: string,
                      entityId: string,
                      fieldKey: string,
                      value: any,
                      options: EventStreamMethodOptions) => Promise<FieldStreamPayload>;
}

export class EventStreamMethodOptionsBuilder {

    public static getDefaultOptions(manager) {
        return new EventStreamMethodOptionsBuilder(manager).build();
    }

    private static readonly SYSTEM_USER_ID = "s333zQLf67ufCL8hK";

    private static readonly GET_FIELD_PAYLOAD_DEFAULT_NAME  = "getFieldPayload";

    private static getDefaultTags(): string[] {

        const defaultTags = [];

        if (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV !== "undefined") {
            defaultTags.push(process.env.NODE_ENV.trim());
        }

        return defaultTags;
    }
    private userId = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
    private tags = EventStreamMethodOptionsBuilder.getDefaultTags();
    private manager: EventStreamManager;
    private getFieldPayloadFunc: (entityName: string,
                                  entityId: string,
                                  fieldKey: string,
                                  value: any,
                                  options: EventStreamMethodOptions) => Promise<FieldStreamPayload>;
    private topic: string = null;

    constructor(manager: EventStreamManager) {
        this.manager = manager;
        this.addTag(this.manager.getServiceName());
    }

    public setUserId(userId: string): EventStreamMethodOptionsBuilder {
        this.userId = userId;
        return this;
    }

    public addTag(tag: string): EventStreamMethodOptionsBuilder {
        if (this.tags.indexOf(tag) === -1) {
            this.tags.push(tag);
        }
        return this;
    }
    public setCustomTopic(topic: string): EventStreamMethodOptionsBuilder {
        this.topic = topic;
        return this;
    }
    public setGetFieldPayloadFunc(func: (entityName: string,
                                         entityId: string,
                                         fieldKey: string,
                                         value: any,
                                         options: EventStreamMethodOptions) => Promise<FieldStreamPayload> )
    : EventStreamMethodOptionsBuilder {
        this.getFieldPayloadFunc = func;
        return this;
    }
    public build(): EventStreamMethodOptions {
        let userid = this.userId;

        if (typeof this.userId === "undefined") {
            userid  = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
        }
        if (this.userId === null) {
            userid  = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
        }
        let getFieldPayload;
        if (typeof this.getFieldPayloadFunc === "undefined" || this.getFieldPayloadFunc === null) {
            getFieldPayload  = EventStreamManager
                                .prototype[EventStreamMethodOptionsBuilder.GET_FIELD_PAYLOAD_DEFAULT_NAME]
                                .bind(this.manager);
        } else {
            getFieldPayload = this.getFieldPayloadFunc.bind(this.manager);
        }

        return {
            userId: userid,
            tags: this.tags,
            topic: this.topic,
            getFieldPayload,
        };
    }

}
