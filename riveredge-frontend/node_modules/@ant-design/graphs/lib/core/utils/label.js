"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLabel = formatLabel;
const lodash_1 = require("lodash");
function formatLabel(datum, labelField) {
    const label = labelField
        ? typeof labelField === 'function'
            ? labelField(datum)
            : (0, lodash_1.get)(datum, `data.${labelField}`, datum.id)
        : datum.id;
    return String(label);
}
