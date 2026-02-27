"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoxedTextNodeStyle = exports.getLinearTextNodeStyle = void 0;
const lodash_1 = require("lodash");
const measure_text_1 = require("./measure-text");
exports.getLinearTextNodeStyle = (0, lodash_1.memoize)((text, minWidth, maxWidth, depth = 0) => {
    const font = {
        fontWeight: depth === 0 ? 600 : 400,
        fontSize: depth === 0 ? 24 : 16,
    };
    const offset = depth === 0 ? [64, 30] : [12, 12];
    const size = (0, measure_text_1.measureTextSize)(text, offset, font, minWidth, maxWidth);
    return { font, size };
});
exports.getBoxedTextNodeStyle = (0, lodash_1.memoize)((text, minWidth, maxWidth, depth = 0) => {
    const font = {
        fontWeight: depth === 0 || depth === 1 ? 600 : 400,
        fontSize: depth === 0 ? 24 : 16,
    };
    const offset = depth === 0 ? [64, 30] : [36, 24];
    const size = (0, measure_text_1.measureTextSize)(text, offset, font, minWidth, maxWidth);
    return { font, size };
});
