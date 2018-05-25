export declare class IllegalArgumentException extends Error {
}
export declare function validateFieldUrn(urn: any): Promise<boolean>;
export declare function getFieldForUrn(urn: any): Promise<{
    namespace: any;
    entity: any;
    column: any;
}>;
export declare function getFieldUrnFromProcessUrn(urn: any): Promise<string>;
export declare function getEntityId(urn: any): any;
