import { MoveableClientRect, MoveableManagerInterface, SnapDirectionPoses, SnapDirections, SnappableProps, SnappableState } from "../../types";
export declare const VERTICAL_NAMES: readonly ["left", "right", "center"];
export declare const HORIZONTAL_NAMES: readonly ["top", "bottom", "middle"];
export declare const SNAP_SKIP_NAMES_MAP: {
    left: string;
    right: string;
    center: string;
    top: string;
    bottom: string;
    middle: string;
};
export declare const VERTICAL_NAMES_MAP: {
    readonly start: "left";
    readonly end: "right";
    readonly center: "center";
};
export declare const HORIZONTAL_NAMES_MAP: {
    readonly start: "top";
    readonly end: "bottom";
    readonly center: "middle";
};
export declare function getInitialBounds(): {
    left: boolean;
    top: boolean;
    right: boolean;
    bottom: boolean;
};
export declare function hasGuidelines(moveable: MoveableManagerInterface<any, any>, ableName: string): moveable is MoveableManagerInterface<SnappableProps, SnappableState>;
export declare function getSnapDirections(snapDirections: SnapDirections | boolean | undefined): SnapDirections;
export declare function mapSnapDirectionPoses(snapDirections: SnapDirections | boolean | undefined, snapPoses: SnapDirectionPoses): SnapDirectionPoses;
export declare function splitSnapDirectionPoses(snapDirections: SnapDirections | boolean | undefined, snapPoses: SnapDirectionPoses): {
    horizontalNames: ("bottom" | "top" | "middle")[];
    verticalNames: ("center" | "right" | "left")[];
    horizontal: number[];
    vertical: number[];
};
export declare function calculateContainerPos(rootMatrix: number[], containerRect: MoveableClientRect, n: number): number[];
export declare function solveLineConstants([point1, point2]: number[][]): [number, number, number];
