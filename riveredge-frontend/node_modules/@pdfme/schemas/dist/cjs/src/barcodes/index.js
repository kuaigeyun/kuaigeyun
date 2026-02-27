"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfRender_js_1 = require("./pdfRender.js");
const propPanel_js_1 = require("./propPanel.js");
const uiRender_js_1 = require("./uiRender.js");
const constants_js_1 = require("./constants.js");
const utils_js_1 = require("../utils.js");
const lucide_1 = require("lucide");
const barcodes = constants_js_1.BARCODE_TYPES.reduce((acc, type) => Object.assign(acc, {
    [type]: {
        pdf: pdfRender_js_1.pdfRender,
        ui: uiRender_js_1.uiRender,
        propPanel: (0, propPanel_js_1.getPropPanelByBarcodeType)(type),
        icon: (0, utils_js_1.createSvgStr)(type == 'qrcode' ? lucide_1.QrCode : lucide_1.Barcode),
    },
}), {});
exports.default = barcodes;
//# sourceMappingURL=index.js.map