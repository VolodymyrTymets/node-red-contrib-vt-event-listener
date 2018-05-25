"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventStreamManager_1 = require("./EventStreamManager");
var EventStreamMethodOptionsBuilder = /** @class */ (function () {
    function EventStreamMethodOptionsBuilder(manager) {
        this.userId = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
        this.tags = EventStreamMethodOptionsBuilder.getDefaultTags();
        this.topic = null;
        this.manager = manager;
        this.addTag(this.manager.getServiceName());
    }
    EventStreamMethodOptionsBuilder.getDefaultOptions = function (manager) {
        return new EventStreamMethodOptionsBuilder(manager).build();
    };
    EventStreamMethodOptionsBuilder.getDefaultTags = function () {
        var defaultTags = [];
        if (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV !== "undefined") {
            defaultTags.push(process.env.NODE_ENV.trim());
        }
        return defaultTags;
    };
    EventStreamMethodOptionsBuilder.prototype.setUserId = function (userId) {
        this.userId = userId;
        return this;
    };
    EventStreamMethodOptionsBuilder.prototype.addTag = function (tag) {
        if (this.tags.indexOf(tag) === -1) {
            this.tags.push(tag);
        }
        return this;
    };
    EventStreamMethodOptionsBuilder.prototype.setCustomTopic = function (topic) {
        this.topic = topic;
        return this;
    };
    EventStreamMethodOptionsBuilder.prototype.setGetFieldPayloadFunc = function (func) {
        this.getFieldPayloadFunc = func;
        return this;
    };
    EventStreamMethodOptionsBuilder.prototype.build = function () {
        var userid = this.userId;
        if (typeof this.userId === "undefined") {
            userid = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
        }
        if (this.userId === null) {
            userid = EventStreamMethodOptionsBuilder.SYSTEM_USER_ID;
        }
        var getFieldPayload;
        if (typeof this.getFieldPayloadFunc === "undefined" || this.getFieldPayloadFunc === null) {
            getFieldPayload = EventStreamManager_1.default
                .prototype[EventStreamMethodOptionsBuilder.GET_FIELD_PAYLOAD_DEFAULT_NAME]
                .bind(this.manager);
        }
        else {
            getFieldPayload = this.getFieldPayloadFunc.bind(this.manager);
        }
        return {
            userId: userid,
            tags: this.tags,
            topic: this.topic,
            getFieldPayload: getFieldPayload,
        };
    };
    EventStreamMethodOptionsBuilder.SYSTEM_USER_ID = "s333zQLf67ufCL8hK";
    EventStreamMethodOptionsBuilder.GET_FIELD_PAYLOAD_DEFAULT_NAME = "getFieldPayload";
    return EventStreamMethodOptionsBuilder;
}());
exports.EventStreamMethodOptionsBuilder = EventStreamMethodOptionsBuilder;
//# sourceMappingURL=EventStreamMethodOptionsBuilder.js.map