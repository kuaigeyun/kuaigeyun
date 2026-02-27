import { Change } from "./types";
type Diffable = Record<string, any> | Array<any> | string;
export declare const getChanges: (a: Diffable, b: Diffable) => Change[];
export {};
