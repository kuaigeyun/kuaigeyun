import { MatrixInfo } from "../types";
export interface MoveableElementMatrixInfo {
    hasZoom: boolean;
    hasFixed: boolean;
    originalRootMatrix: number[];
    rootMatrix: number[];
    beforeMatrix: number[];
    offsetMatrix: number[];
    allMatrix: number[];
    targetMatrix: number[];
    transformOrigin: number[];
    targetOrigin: number[];
    is3d: boolean;
    targetTransform: string;
    inlineTransform: string;
    offsetContainer: HTMLElement | null;
    offsetRootContainer: HTMLElement | null;
    matrixes: MatrixInfo[];
}
export declare function calculateMatrixStack(target: SVGElement | HTMLElement, container?: SVGElement | HTMLElement | null, rootContainer?: SVGElement | HTMLElement | null | undefined, isAbsolute3d?: boolean): MoveableElementMatrixInfo;
