import { MatrixInfo } from "../types";
export declare function getShadowRoot(parentElement: HTMLElement | SVGElement): Node | undefined;
export interface MatrixStackInfo {
    zoom: number;
    offsetContainer: HTMLElement;
    matrixes: MatrixInfo[];
    targetMatrix: number[];
    transformOrigin: number[];
    targetOrigin: number[];
    is3d: boolean;
    hasFixed: boolean;
}
export declare function getMatrixStackInfo(target: SVGElement | HTMLElement, container?: SVGElement | HTMLElement | null, checkContainer?: boolean): MatrixStackInfo;
