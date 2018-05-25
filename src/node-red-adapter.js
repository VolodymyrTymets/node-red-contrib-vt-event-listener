const { EventStreamManager, ENTITY_EVENT_TYPES, MockEventBroker, emitTestData } = require("./ts-export.js");

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
    node.log && node.log('new event ->', newEvent);
    console.log('new event ->', newEvent);
    msg.payload.event = newEvent;
    // send response
    node.send(msg);
  }).then(() => {
    node.warn && node.warn("Stream finished, this usually never happens");
    console.log("Stream finished, this usually never happens");
  }).catch((e) => {
    node.warn && node.warn("An error: ", e);
    console.log("An error: ", e);
  });

  return manager;
}


const nodeRedAdapter = (node, msg) =>  {
  return bootstrapListen(node, msg).then(async (manager) => {
    node.log &&  node.log("Init complete - start emitting events!");
    console.log("Init complete - start emitting events!");
    await  emitTestData(manager);
    node.log &&  node.log("Events emitted!");
  }).catch((err) => {
    node.warn && node.warn(err);
    console.log(err);
  });
};

module.exports = { nodeRedAdapter };