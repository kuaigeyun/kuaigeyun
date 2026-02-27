"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldAdapter = fieldAdapter;
var index_1 = require("./index");
function fieldAdapter(field) {
    switch (typeof field) {
        case 'function':
            return field;
        case 'string':
            return function (d) { return (0, index_1.get)(d, [field]); };
        default:
            return function () { return field; };
    }
}
