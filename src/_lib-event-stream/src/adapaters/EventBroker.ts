export interface EventBrokerPayload {
    tags: string[];
    userId: string;
}
export interface EventBrokerOptions {

}
export default interface EventBroker<T extends EventBrokerOptions> {

    connect(options: T): Promise<void>;
    disconnect(): Promise<void>;
    emit(topic, payload): Promise<void>;
    subscribe(topic, callback: (payload: EventBrokerPayload) => void): Promise<void>;

}
