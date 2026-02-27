import { BoundInfo, SnappableProps, BoundType, RotatableProps, MoveableManagerInterface, SnappableState } from "../../types";
export declare function checkBoundPoses(bounds: BoundType | false | undefined, verticalPoses: number[], horizontalPoses: number[]): {
    vertical: BoundInfo[];
    horizontal: BoundInfo[];
};
export declare function getBounds(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, externalBounds?: BoundType | false | null): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare function checkBoundKeepRatio(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, startPos: number[], endPos: number[]): {
    vertical: {
        isBound: boolean;
        offset: number;
        pos: number;
    };
    horizontal: {
        isBound: boolean;
        offset: number;
        pos: number;
    };
};
export declare function isBoundRotate(relativePoses: number[][], boundRect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
}, rad: number): boolean;
export declare function boundRotate(vec: number[], boundPos: number, index: number): number[];
export declare function checkRotateBounds(moveable: MoveableManagerInterface<SnappableProps & RotatableProps, SnappableState>, prevPoses: number[][], nextPoses: number[][], origin: number[], rotation: number): number[];
