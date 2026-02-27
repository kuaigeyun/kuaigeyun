export declare const getLinearTextNodeStyle: ((text: string, minWidth: number, maxWidth: number, depth?: number) => {
    font: {
        fontWeight: number;
        fontSize: number;
    };
    size: [number, number];
}) & import("lodash").MemoizedFunction;
export declare const getBoxedTextNodeStyle: ((text: string, minWidth: number, maxWidth: number, depth?: number) => {
    font: {
        fontWeight: number;
        fontSize: number;
    };
    size: [number, number];
}) & import("lodash").MemoizedFunction;
