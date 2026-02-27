interface IRecycleTarget {
    onMount: () => void;
    onUnmount: () => void;
}
export declare const useAttach: <T extends IRecycleTarget>(target: T) => T;
export {};
