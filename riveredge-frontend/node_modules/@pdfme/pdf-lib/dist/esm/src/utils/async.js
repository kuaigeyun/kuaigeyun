/**
 * Returns a Promise that resolves after at least one tick of the
 * Macro Task Queue occurs.
 */
export const waitForTick = () => new Promise((resolve) => {
    setTimeout(() => resolve(), 0);
});
//# sourceMappingURL=async.js.map