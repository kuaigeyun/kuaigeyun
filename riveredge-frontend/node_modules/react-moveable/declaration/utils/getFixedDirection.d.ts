export declare function getFixedDirectionInfo(startPositions: number[][], fixedDirection: number[]): {
    fixedPosition: number[];
    fixedDirection: number[];
    fixedOffset: number[];
};
export declare function getOffsetFixedDirectionInfo(state: {
    allMatrix: number[];
    is3d: boolean;
    width: number;
    height: number;
}, fixedDirection: number[]): {
    fixedPosition: number[];
    fixedDirection: number[];
    fixedOffset: number[];
};
export declare function getOffsetFixedPositionInfo(state: {
    allMatrix: number[];
    is3d: boolean;
    width: number;
    height: number;
}, offsetFixedPosition: number[]): {
    fixedPosition: number[];
    fixedDirection: number[];
    fixedOffset: number[];
};
