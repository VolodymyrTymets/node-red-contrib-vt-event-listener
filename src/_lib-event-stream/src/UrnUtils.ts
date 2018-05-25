const URN_DELIMITER = ":";
const URN_FIELD_SCHEMA = [
    async (prefix) => prefix === "urn",
    async (namespace) => true,
    async (entity) => true,
    async (property) => true,
];
export class IllegalArgumentException extends Error {

}
export async function validateFieldUrn(urn) {

    const splits = urn.split(URN_DELIMITER);

    if (splits.length !== URN_FIELD_SCHEMA.length) {
        return false;
    }

    let result;
    try {
        result = await Promise.all(
            splits.map((value, index) => URN_FIELD_SCHEMA[index](value)),
        );
    } catch (err) {
        throw new IllegalArgumentException(err);
    }

    const falseResults = result.filter((re) => re === false);

    return falseResults.length === 0;

}
export async function getFieldForUrn(urn) {
    const fieldSplits = urn.split(URN_DELIMITER);

    if (!(fieldSplits.length === 4 || fieldSplits.length === 5)) {
        throw new IllegalArgumentException("Urn is not valid " + urn);
    }

    let prefix;
    let namespace;
    let entity;
    let column;
    let foreignKey;

    if (fieldSplits.length === 4) {
        [prefix, namespace, entity, column] = fieldSplits;
    } else {
        [prefix, namespace, entity, foreignKey, column] = fieldSplits;
    }

    // Transform "manager.record" to just "record".
    // This is neccecary because we have to sync 2 entities with the same name
    // and for this we use different kafka channels
    const namespaceParts = entity.split(".");
    const reformattedEntity = namespaceParts.pop();
    return {
        namespace,
        entity: reformattedEntity,
        column,
    };
}
export async function getFieldUrnFromProcessUrn(urn) {
    const field = await getFieldForUrn(urn);
    return ["urn", field.namespace, field.entity, field.column].join(URN_DELIMITER);
}
export function getEntityId(urn) {
    const splits = urn.split(URN_DELIMITER);
    if (splits.length !== 5 ) {
        throw new IllegalArgumentException("urn is not a process urn " + urn);
    }
    return splits[splits.length - 2];
}
