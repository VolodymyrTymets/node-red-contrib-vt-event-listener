import { expect } from "chai";
import "mocha";
import MockEventBroker from "../../src/adapaters/MockEventBroker";
import KafkaEventBroker from "../../src/adapaters/KafkaEventBroker";
import set = Reflect.set;

describe("KafakaEventBrocker", function() {

    this.timeout(20000);
    it("should fire event and trigger subscription", async () => {

        const randomPostfix = Math.round(Math.random() * 1000);
        const options = {
            host: "localhost:2181",
            // Just to ensure that we are the only consumer group there.
            // Otherwise this could lead to an error on local development
            groupId: "my-test-service" + randomPostfix,
        };
        const adapter = new KafkaEventBroker();
        await adapter.connect(options);

        let called = false;
        await adapter.subscribe("test" + randomPostfix, () => {
            called = true;
        });

        await adapter.emit("test" + randomPostfix, {});

        // Wait 1 sec
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(called).to.equals(true);

        await adapter.disconnect();

    });

});
