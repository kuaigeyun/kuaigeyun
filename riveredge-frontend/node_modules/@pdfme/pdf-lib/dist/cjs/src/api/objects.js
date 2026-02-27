"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asNumber = exports.asPDFNumber = exports.asPDFName = void 0;
const core_1 = require("../core");
const asPDFName = (name) => name instanceof core_1.PDFName ? name : core_1.PDFName.of(name);
exports.asPDFName = asPDFName;
const asPDFNumber = (num) => num instanceof core_1.PDFNumber ? num : core_1.PDFNumber.of(num);
exports.asPDFNumber = asPDFNumber;
const asNumber = (num) => num instanceof core_1.PDFNumber ? num.asNumber() : num;
exports.asNumber = asNumber;
//# sourceMappingURL=objects.js.map