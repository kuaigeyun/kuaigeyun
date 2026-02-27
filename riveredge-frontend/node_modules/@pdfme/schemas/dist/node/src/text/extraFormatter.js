"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
exports.getExtraFormatterSchema = getExtraFormatterSchema;
// No imports needed from @pdfme/common
const index_js_1 = require("./icons/index.js");
const constants_js_1 = require("./constants.js");
var Formatter;
(function (Formatter) {
    Formatter["STRIKETHROUGH"] = "strikethrough";
    Formatter["UNDERLINE"] = "underline";
    Formatter["ALIGNMENT"] = "alignment";
    Formatter["VERTICAL_ALIGNMENT"] = "verticalAlignment";
})(Formatter || (exports.Formatter = Formatter = {}));
function getExtraFormatterSchema(i18n) {
    const buttons = [
        { key: Formatter.STRIKETHROUGH, icon: index_js_1.TextStrikethroughIcon, type: 'boolean' },
        { key: Formatter.UNDERLINE, icon: index_js_1.TextUnderlineIcon, type: 'boolean' },
        { key: Formatter.ALIGNMENT, icon: index_js_1.TextAlignLeftIcon, type: 'select', value: constants_js_1.DEFAULT_ALIGNMENT },
        { key: Formatter.ALIGNMENT, icon: index_js_1.TextAlignCenterIcon, type: 'select', value: constants_js_1.ALIGN_CENTER },
        { key: Formatter.ALIGNMENT, icon: index_js_1.TextAlignRightIcon, type: 'select', value: constants_js_1.ALIGN_RIGHT },
        { key: Formatter.ALIGNMENT, icon: index_js_1.TextAlignJustifyIcon, type: 'select', value: constants_js_1.ALIGN_JUSTIFY },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: index_js_1.TextVerticalAlignTopIcon,
            type: 'select',
            value: constants_js_1.DEFAULT_VERTICAL_ALIGNMENT,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: index_js_1.TextVerticalAlignMiddleIcon,
            type: 'select',
            value: constants_js_1.VERTICAL_ALIGN_MIDDLE,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: index_js_1.TextVerticalAlignBottomIcon,
            type: 'select',
            value: constants_js_1.VERTICAL_ALIGN_BOTTOM,
        },
    ];
    return {
        title: i18n('schemas.text.format'),
        widget: 'ButtonGroup',
        buttons,
        span: 24,
    };
}
//# sourceMappingURL=extraFormatter.js.map