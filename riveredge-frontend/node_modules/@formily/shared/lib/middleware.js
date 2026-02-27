"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = void 0;
var applyMiddleware = function (payload, fns) {
    if (fns === void 0) { fns = []; }
    var compose = function (payload, fns) {
        var prevPayload = payload;
        return Promise.resolve(fns[0](payload, function (payload) {
            return compose(payload !== null && payload !== void 0 ? payload : prevPayload, fns.slice(1));
        }));
    };
    return new Promise(function (resolve, reject) {
        compose(payload, fns.concat(function (payload) {
            resolve(payload);
        })).catch(reject);
    });
};
exports.applyMiddleware = applyMiddleware;
//# sourceMappingURL=middleware.js.map