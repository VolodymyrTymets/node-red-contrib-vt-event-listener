/**+
 * Function that emits a bunch of test data. In most of the cases you don't need to emit data.
 * @param {EventStreamManager}manager
 * @returns {Promise<void>}
 */

import {ENTITY_EVENT_TYPES, default as EventStreamManager} from "../src/EventStreamManager";
import {EventStreamMethodOptions, EventStreamMethodOptionsBuilder} from "../src/EventStreamMethodOptionsBuilder";

export async function emitTestData(manager) {

    await manager.emitEntityEvent("record", ENTITY_EVENT_TYPES.CREATE, "the-entity-id");
    await manager.emitEntityEvent("record", ENTITY_EVENT_TYPES.UPDATE, "the-entity-id-number-two");
    await manager.emitFieldChange("record", "the-entity-id-number-two", {
        "vars.additionalDocument_1": "https://giphy.com/gifs/JIX9t2j0ZTN9S",
        "agent": "useridOfTheAgent",
    });

    const processEmitOptions = new EventStreamMethodOptionsBuilder(manager)
        .setCustomTopic(EventStreamManager.getProcessChangesTopic())
        .setGetFieldPayloadFunc(async (entityName: string,
                                       entityId: string,
                                       fieldKey: string,
                                       value: any,
                                       options: EventStreamMethodOptions) => {
            const payload = await EventStreamMethodOptionsBuilder.getDefaultOptions(manager)
                .getFieldPayload(entityName, entityId, fieldKey, value, options);

            payload.process = "urn:service-manager:record:the-entity-id-number-two:vars.additionalDocument_1";

            return payload;
        }).build();

    await manager.emitFieldChange("manager.record", "the-entity-id-number-two", {
        status: "requested",
    }, processEmitOptions );

}