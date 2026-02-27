import { MoveableClientRect, Writable } from "../types";
import { MoveableElementInfo } from "./getElementInfo";
export interface MoveableTargetInfo extends MoveableElementInfo {
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rootContainerClientRect: MoveableClientRect;
    beforeDirection: 1 | -1;
    beforeOrigin: number[];
    offsetDelta: number[];
    originalBeforeOrigin: number[];
    target: HTMLElement | SVGElement | null | undefined;
    style: Partial<Writable<CSSStyleDeclaration>>;
}
export declare function getMoveableTargetInfo(moveableElement?: HTMLElement | null, target?: HTMLElement | SVGElement | null, container?: HTMLElement | SVGElement | null, parentContainer?: HTMLElement | SVGElement | null, rootContainer?: HTMLElement | SVGElement | null, requestStyles?: Array<keyof CSSStyleDeclaration>): MoveableTargetInfo;
