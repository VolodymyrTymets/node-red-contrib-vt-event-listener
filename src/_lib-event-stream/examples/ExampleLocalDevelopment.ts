
import EventStreamManager from "./../src/Index";
import {ENTITY_EVENT_TYPES} from "../src/EventStreamManager";
import MockEventBroker from "../src/adapaters/MockEventBroker";
import {emitTestData} from "./ExampleEmitEvents";

/**
 * Function to start listen for events - the important part of the example!
 * @returns {Promise<EventStreamManager>}
 */
async function bootstrapListen() {

    const serviceName = "consumer-group-id";

    const manager = new EventStreamManager(serviceName, MockEventBroker, {});

    const changeStreamUpdate = await manager.getEntityStream("record", ENTITY_EVENT_TYPES.UPDATE);

    changeStreamUpdate.forEach((changeRecordEvent) => {
        console.log(`Do something with your change event ${JSON.stringify(changeRecordEvent, null, 4)}` );
    }).then(() => {
        console.log("Stream finished, this usually never happens");
    }).catch((e) => {
        console.error("An error: ", e);
    });

    const changeStreamFields = await manager.getFieldStream();

    changeStreamFields.forEach((changeRecordEvent) => {
        console.log(`Do something with your changed data on cell level
        ${JSON.stringify(changeRecordEvent, null, 4 )}` );
    }).then(() => {
        console.log("Stream finished, this usually never happens");
    }).catch((e) => {
        console.error("An error: ", e);
    });

    const changeStreamProcess = await manager.getProcessChangesStream();

    changeStreamProcess.forEach((changeRecordEvent) => {
        console.log(`Do something with your metadata for a cell in the database
        ${JSON.stringify(changeRecordEvent, null, 4)}` );
    }).then(() => {
        console.log("Stream finished, this usually never happens");
    }).catch((e) => {
        console.error("An error: ", e);
    });

    return manager;
}

bootstrapListen().then(async (manager) => {
    console.log("Init complete - start emitting events!");
    await  emitTestData(manager);
    console.log("Events emitted!");
}).catch((err) => {
    console.error(err);
});
