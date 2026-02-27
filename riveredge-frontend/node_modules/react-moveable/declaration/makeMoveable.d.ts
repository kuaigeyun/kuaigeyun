import { Able } from "./types";
import { InitialMoveable } from "./InitialMoveable";
export declare function makeMoveable<T extends Record<string, any> = {}>(ables: Array<Able<T>>): typeof InitialMoveable & (new (...args: any[]) => InitialMoveable<T>);
