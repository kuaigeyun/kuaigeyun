import * as fontkit from 'fontkit';
import { getB64BasePdf, isBlankPdf, mm2pt, pluginRegistry, } from '@pdfme/common';
import { builtInPlugins } from '@pdfme/schemas';
import { PDFPage, PDFDocument, PDFEmbeddedPage } from '@pdfme/pdf-lib';
import { TOOL_NAME } from './constants.js';
export const getEmbedPdfPages = async (arg) => {
    const { template: { schemas, basePdf }, pdfDoc, } = arg;
    let basePages = [];
    let embedPdfBoxes = [];
    if (isBlankPdf(basePdf)) {
        const { width: _width, height: _height } = basePdf;
        const width = mm2pt(_width);
        const height = mm2pt(_height);
        basePages = schemas.map(() => {
            const page = PDFPage.create(pdfDoc);
            page.setSize(width, height);
            return page;
        });
        embedPdfBoxes = schemas.map(() => ({
            mediaBox: { x: 0, y: 0, width, height },
            bleedBox: { x: 0, y: 0, width, height },
            trimBox: { x: 0, y: 0, width, height },
        }));
    }
    else {
        const willLoadPdf = await getB64BasePdf(basePdf);
        const embedPdf = await PDFDocument.load(willLoadPdf);
        const embedPdfPages = embedPdf.getPages();
        embedPdfBoxes = embedPdfPages.map((p) => ({
            mediaBox: p.getMediaBox(),
            bleedBox: p.getBleedBox(),
            trimBox: p.getTrimBox(),
        }));
        const boundingBoxes = embedPdfPages.map((p) => {
            const { x, y, width, height } = p.getMediaBox();
            return { left: x, bottom: y, right: width, top: height + y };
        });
        const transformationMatrices = embedPdfPages.map(() => [1, 0, 0, 1, 0, 0]);
        basePages = await pdfDoc.embedPages(embedPdfPages, boundingBoxes, transformationMatrices);
    }
    return { basePages, embedPdfBoxes };
};
export const validateRequiredFields = (template, inputs) => {
    template.schemas.forEach((schemaPage) => schemaPage.forEach((schema) => {
        if (schema.required && !schema.readOnly && !inputs.some((input) => input[schema.name])) {
            throw new Error(`[@pdfme/generator] input for '${schema.name}' is required to generate this PDF`);
        }
    }));
};
export const preprocessing = async (arg) => {
    const { template, userPlugins } = arg;
    const { schemas, basePdf } = template;
    const staticSchema = isBlankPdf(basePdf) ? (basePdf.staticSchema ?? []) : [];
    const pdfDoc = await PDFDocument.create();
    // @ts-expect-error registerFontkit method is not in type definitions but exists at runtime
    pdfDoc.registerFontkit(fontkit);
    const plugins = pluginRegistry(Object.values(userPlugins).length > 0 ? userPlugins : builtInPlugins);
    const schemaTypes = Array.from(new Set(schemas
        .flatMap((schemaPage) => schemaPage.map((schema) => schema.type))
        .concat(staticSchema.map((schema) => schema.type))));
    const renderObj = schemaTypes.reduce((acc, type) => {
        const plugin = plugins.findByType(type);
        if (!plugin || !plugin.pdf) {
            throw new Error(`[@pdfme/generator] Plugin or renderer for type ${type} not found.
Check this document: https://pdfme.com/docs/custom-schemas`);
        }
        // Use type assertion to handle the pdf function with schema type
        return {
            ...acc,
            [type]: plugin.pdf,
        };
    }, {});
    return { pdfDoc, renderObj };
};
export const postProcessing = (props) => {
    const { pdfDoc, options } = props;
    const { author = TOOL_NAME, creationDate = new Date(), creator = TOOL_NAME, keywords = [], lang = 'en', modificationDate = new Date(), producer = TOOL_NAME, subject = '', title = '', } = options;
    pdfDoc.setAuthor(author);
    pdfDoc.setCreationDate(creationDate);
    pdfDoc.setCreator(creator);
    pdfDoc.setKeywords(keywords);
    pdfDoc.setLanguage(lang);
    pdfDoc.setModificationDate(modificationDate);
    pdfDoc.setProducer(producer);
    pdfDoc.setSubject(subject);
    pdfDoc.setTitle(title);
};
export const insertPage = (arg) => {
    const { basePage, embedPdfBox, pdfDoc } = arg;
    const size = basePage instanceof PDFEmbeddedPage ? basePage.size() : basePage.getSize();
    const insertedPage = basePage instanceof PDFEmbeddedPage
        ? pdfDoc.addPage([size.width, size.height])
        : pdfDoc.addPage(basePage);
    if (basePage instanceof PDFEmbeddedPage) {
        insertedPage.drawPage(basePage);
        const { mediaBox, bleedBox, trimBox } = embedPdfBox;
        insertedPage.setMediaBox(mediaBox.x, mediaBox.y, mediaBox.width, mediaBox.height);
        insertedPage.setBleedBox(bleedBox.x, bleedBox.y, bleedBox.width, bleedBox.height);
        insertedPage.setTrimBox(trimBox.x, trimBox.y, trimBox.width, trimBox.height);
    }
    return insertedPage;
};
//# sourceMappingURL=helper.js.map