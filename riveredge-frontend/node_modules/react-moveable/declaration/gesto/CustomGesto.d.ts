import { MoveableManagerState, OnCustomDrag } from "../types";
export declare function setCustomDrag(e: any, state: MoveableManagerState<any>, delta: number[], isPinch: boolean, isConvert: boolean, ableName?: string): any;
export default class CustomGesto {
    private ableName;
    private prevX;
    private prevY;
    private startX;
    private startY;
    private isDrag;
    private isFlag;
    private datas;
    constructor(ableName?: string);
    dragStart(client: number[], e: any): {
        type: string;
        inputEvent: any;
        isDrag: boolean;
        isFirstDrag: boolean;
        datas: import("@daybrush/utils").IObject<any>;
        originalDatas: import("@daybrush/utils").IObject<any>;
        parentEvent: boolean;
        parentGesto: CustomGesto;
        clientX: number;
        clientY: number;
        originalClientX?: number | undefined;
        originalClientY?: number | undefined;
        distX: number;
        distY: number;
        deltaX: number;
        deltaY: number;
    };
    drag(client: number[], inputEvent: any): OnCustomDrag;
    move(delta: number[], inputEvent: any): OnCustomDrag;
}
