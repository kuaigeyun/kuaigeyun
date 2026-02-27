import { MoveableClientRect } from "../types";
import { MatrixStackInfo } from "../utils/getMatrixStackInfo";
export declare type GetStyle = (propertyName: string) => any;
export declare function setStoreCache(useCache?: boolean): void;
export declare function getCachedClientRect(el: HTMLElement | SVGElement): MoveableClientRect;
export declare function getCachedMatrixContainerInfo(target: SVGElement | HTMLElement, container?: SVGElement | HTMLElement | null): MatrixStackInfo;
export declare function getCachedStyle(element: Element): GetStyle;
