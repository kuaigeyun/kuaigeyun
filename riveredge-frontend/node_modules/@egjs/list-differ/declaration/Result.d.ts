export default class Result<T = any> {
    prevList: T[];
    list: T[];
    added: number[];
    removed: number[];
    changed: number[][];
    maintained: number[][];
    private changedBeforeAdded;
    private fixed;
    private cacheOrdered;
    private cachePureChanged;
    constructor(prevList: T[], list: T[], added: number[], removed: number[], changed: number[][], maintained: number[][], changedBeforeAdded: number[][], fixed: boolean[]);
    readonly ordered: number[][];
    readonly pureChanged: number[][];
    private caculateOrdered;
}
