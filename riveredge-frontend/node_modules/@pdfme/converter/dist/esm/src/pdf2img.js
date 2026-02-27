export async function pdf2img(pdf, options = {}, env) {
    try {
        const { scale = 1, imageType = 'jpeg', range = {} } = options;
        const { start = 0, end = Infinity } = range;
        const { getDocument, createCanvas, canvasToArrayBuffer } = env;
        const pdfDoc = await getDocument(pdf);
        const numPages = pdfDoc.numPages;
        const startPage = Math.max(start + 1, 1);
        const endPage = Math.min(end + 1, numPages);
        const results = [];
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = createCanvas(viewport.width, viewport.height);
            if (!canvas) {
                throw new Error('Failed to create canvas');
            }
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Failed to get canvas context');
            }
            await page.render({ canvasContext: context, viewport }).promise;
            const arrayBuffer = canvasToArrayBuffer(canvas, imageType);
            results.push(arrayBuffer);
        }
        return results;
    }
    catch (error) {
        throw new Error(`[@pdfme/converter] pdf2img failed: ${error.message}`);
    }
}
//# sourceMappingURL=pdf2img.js.map