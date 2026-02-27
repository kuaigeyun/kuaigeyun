class Cache {
    constructor(populate) {
        Object.defineProperty(this, "populate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.populate = populate;
        this.value = undefined;
    }
    getValue() {
        return this.value;
    }
    access() {
        if (!this.value)
            this.value = this.populate();
        return this.value;
    }
    invalidate() {
        this.value = undefined;
    }
}
Object.defineProperty(Cache, "populatedBy", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (populate) => new Cache(populate)
});
export default Cache;
//# sourceMappingURL=Cache.js.map