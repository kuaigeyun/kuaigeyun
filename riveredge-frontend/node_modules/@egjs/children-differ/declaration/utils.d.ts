import { ChildrenDiffResult } from "./types";
export declare function diff<T extends Element = Element>(prevList: T[], list: T[]): ChildrenDiffResult<T>;
