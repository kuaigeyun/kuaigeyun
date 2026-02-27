import { Able } from "../types";
export declare function makeAble<Name extends string, AbleObject extends Partial<Able<any, any>>>(name: Name, able: AbleObject): {
    readonly events: AbleObject["events"] extends readonly any[] ? AbleObject["events"] : readonly [];
    readonly props: AbleObject["props"] extends readonly any[] ? AbleObject["props"] : readonly [];
    readonly name: Name;
} & AbleObject;
