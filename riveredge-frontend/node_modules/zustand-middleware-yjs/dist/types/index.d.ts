export declare enum ChangeType {
    NONE = "none",
    INSERT = "insert",
    UPDATE = "update",
    DELETE = "delete",
    PENDING = "pending"
}
export type Change = [
    ChangeType,
    string | number,
    any
];
