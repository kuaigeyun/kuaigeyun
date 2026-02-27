import { ControlPose } from "../../types";
export declare const HORIZONTAL_RADIUS_ORDER: number[];
export declare const VERTICAL_RADIUS_ORDER: number[];
export declare const HORIZONTAL_RADIUS_DIRECTIONS: readonly [1, -1, -1, 1];
export declare const VERTICAL_RADIUS_DIRECTIONS: readonly [1, 1, -1, -1];
export declare function getRadiusStyles(nextPoses: ControlPose[], isRelative: boolean, width: number, height: number, left?: number, top?: number, right?: number, bottom?: number): {
    radiusPoses: ControlPose[];
    styles: string[];
    raws: number[];
};
export declare function getRadiusRange(controlPoses: ControlPose[]): {
    horizontalRange: number[];
    verticalRange: number[];
};
export declare function getRadiusValues(values: string[], width: number, height: number, left: number, top: number, minCounts?: number[], full?: boolean): ControlPose[];
export declare function removeRadiusPos(controlPoses: ControlPose[], poses: number[][], index: number, startIndex: number, length?: number): void;
export declare function addRadiusPos(controlPoses: ControlPose[], poses: number[][], startIndex: number, horizontalIndex: number, verticalIndex: number, distX: number, distY: number, right: number, bottom: number, left?: number, top?: number): void;
export declare function splitRadiusPoses(controlPoses: ControlPose[], raws?: number[]): {
    horizontals: number[];
    verticals: number[];
};
