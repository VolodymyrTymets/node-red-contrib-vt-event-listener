
import EventStreamManager from "./../src/Index";
import KafkaEventBroker from "../src/adapaters/KafkaEventBroker";
import {ENTITY_EVENT_TYPES} from "../src/EventStreamManager";

async function bootstrap() {

    const serviceName = "consumer-group-id";

    const options = {
        zookeeperHost: "localhost:2181",
        // Just to ensure that we are the only consumer group there.
        // Otherwise this could lead to an error on local development
        groupId: serviceName,
    };
    const manger = new EventStreamManager(serviceName, KafkaEventBroker, options);

    const changeStream = await manger.getEntityStream("records", ENTITY_EVENT_TYPES.UPDATE);

    changeStream.forEach((changeRecordEvent) => {
        console.log(`Do something with your data ${changeRecordEvent}` );
    }).then(() => {
        console.log("Stream finished, this usually never happens");
    }).catch((e) => {
        console.error("An error: ", e);
    });

}

bootstrap().then(() => {
    console.log("Yes!");
}).catch((err) => {
    console.error(err);
});
