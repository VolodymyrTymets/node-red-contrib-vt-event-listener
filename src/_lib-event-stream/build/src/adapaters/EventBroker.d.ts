export interface EventBrokerPayload {
    tags: string[];
    userId: string;
}
export interface EventBrokerOptions {
}
export default interface EventBroker<T extends EventBrokerOptions> {
    connect(options: T): Promise<void>;
    disconnect(): Promise<void>;
    emit(topic: any, payload: any): Promise<void>;
    subscribe(topic: any, callback: (payload: EventBrokerPayload) => void): Promise<void>;
}
