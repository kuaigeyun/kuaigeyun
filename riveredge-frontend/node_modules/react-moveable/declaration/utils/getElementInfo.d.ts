import { ElementSizes, MoveablePosition } from "../types";
import { MoveableElementMatrixInfo } from "./calculateMatrixStack";
export interface MoveableElementInfo extends MoveableElementMatrixInfo, MoveablePosition, ElementSizes {
    width: number;
    height: number;
    rotation: number;
}
export declare function calculateElementInfo(target?: SVGElement | HTMLElement | null, container?: SVGElement | HTMLElement | null, rootContainer?: HTMLElement | SVGElement | null | undefined, isAbsolute3d?: boolean): MoveableElementInfo;
export declare function getElementInfo(target: SVGElement | HTMLElement, container?: SVGElement | HTMLElement | null, rootContainer?: SVGElement | HTMLElement | null | undefined): MoveableElementInfo;
