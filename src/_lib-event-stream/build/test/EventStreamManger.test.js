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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var EventStreamManager_1 = require("./../src/EventStreamManager");
var MockEventBroker_1 = require("./../src/adapaters/MockEventBroker");
var chai_1 = require("chai");
require("mocha");
var EventStreamMethodOptionsBuilder_1 = require("../src/EventStreamMethodOptionsBuilder");
var TEST_ENTITY_NAMES;
(function (TEST_ENTITY_NAMES) {
    TEST_ENTITY_NAMES["BUILDING"] = "BUILDING";
    TEST_ENTITY_NAMES["PERSON"] = "PERSON";
    TEST_ENTITY_NAMES["CAR"] = "car";
})(TEST_ENTITY_NAMES || (TEST_ENTITY_NAMES = {}));
var es = new EventStreamManager_1.default("service-test", MockEventBroker_1.default, {});
function testEmitEntity(entityId, entityName, eventType) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, es.getEntityStream(entityName.toString(), eventType, EventStreamManager_1.TAG_STRATEGIES.NO_TAG_FILTER)];
                case 1:
                    stream = _a.sent();
                    return [4 /*yield*/, es.emitEntityEvent(entityName.toString(), eventType, entityId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, es.gracefulShutdown()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, stream.reduce(function (acc, current) { return current; })];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function testEmitField(entityName, entityId, changes) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, es.getFieldStream(EventStreamManager_1.TAG_STRATEGIES.NO_TAG_FILTER)];
                case 1:
                    stream = _a.sent();
                    return [4 /*yield*/, es.emitFieldChange(entityName.toString(), entityId, changes)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, es.gracefulShutdown()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, stream.toArray()];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
describe("EventStreamManager", function () {
    it("should fire event for UPDATE entity", function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testEmitEntity("test-id", TEST_ENTITY_NAMES.CAR, EventStreamManager_1.ENTITY_EVENT_TYPES.UPDATE)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.id).to.equals("test-id");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should fire event for CREATE entity", function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testEmitEntity("test-id", TEST_ENTITY_NAMES.PERSON, EventStreamManager_1.ENTITY_EVENT_TYPES.CREATE)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.id).to.equals("test-id");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should fire event for update entity", function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testEmitEntity("test-id", TEST_ENTITY_NAMES.CAR, EventStreamManager_1.ENTITY_EVENT_TYPES.DELETE)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.id).to.equals("test-id");
                    return [2 /*return*/];
            }
        });
    }); });
    it.skip("should emit if the event is from another entity ", function () { return __awaiter(_this, void 0, void 0, function () {
        var originalVar, eventManager, stream, called;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalVar = process.env.NODE_ENV;
                    process.env.NODE_ENV = "test-env";
                    eventManager = new EventStreamManager_1.default("test", MockEventBroker_1.default, {});
                    return [4 /*yield*/, eventManager.getFieldStream()];
                case 1:
                    stream = _a.sent();
                    called = false;
                    stream.forEach(function (event) {
                        called = true;
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, eventManager.emitFieldChange("record", "1", {
                            collValueThatChanged: "test",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                case 4:
                    _a.sent();
                    chai_1.expect(called).to.equals(false);
                    process.env.NODE_ENV = originalVar;
                    return [2 /*return*/];
            }
        });
    }); });
    it("should emit process change on the stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var originalVar, eventManager, stream, called, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalVar = process.env.NODE_ENV;
                    process.env.NODE_ENV = "test-env";
                    eventManager = new EventStreamManager_1.default("test", MockEventBroker_1.default, {});
                    return [4 /*yield*/, eventManager.getProcessChangesStream()];
                case 1:
                    stream = _a.sent();
                    called = false;
                    stream.forEach(function (event) {
                        called = true;
                    });
                    options = new EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder(eventManager)
                        .setCustomTopic(EventStreamManager_1.default.getProcessChangesTopic())
                        .build();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, eventManager.emitFieldChange("Process", "122222", {
                            stats: "valid",
                        }, options)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                case 4:
                    _a.sent();
                    chai_1.expect(called).to.equals(true);
                    process.env.NODE_ENV = originalVar;
                    return [2 /*return*/];
            }
        });
    }); });
    it("shouldsupport multiple reader for field stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var eventManager, streamA, streamB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventManager = new EventStreamManager_1.default("test", MockEventBroker_1.default, {});
                    return [4 /*yield*/, eventManager.getFieldStream()];
                case 1:
                    streamA = _a.sent();
                    streamA.forEach(function () { return console.log("StreamA"); }).catch(function (e) { return console.log(e); });
                    return [4 /*yield*/, eventManager.getFieldStream()];
                case 2:
                    streamB = _a.sent();
                    streamB.forEach(function () { return console.log("StreamB"); });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should fire event for field update", function () { return __awaiter(_this, void 0, void 0, function () {
        var date, json, result, stringEvent, dateEvent, numberEvent, jsonEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    date = new Date();
                    json = '[{"a":1}, {"b":1}]';
                    return [4 /*yield*/, testEmitField(TEST_ENTITY_NAMES.CAR, "222", {
                            string: "string",
                            number: 0.0000222,
                            date: date,
                            json: json,
                        })];
                case 1:
                    result = _a.sent();
                    stringEvent = result.find(function (event) { return event.process === "urn:service-test:car:222:string"; });
                    dateEvent = result.find(function (event) { return event.process === "urn:service-test:car:222:date"; });
                    numberEvent = result.find(function (event) { return event.process === "urn:service-test:car:222:number"; });
                    jsonEvent = result.find(function (event) { return event.process === "urn:service-test:car:222:json"; });
                    chai_1.expect(stringEvent.field).to.equals("urn:service-test:car:string");
                    chai_1.expect(dateEvent.field).to.equals("urn:service-test:car:date");
                    chai_1.expect(numberEvent.field).to.equals("urn:service-test:car:number");
                    chai_1.expect(jsonEvent.field).to.equals("urn:service-test:car:json");
                    chai_1.expect(stringEvent.value).to.equals("string");
                    chai_1.expect(dateEvent.value).to.equals(date.toISOString());
                    chai_1.expect(numberEvent.value).to.equals(0.0000222);
                    chai_1.expect(jsonEvent.value.length).to.equals(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=EventStreamManger.test.js.map