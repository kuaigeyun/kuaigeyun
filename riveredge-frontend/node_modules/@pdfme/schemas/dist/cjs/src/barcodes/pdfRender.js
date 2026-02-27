"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRender = void 0;
const utils_js_1 = require("../utils.js");
const helper_js_1 = require("./helper.js");
const getBarcodeCacheKey = (schema, value) => {
    return `${schema.type}${schema.backgroundColor}${schema.barColor}${schema.textColor}${value}${schema.includetext}`;
};
const pdfRender = async (arg) => {
    const { value, schema, pdfDoc, page, _cache } = arg;
    if (!(0, helper_js_1.validateBarcodeInput)(schema.type, value))
        return;
    const inputBarcodeCacheKey = getBarcodeCacheKey(schema, value);
    let image = _cache.get(inputBarcodeCacheKey);
    if (!image) {
        const imageBuf = await (0, helper_js_1.createBarCode)({
            ...schema,
            type: schema.type,
            input: value,
        });
        image = await pdfDoc.embedPng(imageBuf);
        _cache.set(inputBarcodeCacheKey, image);
    }
    const pageHeight = page.getHeight();
    const { width, height, rotate, position: { x, y }, opacity, } = (0, utils_js_1.convertForPdfLayoutProps)({ schema, pageHeight });
    page.drawImage(image, { x, y, rotate, width, height, opacity });
};
exports.pdfRender = pdfRender;
//# sourceMappingURL=pdfRender.js.map