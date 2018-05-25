# Event-Stream lib

## Getting started

**Install Lib**

```
    npm install git+https://bitbucket.org/rightmart/lib-event-stream.git --save
```

**Example-Kafka**

You finde more example in the [example folder](./example)

```


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


```


## Development

* run `npm install`
* Edit source in ./src


## Deployment

* run `git status ` - to ensure you committed all changes
* run `docker-compose up` - This will block the terminal.
* run `npm run test && npm run lint`
* run `npm run build`
* run `git add ./build`
* run `git tag` to show the lates version numer
* run `git commit -m .'Version vx.x.x'`
* run `git tag vx.x.x.` and increment the version number
* run `push origin master --tags`
