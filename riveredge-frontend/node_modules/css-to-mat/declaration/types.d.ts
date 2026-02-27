export interface MatrixInfo {
    name: string;
    value: string;
    matrixFunction: null | ((...args: any[]) => number[]);
    functionName: string;
    functionValue: any;
}
