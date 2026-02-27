export default class PolyMap<T> {
    private keys;
    private values;
    get(key: T): number;
    set(key: T, value: number): void;
}
