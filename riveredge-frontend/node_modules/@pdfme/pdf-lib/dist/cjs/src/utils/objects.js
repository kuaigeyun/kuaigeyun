"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rectanglesAreEqual = exports.isStandardFont = exports.StandardFontValues = exports.values = void 0;
const standard_fonts_1 = require("@pdf-lib/standard-fonts");
const values = (obj) => Object.keys(obj).map((k) => obj[k]);
exports.values = values;
exports.StandardFontValues = (0, exports.values)(standard_fonts_1.FontNames);
const isStandardFont = (input) => exports.StandardFontValues.includes(input);
exports.isStandardFont = isStandardFont;
const rectanglesAreEqual = (a, b) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
exports.rectanglesAreEqual = rectanglesAreEqual;
//# sourceMappingURL=objects.js.map