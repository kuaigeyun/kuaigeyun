import { pt2mm } from '@pdfme/common';
export async function pdf2size(pdf, options = {}, env) {
    const { scale = 1 } = options;
    const { getDocument } = env;
    const pdfDoc = await getDocument(pdf);
    const promises = Promise.all(new Array(pdfDoc.numPages).fill('').map(async (_, i) => {
        return await pdfDoc.getPage(i + 1).then((page) => {
            const { height, width } = page.getViewport({ scale, rotation: 0 });
            return { height: pt2mm(height), width: pt2mm(width) };
        });
    }));
    return promises;
}
//# sourceMappingURL=pdf2size.js.map