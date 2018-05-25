require("ts-node").register();
const { EventStreamManager, ENTITY_EVENT_TYPES, MockEventBroker, emitTestData } = require("./node-red-adapter.ts");

/**
 * Function to start listen for events - the important part of the example!
 * @returns {Promise<EventStreamManager>}
 */
async function bootstrapListen(node, msg) {

  const serviceName = "consumer-group-id";

  const manager = new EventStreamManager(serviceName, MockEventBroker, {});

  const changeStreamCreate = await manager.getEntityStream("record", ENTITY_EVENT_TYPES.CREATE);

  changeStreamCreate.forEach((newEvent) => {
    // set result value here
    msg.payload.event = newEvent;
    // send response
    node.send(msg);
  }).then(() => {
    mode.warn("Stream finished, this usually never happens");
  }).catch((e) => {
    mode.warn("An error: ", e);
  });

  return manager;
}


const nodeRedAdapter = (node, msg) =>  {
  bootstrapListen(node, msg).then(async (manager) => {
    mode.log("Init complete - start emitting events!");
    await  emitTestData(manager);
    mode.log("Events emitted!");
  }).catch((err) => {
    mode.warn(err);
  });
};

module.exports = { nodeRedAdapter };