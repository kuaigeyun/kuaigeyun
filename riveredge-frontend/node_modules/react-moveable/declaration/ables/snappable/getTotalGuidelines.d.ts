import { MoveableManagerInterface, SnappableProps, SnappableState, SnapGuideline, SnapDirectionPoses, PosGuideline, ElementGuidelineValue, SnapElementRect } from "../../types";
export declare function getTotalGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>): SnapGuideline[];
export declare function getGapGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, targetRect: SnapDirectionPoses, snapThresholds: number[]): SnapGuideline[];
export declare function startGridGroupGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, clientLeft: number, clientTop: number, snapOffset: {
    left: number;
    top: number;
    right: number;
    bottom: number;
}): void;
export declare function getGridGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, containerWidth: number, containerHeight: number, clientLeft: number | undefined, clientTop: number | undefined, snapOffset: {
    left: number;
    top: number;
    right: number;
    bottom: number;
}, isDisplayGridGuidelines?: boolean): SnapGuideline[];
export declare function checkBetweenRects(rect1: SnapDirectionPoses, rect2: SnapDirectionPoses, type: "horizontal" | "vertical", distance: number): boolean;
export declare function getElementGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>): SnapGuideline[];
export declare function getDefaultGuidelines(horizontalGuidelines: Array<PosGuideline | number | string> | false, verticalGuidelines: Array<PosGuideline | number | string> | false, width: number, height: number, clientLeft?: number, clientTop?: number, snapOffset?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
}): SnapGuideline[];
export declare function getSnapElementRects(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, values: ElementGuidelineValue[]): SnapElementRect[];
