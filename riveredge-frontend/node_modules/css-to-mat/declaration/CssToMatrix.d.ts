import { MatrixInfo } from "./types";
export declare function createMatrix(): number[];
export declare function parseMat(transform: string | string[], size?: number | Record<string, ((pos: number) => number) | number>): number[];
export declare function getElementMatrix(el: HTMLElement): number[];
export declare function calculateMatrixDist(matrix: number[], pos: number[]): number[];
export declare function getDistElementMatrix(el: HTMLElement, container?: HTMLElement): number[];
export declare function toMat(matrixInfos: MatrixInfo[]): number[];
export declare function parse(transform: string | string[], size?: number | Record<string, ((pos: number) => number) | number>): MatrixInfo[];
