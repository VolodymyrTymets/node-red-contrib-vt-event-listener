"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("debug");
var kafka_node_1 = require("kafka-node");
var KafkaEventBroker = /** @class */ (function () {
    function KafkaEventBroker() {
        this.consumerGroups = [];
        this.logger = debug_1.default("event-stream:KafkaEventBroker");
    }
    KafkaEventBroker.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.options = Object.assign({
                            sessionTimeout: 15000,
                            protocol: ["roundrobin"],
                            fromOffset: "earliest",
                        }, options);
                        return [4 /*yield*/, this.ensureProducerIsReady()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaEventBroker.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.producer];
                    case 1:
                        client = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(this.consumerGroups.map(function (consumerGroup) {
                                                return new Promise(function (resolveConsumer, rejectConsumer) {
                                                    consumerGroup.close(function () {
                                                        resolveConsumer();
                                                    });
                                                });
                                            }))];
                                        case 1:
                                            _a.sent();
                                            client.close(function (err) {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    resolve();
                                                }
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    KafkaEventBroker.prototype.subscribe = function (topic, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureTopicExists(topic)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.startConsumingTopics(topic, callback)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaEventBroker.prototype.emit = function (topic, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureProducerIsReady()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ensureTopicExists(topic)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sendMessage(topic, payload)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaEventBroker.prototype.ensureProducerIsReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options) {
                            throw new Error("you  have to call connect first!");
                        }
                        if (this.producer == null) {
                            this.producer = this.createJKafkaProducer(this.options);
                        }
                        return [4 /*yield*/, this.producer];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaEventBroker.prototype.startConsumingTopics = function (topic, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var consumerGroup = new kafka_node_1.ConsumerGroup(_this.options, topic);
                        _this.consumerGroups.push(consumerGroup);
                        consumerGroup.on("error", function (err) {
                            _this.logger("Error subscription" + topic);
                            reject(err);
                        });
                        consumerGroup.on("rebalanced", function () {
                            _this.logger("Subscribed to topic " + topic);
                            resolve();
                        });
                        consumerGroup.on("message", function (event) {
                            _this.logger("Got event " + JSON.stringify(event));
                            var result;
                            try {
                                result = JSON.parse(event.value);
                            }
                            catch (e) {
                                throw new Error("kafkaEventBroker: cant pass json value for event: " + JSON.stringify(event));
                            }
                            callback(result);
                        });
                    })];
            });
        });
    };
    KafkaEventBroker.prototype.ensureTopicExists = function (topic) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureProducerIsReady()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var client;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.producer];
                                        case 1:
                                            client = _a.sent();
                                            client.createTopics([topic], function (err, result) {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                _this.logger("Created tipic: " + result);
                                                resolve(topic);
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    KafkaEventBroker.prototype.createJKafkaProducer = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var promiseCompleted, client, producer;
            return __generator(this, function (_a) {
                promiseCompleted = false;
                client = new kafka_node_1.Client(options.host);
                producer = new kafka_node_1.HighLevelProducer(client);
                this.logger("Start connecting to " + options.host);
                producer.on("ready", function () {
                    _this.logger("Kafka is ready");
                    if (!promiseCompleted) {
                        resolve(producer);
                    }
                    promiseCompleted = true;
                });
                producer.on("error", function (err) {
                    _this.logger("Droped Producer " + JSON.stringify(err, null, 4));
                    if (!promiseCompleted) {
                        reject(err);
                    }
                    promiseCompleted = true;
                });
                return [2 /*return*/];
            });
        }); });
    };
    KafkaEventBroker.prototype.sendKafkaEvent = function (producer, topic, message) {
        var _this = this;
        var rets = 0;
        this.logger("Send message: message " + message + " to topic " + topic);
        return new Promise(function (resolve, reject) {
            producer.send([
                { topic: topic, messages: [message] },
            ], function (err, data) {
                if (err) {
                    _this.logger("An error occured : " + err);
                }
                else {
                    resolve(data);
                    _this.logger("send %d messages" + ++rets);
                }
                if (rets === 10) {
                    reject("Max retries exceeded");
                }
            });
        });
    };
    KafkaEventBroker.prototype.sendMessage = function (topic, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var prod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.producer !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.producer];
                    case 1:
                        prod = _a.sent();
                        return [2 /*return*/, this.sendKafkaEvent(prod, topic, JSON.stringify(msg))];
                    case 2: throw new Error("Cant send " + msg + " to " + topic);
                }
            });
        });
    };
    return KafkaEventBroker;
}());
exports.default = KafkaEventBroker;
//# sourceMappingURL=KafkaEventBroker.js.map