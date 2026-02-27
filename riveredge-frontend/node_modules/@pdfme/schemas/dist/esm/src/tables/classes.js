import { mm2pt, pt2mm } from '@pdfme/common';
import { splitTextToSize, getFontKitFont, widthOfTextAtSize } from '../text/helper.js';
export class Cell {
    constructor(raw, styles, section) {
        Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "section", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contentHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "contentWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "wrappedWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minReadableWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.styles = styles;
        this.section = section;
        this.raw = raw;
        const splitRegex = /\r\n|\r|\n/g;
        this.text = raw.split(splitRegex);
    }
    getContentHeight() {
        const lineCount = Array.isArray(this.text) ? this.text.length : 1;
        const lineHeight = pt2mm(this.styles.fontSize) * this.styles.lineHeight;
        const vPadding = this.padding('top') + this.padding('bottom');
        const height = lineCount * lineHeight + vPadding;
        return Math.max(height, this.styles.minCellHeight);
    }
    padding(name) {
        return this.styles.cellPadding[name];
    }
}
export class Column {
    constructor(index) {
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "wrappedWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minReadableWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.index = index;
    }
    getMaxCustomCellWidth(table) {
        let max = 0;
        for (const row of table.allRows()) {
            const cell = row.cells[this.index];
            max = Math.max(max, cell.styles.cellWidth);
        }
        return max;
    }
}
export class Row {
    constructor(raw, index, section, cells) {
        Object.defineProperty(this, "raw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "section", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cells", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.raw = raw;
        this.index = index;
        this.section = section;
        this.cells = cells;
    }
    getMaxCellHeight(columns) {
        return columns.reduce((acc, column) => Math.max(acc, this.cells[column.index]?.height || 0), 0);
    }
    getMinimumRowHeight(columns) {
        return columns.reduce((acc, column) => {
            const cell = this.cells[column.index];
            if (!cell)
                return 0;
            const vPadding = cell.padding('top') + cell.padding('bottom');
            const oneRowHeight = vPadding + cell.styles.lineHeight;
            return oneRowHeight > acc ? oneRowHeight : acc;
        }, 0);
    }
}
export class Table {
    constructor(input, content) {
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "columns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "head", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.settings = input.settings;
        this.styles = input.styles;
        this.columns = content.columns;
        this.head = content.head;
        this.body = content.body;
    }
    static async create(arg) {
        const { input, content, font, _cache } = arg;
        const table = new Table(input, content);
        await calculateWidths({ table, font, _cache });
        return table;
    }
    getHeadHeight() {
        return this.head.reduce((acc, row) => acc + row.getMaxCellHeight(this.columns), 0);
    }
    getBodyHeight() {
        return this.body.reduce((acc, row) => acc + row.getMaxCellHeight(this.columns), 0);
    }
    allRows() {
        return this.head.concat(this.body);
    }
    getWidth() {
        return this.settings.tableWidth;
    }
    getHeight() {
        return (this.settings.showHead ? this.getHeadHeight() : 0) + this.getBodyHeight();
    }
}
async function calculateWidths(arg) {
    const { table, font, _cache } = arg;
    const getFontKitFontByFontName = (fontName) => getFontKitFont(fontName, font, _cache);
    await calculate(table, getFontKitFontByFontName);
    const resizableColumns = [];
    let initialTableWidth = 0;
    table.columns.forEach((column) => {
        const customWidth = column.getMaxCustomCellWidth(table);
        if (customWidth) {
            // final column width
            column.width = customWidth;
        }
        else {
            // initial column width (will be resized)
            column.width = column.wrappedWidth;
            resizableColumns.push(column);
        }
        initialTableWidth += column.width;
    });
    // width difference that needs to be distributed
    let resizeWidth = table.getWidth() - initialTableWidth;
    // first resize attempt: with respect to minReadableWidth and minWidth
    if (resizeWidth) {
        resizeWidth = resizeColumns(resizableColumns, resizeWidth, (column) => Math.max(column.minReadableWidth, column.minWidth));
    }
    // second resize attempt: ignore minReadableWidth but respect minWidth
    if (resizeWidth) {
        resizeWidth = resizeColumns(resizableColumns, resizeWidth, (column) => column.minWidth);
    }
    resizeWidth = Math.abs(resizeWidth);
    applyColSpans(table);
    await fitContent(table, getFontKitFontByFontName);
    applyRowSpans(table);
}
function applyRowSpans(table) {
    const rowSpanCells = {};
    let colRowSpansLeft = 1;
    const all = table.allRows();
    for (let rowIndex = 0; rowIndex < all.length; rowIndex++) {
        const row = all[rowIndex];
        for (const column of table.columns) {
            const data = rowSpanCells[column.index];
            if (colRowSpansLeft > 1) {
                colRowSpansLeft--;
                delete row.cells[column.index];
            }
            else if (data) {
                data.cell.height += row.height;
                colRowSpansLeft = 1;
                delete row.cells[column.index];
                data.left--;
                if (data.left <= 1) {
                    delete rowSpanCells[column.index];
                }
            }
            else {
                const cell = row.cells[column.index];
                if (!cell) {
                    continue;
                }
                cell.height = row.height;
            }
        }
    }
}
function applyColSpans(table) {
    const all = table.allRows();
    for (let rowIndex = 0; rowIndex < all.length; rowIndex++) {
        const row = all[rowIndex];
        let colSpanCell = null;
        let combinedColSpanWidth = 0;
        let colSpansLeft = 0;
        for (let columnIndex = 0; columnIndex < table.columns.length; columnIndex++) {
            const column = table.columns[columnIndex];
            // Width and colspan
            colSpansLeft -= 1;
            if (colSpansLeft > 1 && table.columns[columnIndex + 1]) {
                combinedColSpanWidth += column.width;
                delete row.cells[column.index];
            }
            else if (colSpanCell) {
                const cell = colSpanCell;
                delete row.cells[column.index];
                colSpanCell = null;
                cell.width = column.width + combinedColSpanWidth;
            }
            else {
                const cell = row.cells[column.index];
                if (!cell)
                    continue;
                colSpansLeft = 1;
                combinedColSpanWidth = 0;
                cell.width = column.width + combinedColSpanWidth;
            }
        }
    }
}
async function fitContent(table, getFontKitFontByFontName) {
    const rowSpanHeight = { count: 0, height: 0 };
    for (const row of table.allRows()) {
        for (const column of table.columns) {
            const cell = row.cells[column.index];
            if (!cell)
                continue;
            const fontKitFont = await getFontKitFontByFontName(cell.styles.fontName);
            cell.text = splitTextToSize({
                value: cell.raw,
                characterSpacing: cell.styles.characterSpacing,
                boxWidthInPt: mm2pt(cell.width),
                fontSize: cell.styles.fontSize,
                fontKitFont,
            });
            cell.contentHeight = cell.getContentHeight();
            let realContentHeight = cell.contentHeight;
            if (rowSpanHeight && rowSpanHeight.count > 0) {
                if (rowSpanHeight.height > realContentHeight) {
                    realContentHeight = rowSpanHeight.height;
                }
            }
            if (realContentHeight > row.height) {
                row.height = realContentHeight;
            }
        }
        rowSpanHeight.count--;
    }
}
function resizeColumns(columns, resizeWidth, getMinWidth) {
    const initialResizeWidth = resizeWidth;
    const sumWrappedWidth = columns.reduce((acc, column) => acc + column.wrappedWidth, 0);
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const ratio = column.wrappedWidth / sumWrappedWidth;
        const suggestedChange = initialResizeWidth * ratio;
        const suggestedWidth = column.width + suggestedChange;
        const minWidth = getMinWidth(column);
        const newWidth = suggestedWidth < minWidth ? minWidth : suggestedWidth;
        resizeWidth -= newWidth - column.width;
        column.width = newWidth;
    }
    resizeWidth = Math.round(resizeWidth * 1e10) / 1e10;
    // Run the resizer again if there's remaining width needs
    // to be distributed and there're columns that can be resized
    if (resizeWidth) {
        const resizableColumns = columns.filter((column) => {
            return resizeWidth < 0
                ? column.width > getMinWidth(column) // check if column can shrink
                : true; // check if column can grow
        });
        if (resizableColumns.length) {
            resizeWidth = resizeColumns(resizableColumns, resizeWidth, getMinWidth);
        }
    }
    return resizeWidth;
}
async function calculate(table, getFontKitFontByFontName) {
    for (const row of table.allRows()) {
        for (const column of table.columns) {
            const cell = row.cells[column.index];
            if (!cell)
                continue;
            const hPadding = cell.padding('right') + cell.padding('left');
            const fontKitFont = await getFontKitFontByFontName(cell.styles.fontName);
            cell.contentWidth = getStringWidth(cell, fontKitFont) + hPadding;
            const longestWordWidth = getStringWidth(Object.assign(cell, { text: cell.text.join(' ').split(/\s+/) }), fontKitFont);
            cell.minReadableWidth = longestWordWidth + hPadding;
            cell.minWidth = cell.styles.cellWidth;
            cell.wrappedWidth = cell.styles.cellWidth;
        }
    }
    for (const row of table.allRows()) {
        for (const column of table.columns) {
            const cell = row.cells[column.index];
            // For now we ignore the minWidth and wrappedWidth of colspan cells when calculating colspan widths.
            // Could probably be improved upon however.
            if (cell) {
                column.wrappedWidth = Math.max(column.wrappedWidth, cell.wrappedWidth);
                column.minWidth = Math.max(column.minWidth, cell.minWidth);
                column.minReadableWidth = Math.max(column.minReadableWidth, cell.minReadableWidth);
            }
            else {
                // Respect cellWidth set in columnStyles even if there is no cells for this column
                // or if the column only have colspan cells. Since the width of colspan cells
                // does not affect the width of columns, setting columnStyles cellWidth enables the
                // user to at least do it manually.
                // Note that this is not perfect for now since for example row and table styles are
                // not accounted for
                const columnStyles = table.styles.columnStyles[column.index] || {};
                const cellWidth = columnStyles.cellWidth || columnStyles.minCellWidth;
                if (cellWidth) {
                    column.minWidth = cellWidth;
                    column.wrappedWidth = cellWidth;
                }
            }
        }
    }
}
function getStringWidth(cell, fontKitFont) {
    const text = cell.text;
    const textArr = Array.isArray(text) ? text : [text];
    const fontSize = cell.styles.fontSize;
    const characterSpacing = cell.styles.characterSpacing;
    const widestLineWidth = textArr
        .map((text) => widthOfTextAtSize(text, fontKitFont, fontSize, characterSpacing))
        .reduce((a, b) => Math.max(a, b), 0);
    return widestLineWidth;
}
//# sourceMappingURL=classes.js.map