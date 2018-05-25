import EventBroker, {EventBrokerOptions, EventBrokerPayload} from "./EventBroker";

export interface MockEventBrokerOptions extends EventBrokerOptions {

}
export default class MockEventBroker implements EventBroker<MockEventBrokerOptions> {

    private subscriptions: Map<string, Array<(payload: EventBrokerPayload) => void>>;

    constructor() {
        this.subscriptions = new Map();
    }
    public connect(options: MockEventBrokerOptions): Promise<void> {
        return Promise.resolve();
    }
    public disconnect(): Promise<void> {
        delete this.subscriptions;
        this.subscriptions = new Map();
        return Promise.resolve();
    }

    public emit(topic, payload: EventBrokerPayload): Promise<void> {
        this.ensureTopicExists(topic);
        const transformedPayload = JSON.parse(JSON.stringify(payload));
        this.subscriptions
            .get(topic)
            .map((subscription) => subscription(transformedPayload));

        return Promise.resolve();
    }
    public subscribe(topic: any, callback: (payload: EventBrokerPayload) => void): Promise<void> {
        this.ensureTopicExists(topic);
        this.subscriptions.get(topic).push(callback);

        return Promise.resolve();
    }
    private ensureTopicExists(topic) {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, []);
        }
    }

}
