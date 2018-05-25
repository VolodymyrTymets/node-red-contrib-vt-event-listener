import EventStreamManager, {
    ENTITY_EVENT_TYPES,
    EntityStreamPayload,
    FieldStreamPayload,
    EventStreamChanges, TAG_STRATEGIES,
} from "./../src/EventStreamManager";
import MockEventBroker from "./../src/adapaters/MockEventBroker";
import { expect } from "chai";
import "mocha";
import {EventStreamMethodOptionsBuilder} from "../src/EventStreamMethodOptionsBuilder";

enum TEST_ENTITY_NAMES {
    BUILDING= "BUILDING",
    PERSON= "PERSON",
    CAR= "car",
}

const es = new EventStreamManager("service-test", MockEventBroker, {});

async function testEmitEntity(entityId: string,
                              entityName: TEST_ENTITY_NAMES,
                              eventType: ENTITY_EVENT_TYPES): Promise<EntityStreamPayload> {

    const stream = await es.getEntityStream(entityName.toString(), eventType,  TAG_STRATEGIES.NO_TAG_FILTER);

    await es.emitEntityEvent(entityName.toString(), eventType, entityId);

    await es.gracefulShutdown();

    return await stream.reduce((acc, current) => current);

}

async function testEmitField( entityName: TEST_ENTITY_NAMES,
                              entityId: string,
                              changes: EventStreamChanges): Promise<FieldStreamPayload[]> {

    const stream = await es.getFieldStream(TAG_STRATEGIES.NO_TAG_FILTER);

    await es.emitFieldChange(entityName.toString(), entityId, changes);

    await es.gracefulShutdown();

    return await stream.toArray();

}

describe("EventStreamManager", () => {

    it("should fire event for UPDATE entity", async () => {

        const result = await testEmitEntity("test-id", TEST_ENTITY_NAMES.CAR, ENTITY_EVENT_TYPES.UPDATE);

        expect(result.id).to.equals("test-id");

    });

    it("should fire event for CREATE entity", async () => {

        const result = await testEmitEntity("test-id", TEST_ENTITY_NAMES.PERSON, ENTITY_EVENT_TYPES.CREATE);

        expect(result.id).to.equals("test-id");
    });

    it("should fire event for update entity", async () => {

        const result = await testEmitEntity("test-id", TEST_ENTITY_NAMES.CAR, ENTITY_EVENT_TYPES.DELETE);

        expect(result.id).to.equals("test-id");
    });

    it.skip("should emit if the event is from another entity ", async () => {

        const originalVar = process.env.NODE_ENV;
        process.env.NODE_ENV = "test-env";
        const eventManager = new EventStreamManager("test", MockEventBroker, {});

        const stream = await eventManager.getFieldStream();
        let called = false;
        stream.forEach((event) => {
            called = true;
        });

        await new Promise((resolve) => setTimeout(resolve, 200));
        await eventManager.emitFieldChange("record", "1", {
            collValueThatChanged: "test",
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(called).to.equals(false);
        process.env.NODE_ENV = originalVar;
    });

    it("should emit process change on the stream", async () => {

        const originalVar = process.env.NODE_ENV;
        process.env.NODE_ENV = "test-env";
        const eventManager = new EventStreamManager("test", MockEventBroker, {});

        const stream = await eventManager.getProcessChangesStream();
        let called = false;
        stream.forEach((event) => {
            called = true;
        });

        const options = new EventStreamMethodOptionsBuilder(eventManager)
            .setCustomTopic(EventStreamManager.getProcessChangesTopic())
            .build();
        await new Promise((resolve) => setTimeout(resolve, 200));
        await eventManager.emitFieldChange("Process", "122222", {
            stats: "valid",
        }, options);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(called).to.equals(true);
        process.env.NODE_ENV = originalVar;
    });

    it("shouldsupport multiple reader for field stream", async () => {
        const eventManager = new EventStreamManager("test", MockEventBroker, {});
        const streamA = await eventManager.getFieldStream();
        streamA.forEach(() => console.log("StreamA")).catch((e) => console.log(e));
        const streamB = await eventManager.getFieldStream();
        streamB.forEach(() => console.log("StreamB"));
    });

    it("should fire event for field update", async () => {

        const date = new Date();
        const json = '[{"a":1}, {"b":1}]';
        const result = await testEmitField( TEST_ENTITY_NAMES.CAR, "222", {
            string: "string",
            number: 0.0000222,
            date,
            json,

        });

        const stringEvent = result.find((event) => event.process === "urn:service-test:car:222:string");
        const dateEvent = result.find((event) => event.process === "urn:service-test:car:222:date");
        const numberEvent = result.find((event) => event.process === "urn:service-test:car:222:number");
        const jsonEvent = result.find((event) => event.process === "urn:service-test:car:222:json");

        expect(stringEvent.field).to.equals("urn:service-test:car:string");
        expect(dateEvent.field).to.equals("urn:service-test:car:date");
        expect(numberEvent.field).to.equals("urn:service-test:car:number");
        expect(jsonEvent.field).to.equals("urn:service-test:car:json");

        expect(stringEvent.value).to.equals("string");
        expect(dateEvent.value).to.equals(date.toISOString());
        expect(numberEvent.value).to.equals(0.0000222);
        expect(jsonEvent.value.length).to.equals(2);

    });

});
