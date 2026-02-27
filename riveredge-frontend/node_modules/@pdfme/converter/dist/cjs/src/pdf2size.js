"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdf2size = pdf2size;
const common_1 = require("@pdfme/common");
async function pdf2size(pdf, options = {}, env) {
    const { scale = 1 } = options;
    const { getDocument } = env;
    const pdfDoc = await getDocument(pdf);
    const promises = Promise.all(new Array(pdfDoc.numPages).fill('').map(async (_, i) => {
        return await pdfDoc.getPage(i + 1).then((page) => {
            const { height, width } = page.getViewport({ scale, rotation: 0 });
            return { height: (0, common_1.pt2mm)(height), width: (0, common_1.pt2mm)(width) };
        });
    }));
    return promises;
}
//# sourceMappingURL=pdf2size.js.map