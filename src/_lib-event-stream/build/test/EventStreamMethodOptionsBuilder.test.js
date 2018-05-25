"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var EventStreamManager_1 = require("../src/EventStreamManager");
var MockEventBroker_1 = require("../src/adapaters/MockEventBroker");
var EventStreamMethodOptionsBuilder_1 = require("../src/EventStreamMethodOptionsBuilder");
describe("EventStreamMethodOptionsBuilder.test.ts", function () {
    var manager = new EventStreamManager_1.default("test", MockEventBroker_1.default, {});
    var additionTagForNODEENV = (typeof process.env.NODE_ENV !== "undefined"
        && process.env.NODE_ENV !== "undefined") ? 1 : 0;
    it("It should return default tags", function () {
        var options = EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder.getDefaultOptions(manager);
        chai_1.expect(options.tags).to.be.a("array");
        console.log("tags", options);
        chai_1.expect(options.tags.length).to.equals(1 + additionTagForNODEENV);
        chai_1.expect(options.userId).to.equals("s333zQLf67ufCL8hK");
    });
    it("It should add tag ", function () {
        var builder = new EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder(manager);
        var options = builder.addTag("test111").build();
        chai_1.expect(options.tags).to.be.a("array");
        chai_1.expect(options.tags.length).to.equals(2 + additionTagForNODEENV);
        chai_1.expect(options.tags.pop()).to.equals("test111");
    });
    it("It should not add duplicate tags", function () {
        var builder = new EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder(manager);
        var options = builder
            .addTag("test111")
            .addTag("test111")
            .build();
        chai_1.expect(options.tags).to.be.a("array");
        chai_1.expect(options.tags.length).to.equals(2 + additionTagForNODEENV);
        chai_1.expect(options.tags.pop()).to.equals("test111");
    });
    it("It should set the userId", function () {
        var builder = new EventStreamMethodOptionsBuilder_1.EventStreamMethodOptionsBuilder(manager);
        var options = builder
            .setUserId("yoda")
            .build();
        chai_1.expect(options.userId).to.be.a("string");
        chai_1.expect(options.userId).to.equals("yoda");
    });
});
//# sourceMappingURL=EventStreamMethodOptionsBuilder.test.js.map