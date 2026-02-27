"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTick = void 0;
/**
 * Returns a Promise that resolves after at least one tick of the
 * Macro Task Queue occurs.
 */
const waitForTick = () => new Promise((resolve) => {
    setTimeout(() => resolve(), 0);
});
exports.waitForTick = waitForTick;
//# sourceMappingURL=async.js.map