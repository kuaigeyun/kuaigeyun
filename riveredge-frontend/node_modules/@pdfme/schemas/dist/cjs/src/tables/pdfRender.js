"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRender = void 0;
const rectAndEllipse_js_1 = require("../shapes/rectAndEllipse.js");
const cell_js_1 = __importDefault(require("./cell.js"));
const helper_js_1 = require("./helper.js");
const tableHelper_js_1 = require("./tableHelper.js");
const rectanglePdfRender = rectAndEllipse_js_1.rectangle.pdf;
const cellPdfRender = cell_js_1.default.pdf;
async function drawCell(arg, cell) {
    await cellPdfRender({
        ...arg,
        value: cell.raw,
        schema: {
            name: '',
            type: 'cell',
            position: { x: cell.x, y: cell.y },
            width: cell.width,
            height: cell.height,
            fontName: cell.styles.fontName,
            alignment: cell.styles.alignment,
            verticalAlignment: cell.styles.verticalAlignment,
            fontSize: cell.styles.fontSize,
            lineHeight: cell.styles.lineHeight,
            characterSpacing: cell.styles.characterSpacing,
            backgroundColor: cell.styles.backgroundColor,
            fontColor: cell.styles.textColor,
            borderColor: cell.styles.lineColor,
            borderWidth: cell.styles.lineWidth,
            padding: cell.styles.cellPadding,
        },
    });
}
async function drawRow(arg, table, row, cursor, columns) {
    cursor.x = table.settings.margin.left;
    for (const column of columns) {
        const cell = row.cells[column.index];
        if (!cell) {
            cursor.x += column.width;
            continue;
        }
        cell.x = cursor.x;
        cell.y = cursor.y;
        await drawCell(arg, cell);
        cursor.x += column.width;
    }
    cursor.y += row.height;
}
async function drawTableBorder(arg, table, startPos, cursor) {
    const lineWidth = table.settings.tableLineWidth;
    const lineColor = table.settings.tableLineColor;
    if (!lineWidth || !lineColor)
        return;
    await rectanglePdfRender({
        ...arg,
        schema: {
            name: '',
            type: 'rectangle',
            borderWidth: lineWidth,
            borderColor: lineColor,
            color: '',
            position: { x: startPos.x, y: startPos.y },
            width: table.getWidth(),
            height: cursor.y - startPos.y,
            readOnly: true,
        },
    });
}
async function drawTable(arg, table) {
    const settings = table.settings;
    const startY = settings.startY;
    const margin = settings.margin;
    const cursor = { x: margin.left, y: startY };
    const startPos = Object.assign({}, cursor);
    if (settings.showHead) {
        for (const row of table.head) {
            await drawRow(arg, table, row, cursor, table.columns);
        }
    }
    for (const row of table.body) {
        await drawRow(arg, table, row, cursor, table.columns);
    }
    await drawTableBorder(arg, table, startPos, cursor);
}
const pdfRender = async (arg) => {
    const { value, schema, basePdf, options, _cache } = arg;
    const body = (0, helper_js_1.getBodyWithRange)(typeof value !== 'string' ? JSON.stringify(value || '[]') : value, schema.__bodyRange);
    // Create a properly typed CreateTableArgs object
    const createTableArgs = {
        schema,
        basePdf,
        options,
        _cache,
    };
    // Ensure body is properly typed before passing to createSingleTable
    // Ensure body is properly typed as string[][] before passing to createSingleTable
    const typedBody = Array.isArray(body)
        ? body.map((row) => (Array.isArray(row) ? row.map((cell) => String(cell)) : []))
        : [];
    const table = await (0, tableHelper_js_1.createSingleTable)(typedBody, createTableArgs);
    // Use the original arg directly since drawTable expects PDFRenderProps<TableSchema>
    // which is the same type as our arg parameter
    await drawTable(arg, table);
};
exports.pdfRender = pdfRender;
//# sourceMappingURL=pdfRender.js.map