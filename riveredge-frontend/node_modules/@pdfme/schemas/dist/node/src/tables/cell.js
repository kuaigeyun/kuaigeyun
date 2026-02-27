"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@pdfme/common");
const uiRender_js_1 = require("../text/uiRender.js");
const pdfRender_js_1 = require("../text/pdfRender.js");
const line_js_1 = __importDefault(require("../shapes/line.js"));
const rectAndEllipse_js_1 = require("../shapes/rectAndEllipse.js");
const helper_js_1 = require("./helper.js");
const linePdfRender = line_js_1.default.pdf;
const rectanglePdfRender = rectAndEllipse_js_1.rectangle.pdf;
const renderLine = async (arg, schema, position, width, height) => linePdfRender({
    ...arg,
    schema: { ...schema, type: 'line', position, width, height, color: schema.borderColor },
});
const createTextDiv = (schema) => {
    const { borderWidth: bw, width, height, padding: pd } = schema;
    const textDiv = document.createElement('div');
    textDiv.style.position = 'absolute';
    textDiv.style.zIndex = '1';
    textDiv.style.width = `${width - bw.left - bw.right - pd.left - pd.right}mm`;
    textDiv.style.height = `${height - bw.top - bw.bottom - pd.top - pd.bottom}mm`;
    textDiv.style.top = `${bw.top + pd.top}mm`;
    textDiv.style.left = `${bw.left + pd.left}mm`;
    return textDiv;
};
const createLineDiv = (width, height, top, right, bottom, left, borderColor) => {
    const div = document.createElement('div');
    div.style.width = width;
    div.style.height = height;
    div.style.position = 'absolute';
    if (top !== null)
        div.style.top = top;
    if (right !== null)
        div.style.right = right;
    if (bottom !== null)
        div.style.bottom = bottom;
    if (left !== null)
        div.style.left = left;
    div.style.backgroundColor = borderColor;
    return div;
};
const cellSchema = {
    pdf: async (arg) => {
        const { schema } = arg;
        const { position, width, height, borderWidth, padding } = schema;
        await Promise.all([
            // BACKGROUND
            rectanglePdfRender({
                ...arg,
                schema: {
                    ...schema,
                    type: 'rectangle',
                    width: schema.width,
                    height: schema.height,
                    borderWidth: 0,
                    borderColor: '',
                    color: schema.backgroundColor,
                },
            }),
            // TOP
            renderLine(arg, schema, { x: position.x, y: position.y }, width, borderWidth.top),
            // RIGHT
            renderLine(arg, schema, { x: position.x + width - borderWidth.right, y: position.y }, borderWidth.right, height),
            // BOTTOM
            renderLine(arg, schema, { x: position.x, y: position.y + height - borderWidth.bottom }, width, borderWidth.bottom),
            // LEFT
            renderLine(arg, schema, { x: position.x, y: position.y }, borderWidth.left, height),
        ]);
        // TEXT
        await (0, pdfRender_js_1.pdfRender)({
            ...arg,
            schema: {
                ...schema,
                type: 'text',
                backgroundColor: '',
                position: {
                    x: position.x + borderWidth.left + padding.left,
                    y: position.y + borderWidth.top + padding.top,
                },
                width: width - borderWidth.left - borderWidth.right - padding.left - padding.right,
                height: height - borderWidth.top - borderWidth.bottom - padding.top - padding.bottom,
            },
        });
    },
    ui: async (arg) => {
        const { schema, rootElement } = arg;
        const { borderWidth, width, height, borderColor, backgroundColor } = schema;
        rootElement.style.backgroundColor = backgroundColor;
        const textDiv = createTextDiv(schema);
        await (0, uiRender_js_1.uiRender)({
            ...arg,
            schema: { ...schema, backgroundColor: '' },
            rootElement: textDiv,
        });
        rootElement.appendChild(textDiv);
        const lines = [
            createLineDiv(`${width}mm`, `${borderWidth.top}mm`, '0mm', null, null, '0mm', borderColor),
            createLineDiv(`${width}mm`, `${borderWidth.bottom}mm`, null, null, '0mm', '0mm', borderColor),
            createLineDiv(`${borderWidth.left}mm`, `${height}mm`, '0mm', null, null, '0mm', borderColor),
            createLineDiv(`${borderWidth.right}mm`, `${height}mm`, '0mm', '0mm', null, null, borderColor),
        ];
        lines.forEach((line) => rootElement.appendChild(line));
    },
    propPanel: {
        schema: ({ options, i18n }) => {
            const font = options.font || { [common_1.DEFAULT_FONT_NAME]: { data: '', fallback: true } };
            const fontNames = Object.keys(font);
            const fallbackFontName = (0, common_1.getFallbackFontName)(font);
            return (0, helper_js_1.getCellPropPanelSchema)({ i18n, fontNames, fallbackFontName });
        },
        defaultSchema: {
            name: '',
            type: 'cell',
            content: 'Type Something...',
            position: { x: 0, y: 0 },
            width: 50,
            height: 15,
            ...(0, helper_js_1.getDefaultCellStyles)(),
        },
    },
};
exports.default = cellSchema;
//# sourceMappingURL=cell.js.map