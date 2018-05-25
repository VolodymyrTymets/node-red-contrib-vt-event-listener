import EventStream from "./../src/Index";
import { expect } from "chai";
import "mocha";
import EventStreamManager from "../src/EventStreamManager";
import MockEventBroker from "../src/adapaters/MockEventBroker";
import {EventStreamMethodOptionsBuilder} from "../src/EventStreamMethodOptionsBuilder";

describe("EventStreamMethodOptionsBuilder.test.ts", () => {
    const manager = new EventStreamManager("test", MockEventBroker, {});

    const additionTagForNODEENV = (
        typeof process.env.NODE_ENV !== "undefined"
        && process.env.NODE_ENV !== "undefined"
        ) ? 1 : 0;

    it("It should return default tags", () => {
        const options = EventStreamMethodOptionsBuilder.getDefaultOptions(manager);
        expect(options.tags).to.be.a("array");
        console.log("tags", options);
        expect(options.tags.length).to.equals(1 + additionTagForNODEENV);

        expect(options.userId).to.equals("s333zQLf67ufCL8hK");

    });

    it("It should add tag ", () => {
        const builder = new EventStreamMethodOptionsBuilder(manager);

        const options = builder.addTag("test111").build();
        expect(options.tags).to.be.a("array");
        expect(options.tags.length).to.equals(2 + additionTagForNODEENV);
        expect(options.tags.pop()).to.equals("test111");

    });

    it("It should not add duplicate tags", () => {
        const builder = new EventStreamMethodOptionsBuilder(manager);

        const options = builder
            .addTag("test111")
            .addTag("test111")
            .build();
        expect(options.tags).to.be.a("array");
        expect(options.tags.length).to.equals(2 + additionTagForNODEENV);
        expect(options.tags.pop()).to.equals("test111");

    });

    it("It should set the userId", () => {
        const builder = new EventStreamMethodOptionsBuilder(manager);

        const options = builder
            .setUserId("yoda")
            .build();
        expect(options.userId).to.be.a("string");
        expect(options.userId).to.equals("yoda");

    });

});
