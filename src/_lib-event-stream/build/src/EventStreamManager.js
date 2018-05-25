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
var ts_stream_1 = require("ts-stream");
var debug_1 = require("debug");
var EventStreamMethodOptionsBuilder_1 = require("./EventStreamMethodOptionsBuilder");
var ENTITY_EVENT_TYPES;
(function (ENTITY_EVENT_TYPES) {
    ENTITY_EVENT_TYPES["CREATE"] = "create";
    ENTITY_EVENT_TYPES["UPDATE"] = "update";
    ENTITY_EVENT_TYPES["DELETE"] = "delete";
})(ENTITY_EVENT_TYPES = exports.ENTITY_EVENT_TYPES || (exports.ENTITY_EVENT_TYPES = {}));
var TAG_STRATEGIES;
(function (TAG_STRATEGIES) {
    TAG_STRATEGIES[TAG_STRATEGIES["EXACT"] = 0] = "EXACT";
    TAG_STRATEGIES[TAG_STRATEGIES["BEST_FIT"] = 1] = "BEST_FIT";
    TAG_STRATEGIES[TAG_STRATEGIES["NO_TAG_FILTER"] = 2] = "NO_TAG_FILTER";
})(TAG_STRATEGIES = exports.TAG_STRATEGIES || (exports.TAG_STRATEGIES = {}));
var EventStreamManager = /** @class */ (function () {
    function EventStreamManager(serviceName, adapaterClass, options) {
        this.serviceName = serviceName;
        this.additionalTags = [];
        this.adapter = new adapaterClass();
        this.options = options;
        this.streams = new Map();
        this.logger = debug_1.default("event-stream:EventStreamManager");
    }
    EventStreamManager.getProcessChangesTopic = function () {
        return EventStreamManager.getTopic(EventStreamManager.PROCESS_TOPIC_PREFIX, EventStreamManager.PROCESS_TOPIC_EVENT_TYPE);
    };
    EventStreamManager.deserializeValue = function (raw) {
        var parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch (e) {
            parsed = raw;
        }
        return parsed;
    };
    EventStreamManager.getTopic = function (entityName, subResource) {
        return [
            entityName.toLowerCase(),
            subResource.toLowerCase(),
        ].join(EventStreamManager.TOPIC_DELIMITER);
    };
    EventStreamManager.getNormalizedEntityName = function (entityName) {
        // Remove dots from and just keep the record as entity name. E.g.  "manager.record" -> "record"
        return entityName.toLowerCase().split(".").pop();
    };
    EventStreamManager.getProcessUrn = function (serviceName, entityName, entityId, propertyName) {
        return [
            EventStreamManager.URN_PREFIX,
            serviceName.toLowerCase(),
            EventStreamManager.getNormalizedEntityName(entityName),
            entityId.toLowerCase(),
            propertyName.toLowerCase(),
        ].join(EventStreamManager.URN_DELIMITER);
    };
    EventStreamManager.getFieldUrn = function (serviceName, entityName, propertyName) {
        return [
            EventStreamManager.URN_PREFIX,
            serviceName.toLowerCase(),
            EventStreamManager.getNormalizedEntityName(entityName),
            propertyName.toLowerCase(),
        ].join(EventStreamManager.URN_DELIMITER);
    };
    EventStreamManager.getFieldTopic = function () {
        return EventStreamManager.getTopic(EventStreamManager.FIELD_TOPIC_PREFIX, EventStreamManager.FIELD_TOPIC_EVENT_TYPE);
    };
    EventStreamManager.getEntityTopic = function (entityName, eventType) {
        return EventStreamManager.getTopic(entityName, eventType.toString());
    };
    EventStreamManager.prototype.getServiceName = function () {
        return this.serviceName;
    };
    EventStreamManager.prototype.emitEntityEvent = function (entityName, eventType, id, options) {
        if (options === void 0) { options = EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder.getDefaultOptions(this); }
        return __awaiter(this, void 0, void 0, function () {
            var topic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger("emitEntityEvent: " + entityName + " - " + eventType + " for id " + id);
                        return [4 /*yield*/, this.ensureReadyConnection()];
                    case 1:
                        _a.sent();
                        topic = this.getTopicFromOptions(options, function () { return EventStreamManager.getEntityTopic(entityName, eventType); });
                        return [4 /*yield*/, this.emit(topic, {
                                id: id,
                                userId: options.userId,
                                tags: options.tags,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventStreamManager.prototype.emitFieldChange = function (entityName, entityId, changes, options) {
        if (options === void 0) { options = EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder.getDefaultOptions(this); }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var topic, pendingEmits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureReadyConnection()];
                    case 1:
                        _a.sent();
                        topic = this.getTopicFromOptions(options, function () { return EventStreamManager.getFieldTopic(); });
                        pendingEmits = Object.keys(changes)
                            .map(function (key) {
                            var value = changes[key];
                            return options.getFieldPayload(entityName, entityId, key, value, options);
                        })
                            .map(function (payloadPromise) { return __awaiter(_this, void 0, void 0, function () {
                            var payload;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, payloadPromise];
                                    case 1:
                                        payload = _a.sent();
                                        return [2 /*return*/, this.emit(topic, payload)];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(pendingEmits)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventStreamManager.prototype.getEntityStream = function (entityName, eventType, tagStrategy) {
        if (tagStrategy === void 0) { tagStrategy = TAG_STRATEGIES.BEST_FIT; }
        return __awaiter(this, void 0, void 0, function () {
            var topic, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureReadyConnection()];
                    case 1:
                        _a.sent();
                        topic = EventStreamManager.getEntityTopic(entityName, eventType);
                        return [4 /*yield*/, this.getOrCreateTopicStream(topic)];
                    case 2:
                        stream = _a.sent();
                        return [2 /*return*/, this.filterByTagStrategy(stream, tagStrategy)];
                }
            });
        });
    };
    EventStreamManager.prototype.getFieldStream = function (tagStrategy, topic) {
        if (tagStrategy === void 0) { tagStrategy = TAG_STRATEGIES.BEST_FIT; }
        if (topic === void 0) { topic = EventStreamManager.getFieldTopic(); }
        return __awaiter(this, void 0, void 0, function () {
            var stream, filteredStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureReadyConnection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getOrCreateTopicStream(topic)];
                    case 2:
                        stream = _a.sent();
                        return [4 /*yield*/, this.filterByTagStrategy(stream, tagStrategy)];
                    case 3:
                        filteredStream = _a.sent();
                        return [2 /*return*/, filteredStream.map(function (event) {
                                event.value = EventStreamManager.deserializeValue(event.value);
                                return event;
                            })];
                }
            });
        });
    };
    EventStreamManager.prototype.getProcessChangesStream = function (tagStrategy) {
        if (tagStrategy === void 0) { tagStrategy = TAG_STRATEGIES.BEST_FIT; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getFieldStream(tagStrategy, EventStreamManager.getProcessChangesTopic())];
            });
        });
    };
    EventStreamManager.prototype.gracefulShutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.streams.forEach(function (streams, key) {
                    streams.map(function (s) { return s.end(); });
                    _this.streams.delete(key);
                });
                return [2 /*return*/];
            });
        });
    };
    EventStreamManager.prototype.getTopicFromOptions = function (options, defaultFunc) {
        if (options.topic != null) {
            return options.topic;
        }
        return defaultFunc();
    };
    EventStreamManager.prototype.filterByTagStrategy = function (stream, strategy) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (strategy === TAG_STRATEGIES.NO_TAG_FILTER) {
                    return [2 /*return*/, stream];
                }
                else {
                    this.logger("WARNING: strategy: " + strategy + " is not implemented! ");
                }
                return [2 /*return*/, stream];
            });
        });
    };
    EventStreamManager.prototype.getFieldPayload = function (entityName, entityId, fieldKey, value, options) {
        return __awaiter(this, void 0, void 0, function () {
            var urnProcess, urnField;
            return __generator(this, function (_a) {
                urnProcess = EventStreamManager.getProcessUrn(this.serviceName, entityName, entityId, fieldKey);
                urnField = EventStreamManager.getFieldUrn(this.serviceName, entityName, fieldKey);
                return [2 /*return*/, {
                        process: urnProcess,
                        field: urnField,
                        value: value,
                        userId: options.userId,
                        tags: options.tags,
                    }];
            });
        });
    };
    EventStreamManager.prototype.createEventCallback = function (topic) {
        var _this = this;
        return function (event) {
            var allStreams = _this.streams.get(topic);
            Promise.all(allStreams.map(function (stream) { return stream.write(event); }))
                .catch(function (e) {
                _this.logger("got exception during message handling  " + e.message);
            });
        };
    };
    EventStreamManager.prototype.getOrCreateTopicStream = function (topic) {
        return __awaiter(this, void 0, void 0, function () {
            var streams, newStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.streams.has(topic)) return [3 /*break*/, 2];
                        this.streams.set(topic, []);
                        return [4 /*yield*/, this.adapter.subscribe(topic, this.createEventCallback(topic))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        streams = this.streams.get(topic);
                        newStream = new ts_stream_1.default();
                        streams.push(newStream);
                        return [2 /*return*/, newStream];
                }
            });
        });
    };
    EventStreamManager.prototype.ensureReadyConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.connect(this.options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventStreamManager.prototype.emit = function (topic, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.emit(topic, payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventStreamManager.URN_DELIMITER = ":";
    EventStreamManager.URN_PREFIX = "urn";
    EventStreamManager.TOPIC_DELIMITER = ".";
    EventStreamManager.ENTITY_TOPIC_PREFIX = "Entities";
    EventStreamManager.FIELD_TOPIC_PREFIX = "Fields";
    EventStreamManager.FIELD_TOPIC_EVENT_TYPE = "Changed";
    EventStreamManager.PROCESS_TOPIC_PREFIX = "Process";
    EventStreamManager.PROCESS_TOPIC_EVENT_TYPE = "Changed";
    return EventStreamManager;
}());
exports.default = EventStreamManager;
//# sourceMappingURL=EventStreamManager.js.map