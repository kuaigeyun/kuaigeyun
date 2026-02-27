"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSingleTable = createSingleTable;
const common_1 = require("@pdfme/common");
const classes_js_1 = require("./classes.js");
function parseSection(sectionName, sectionRows, columns, styleProps, fallbackFontName) {
    const rowSpansLeftForColumn = {};
    const result = sectionRows.map((rawRow, rowIndex) => {
        let skippedRowForRowSpans = 0;
        const cells = {};
        let colSpansAdded = 0;
        let columnSpansLeft = 0;
        for (const column of columns) {
            if (rowSpansLeftForColumn[column.index] == null ||
                rowSpansLeftForColumn[column.index].left === 0) {
                if (columnSpansLeft === 0) {
                    let rawCell;
                    if (Array.isArray(rawRow)) {
                        rawCell = rawRow[column.index - colSpansAdded - skippedRowForRowSpans];
                    }
                    else {
                        rawCell = rawRow[column.index];
                    }
                    const styles = cellStyles(sectionName, column, rowIndex, styleProps, fallbackFontName);
                    const cell = new classes_js_1.Cell(rawCell, styles, sectionName);
                    cells[column.index] = cell;
                    columnSpansLeft = 0;
                    rowSpansLeftForColumn[column.index] = {
                        left: 0,
                        times: columnSpansLeft,
                    };
                }
                else {
                    columnSpansLeft--;
                    colSpansAdded++;
                }
            }
            else {
                rowSpansLeftForColumn[column.index].left--;
                columnSpansLeft = rowSpansLeftForColumn[column.index].times;
                skippedRowForRowSpans++;
            }
        }
        return new classes_js_1.Row(rawRow, rowIndex, sectionName, cells);
    });
    return result;
}
function parseContent4Table(input, fallbackFontName) {
    const content = input.content;
    const columns = content.columns.map((index) => new classes_js_1.Column(index));
    const styles = input.styles;
    return {
        columns,
        head: parseSection('head', content.head, columns, styles, fallbackFontName),
        body: parseSection('body', content.body, columns, styles, fallbackFontName),
    };
}
function cellStyles(sectionName, column, rowIndex, styles, fallbackFontName) {
    let sectionStyles;
    if (sectionName === 'head') {
        sectionStyles = styles.headStyles;
    }
    else if (sectionName === 'body') {
        sectionStyles = styles.bodyStyles;
    }
    const otherStyles = Object.assign({}, styles.styles, sectionStyles);
    const colStyles = styles.columnStyles[column.index] || styles.columnStyles[column.index] || {};
    const rowStyles = sectionName === 'body' && rowIndex % 2 === 0
        ? Object.assign({}, styles.alternateRowStyles)
        : {};
    const defaultStyle = {
        fontName: fallbackFontName,
        backgroundColor: '',
        textColor: '#000000',
        lineHeight: 1,
        characterSpacing: 0,
        alignment: 'left',
        verticalAlignment: 'middle',
        fontSize: 10,
        cellPadding: 5,
        lineColor: '#000000',
        lineWidth: 0,
        minCellHeight: 0,
        minCellWidth: 0,
    };
    return Object.assign(defaultStyle, otherStyles, rowStyles, colStyles);
}
function mapCellStyle(style) {
    return {
        fontName: style.fontName,
        alignment: style.alignment,
        verticalAlignment: style.verticalAlignment,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        characterSpacing: style.characterSpacing,
        backgroundColor: style.backgroundColor,
        // ---
        textColor: style.fontColor,
        lineColor: style.borderColor,
        lineWidth: style.borderWidth,
        cellPadding: style.padding,
    };
}
function getTableOptions(schema, body) {
    const columnStylesWidth = schema.headWidthPercentages.reduce((acc, cur, i) => ({ ...acc, [i]: { cellWidth: schema.width * (cur / 100) } }), {});
    const columnStylesAlignment = Object.entries(schema.columnStyles.alignment || {}).reduce((acc, [key, value]) => ({ ...acc, [key]: { alignment: value } }), {});
    const allKeys = new Set([
        ...Object.keys(columnStylesWidth).map(Number),
        ...Object.keys(columnStylesAlignment).map(Number),
    ]);
    const columnStyles = Array.from(allKeys).reduce((acc, key) => {
        const widthStyle = columnStylesWidth[key] || {};
        const alignmentStyle = columnStylesAlignment[key] || {};
        return { ...acc, [key]: { ...widthStyle, ...alignmentStyle } };
    }, {});
    return {
        head: [schema.head],
        body,
        showHead: schema.showHead,
        startY: schema.position.y,
        tableWidth: schema.width,
        tableLineColor: schema.tableStyles.borderColor,
        tableLineWidth: schema.tableStyles.borderWidth,
        headStyles: mapCellStyle(schema.headStyles),
        bodyStyles: mapCellStyle(schema.bodyStyles),
        alternateRowStyles: { backgroundColor: schema.bodyStyles.alternateBackgroundColor },
        columnStyles,
        margin: { top: 0, right: 0, left: schema.position.x, bottom: 0 },
    };
}
function parseStyles(cInput) {
    const styleOptions = {
        styles: {},
        headStyles: {},
        bodyStyles: {},
        alternateRowStyles: {},
        columnStyles: {},
    };
    for (const prop of Object.keys(styleOptions)) {
        if (prop === 'columnStyles') {
            const current = cInput[prop];
            styleOptions.columnStyles = Object.assign({}, current);
        }
        else {
            const allOptions = [cInput];
            const styles = allOptions.map((opts) => opts[prop] || {});
            styleOptions[prop] = Object.assign({}, styles[0], styles[1], styles[2]);
        }
    }
    return styleOptions;
}
function parseContent4Input(options) {
    const head = options.head || [];
    const body = options.body || [];
    const columns = (head[0] || body[0] || []).map((_, index) => index);
    return { columns, head, body };
}
function parseInput(schema, body) {
    const options = getTableOptions(schema, body);
    const styles = parseStyles(options);
    const settings = {
        startY: options.startY,
        margin: options.margin,
        tableWidth: options.tableWidth,
        showHead: options.showHead,
        tableLineWidth: options.tableLineWidth ?? 0,
        tableLineColor: options.tableLineColor ?? '',
    };
    const content = parseContent4Input(options);
    return { content, styles, settings };
}
function createSingleTable(body, args) {
    const { options, _cache, basePdf } = args;
    if (!(0, common_1.isBlankPdf)(basePdf)) {
        console.warn('[@pdfme/schema/table]' +
            'When specifying a custom PDF for basePdf, ' +
            'you cannot use features such as page breaks or re-layout of other elements.' +
            'To utilize these features, please define basePdf as follows:\n' +
            '{ width: number; height: number; padding: [number, number, number, number]; }');
    }
    const schema = (0, common_1.cloneDeep)(args.schema);
    const { start } = schema.__bodyRange || { start: 0 };
    if (start % 2 === 1) {
        const alternateBackgroundColor = schema.bodyStyles.alternateBackgroundColor;
        schema.bodyStyles.alternateBackgroundColor = schema.bodyStyles.backgroundColor;
        schema.bodyStyles.backgroundColor = alternateBackgroundColor;
    }
    schema.showHead = schema.showHead === false ? false : (!schema.__isSplit || schema.repeatHead === true);
    const input = parseInput(schema, body);
    const font = options.font || (0, common_1.getDefaultFont)();
    const fallbackFontName = (0, common_1.getFallbackFontName)(font);
    const content = parseContent4Table(input, fallbackFontName);
    return classes_js_1.Table.create({
        input,
        content,
        font,
        _cache: _cache,
    });
}
//# sourceMappingURL=tableHelper.js.map