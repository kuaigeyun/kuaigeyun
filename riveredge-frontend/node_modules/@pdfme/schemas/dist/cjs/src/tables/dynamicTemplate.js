"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicHeightsForTable = void 0;
const common_1 = require("@pdfme/common");
const tableHelper_js_1 = require("./tableHelper.js");
const helper_js_1 = require("./helper.js");
const getDynamicHeightsForTable = async (value, args) => {
    if (args.schema.type !== 'table')
        return Promise.resolve([args.schema.height]);
    const schema = args.schema;
    const body = schema.__bodyRange?.start === 0 ? (0, helper_js_1.getBody)(value) : (0, helper_js_1.getBodyWithRange)(value, schema.__bodyRange);
    const table = await (0, tableHelper_js_1.createSingleTable)(body, args);
    const baseHeights = schema.showHead
        ? table.allRows().map((row) => row.height)
        : [0].concat(table.body.map((row) => row.height));
    const headerHeight = schema.showHead ? table.getHeadHeight() : 0;
    const shouldRepeatHeader = schema.repeatHead && (0, common_1.isBlankPdf)(args.basePdf) && headerHeight > 0;
    if (!shouldRepeatHeader) {
        return baseHeights;
    }
    const basePdf = args.basePdf;
    const [paddingTop, , paddingBottom] = basePdf.padding;
    const pageContentHeight = basePdf.height - paddingTop - paddingBottom;
    const getPageStartY = (pageIndex) => pageIndex * pageContentHeight + paddingTop;
    const initialPageIndex = Math.max(0, Math.floor((schema.position.y - paddingTop) / pageContentHeight));
    const headRowCount = schema.showHead ? table.head.length : 0;
    const SAFETY_MARGIN = 0.5;
    let currentPageIndex = initialPageIndex;
    let currentPageY = schema.position.y;
    let rowsOnCurrentPage = 0;
    const result = [];
    for (let i = 0; i < baseHeights.length; i++) {
        const isBodyRow = i >= headRowCount;
        const rowHeight = baseHeights[i];
        while (true) {
            const currentPageStartY = getPageStartY(currentPageIndex);
            const remainingHeight = currentPageStartY + pageContentHeight - currentPageY;
            const needsHeader = isBodyRow && rowsOnCurrentPage === 0 && currentPageIndex > initialPageIndex;
            const totalRowHeight = rowHeight + (needsHeader ? headerHeight : 0);
            if (totalRowHeight > remainingHeight - SAFETY_MARGIN) {
                if (rowsOnCurrentPage === 0 && Math.abs(currentPageY - currentPageStartY) < SAFETY_MARGIN) {
                    result.push(totalRowHeight);
                    currentPageY += totalRowHeight;
                    rowsOnCurrentPage++;
                    break;
                }
                currentPageIndex++;
                currentPageY = getPageStartY(currentPageIndex);
                rowsOnCurrentPage = 0;
                continue;
            }
            result.push(totalRowHeight);
            currentPageY += totalRowHeight;
            rowsOnCurrentPage++;
            if (currentPageY >= currentPageStartY + pageContentHeight - SAFETY_MARGIN) {
                currentPageIndex++;
                currentPageY = getPageStartY(currentPageIndex);
                rowsOnCurrentPage = 0;
            }
            break;
        }
    }
    return result;
};
exports.getDynamicHeightsForTable = getDynamicHeightsForTable;
//# sourceMappingURL=dynamicTemplate.js.map