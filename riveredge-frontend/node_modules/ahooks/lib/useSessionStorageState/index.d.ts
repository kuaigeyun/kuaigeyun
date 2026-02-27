declare const useSessionStorageState: <T>(key: string, options?: import("../createUseStorageState").Options<T>) => readonly [T, (value: import("../createUseStorageState").SetState<T>) => void];
export default useSessionStorageState;
