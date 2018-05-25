import { expect } from "chai";
import "mocha";
import MockEventBroker from "../../src/adapaters/MockEventBroker";

describe("MockEventBrocker", () => {

    it("should fire event and trigger subscription", async () => {

        const options = {};
        const adapter = new MockEventBroker();
        await adapter.connect(options);

        let called = false;
        adapter.subscribe("test", () => {
            called = true;
        });
        adapter.emit("test", {tags: [], userId: "test"});
        expect(called).to.equals(true);

    });

});
