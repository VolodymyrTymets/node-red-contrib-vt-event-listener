"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockEventBroker = /** @class */ (function () {
    function MockEventBroker() {
        this.subscriptions = new Map();
    }
    MockEventBroker.prototype.connect = function (options) {
        return Promise.resolve();
    };
    MockEventBroker.prototype.disconnect = function () {
        delete this.subscriptions;
        this.subscriptions = new Map();
        return Promise.resolve();
    };
    MockEventBroker.prototype.emit = function (topic, payload) {
        this.ensureTopicExists(topic);
        var transformedPayload = JSON.parse(JSON.stringify(payload));
        this.subscriptions
            .get(topic)
            .map(function (subscription) { return subscription(transformedPayload); });
        return Promise.resolve();
    };
    MockEventBroker.prototype.subscribe = function (topic, callback) {
        this.ensureTopicExists(topic);
        this.subscriptions.get(topic).push(callback);
        return Promise.resolve();
    };
    MockEventBroker.prototype.ensureTopicExists = function (topic) {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, []);
        }
    };
    return MockEventBroker;
}());
exports.default = MockEventBroker;
//# sourceMappingURL=MockEventBroker.js.map