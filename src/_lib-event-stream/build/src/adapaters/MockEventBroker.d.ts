import EventBroker, { EventBrokerOptions, EventBrokerPayload } from "./EventBroker";
export interface MockEventBrokerOptions extends EventBrokerOptions {
}
export default class MockEventBroker implements EventBroker<MockEventBrokerOptions> {
    private subscriptions;
    constructor();
    connect(options: MockEventBrokerOptions): Promise<void>;
    disconnect(): Promise<void>;
    emit(topic: any, payload: EventBrokerPayload): Promise<void>;
    subscribe(topic: any, callback: (payload: EventBrokerPayload) => void): Promise<void>;
    private ensureTopicExists(topic);
}
