"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBodyWithRange = exports.getBody = exports.getColumnStylesPropPanelSchema = exports.getCellPropPanelSchema = exports.getDefaultCellStyles = void 0;
const constants_js_1 = require("../text/constants.js");
const constants_js_2 = require("../constants.js");
const getDefaultCellStyles = () => ({
    fontName: undefined,
    alignment: constants_js_1.DEFAULT_ALIGNMENT,
    verticalAlignment: constants_js_1.VERTICAL_ALIGN_MIDDLE,
    fontSize: constants_js_1.DEFAULT_FONT_SIZE,
    lineHeight: constants_js_1.DEFAULT_LINE_HEIGHT,
    characterSpacing: constants_js_1.DEFAULT_CHARACTER_SPACING,
    fontColor: constants_js_1.DEFAULT_FONT_COLOR,
    backgroundColor: '',
    borderColor: '#888888',
    borderWidth: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
    padding: { top: 5, bottom: 5, left: 5, right: 5 },
});
exports.getDefaultCellStyles = getDefaultCellStyles;
const getBoxDimensionProp = (step = 1) => {
    const getCommonProp = () => ({
        type: 'number',
        widget: 'inputNumber',
        props: { min: 0, step },
        span: 6,
    });
    return {
        top: { title: 'Top', ...getCommonProp() },
        right: { title: 'Right', ...getCommonProp() },
        bottom: { title: 'Bottom', ...getCommonProp() },
        left: { title: 'Left', ...getCommonProp() },
    };
};
const getCellPropPanelSchema = (arg) => {
    const { i18n, fallbackFontName, fontNames, isBody } = arg;
    return {
        fontName: {
            title: i18n('schemas.text.fontName'),
            type: 'string',
            widget: 'select',
            default: fallbackFontName,
            placeholder: fallbackFontName,
            props: { options: fontNames.map((name) => ({ label: name, value: name })) },
            span: 12,
        },
        fontSize: {
            title: i18n('schemas.text.size'),
            type: 'number',
            widget: 'inputNumber',
            props: { min: 0 },
            span: 6,
        },
        characterSpacing: {
            title: i18n('schemas.text.spacing'),
            type: 'number',
            widget: 'inputNumber',
            props: { min: 0 },
            span: 6,
        },
        alignment: {
            title: i18n('schemas.text.textAlign'),
            type: 'string',
            widget: 'select',
            props: {
                options: [
                    { label: i18n('schemas.left'), value: constants_js_1.ALIGN_LEFT },
                    { label: i18n('schemas.center'), value: constants_js_1.ALIGN_CENTER },
                    { label: i18n('schemas.right'), value: constants_js_1.ALIGN_RIGHT },
                ],
            },
            span: 8,
        },
        verticalAlignment: {
            title: i18n('schemas.text.verticalAlign'),
            type: 'string',
            widget: 'select',
            props: {
                options: [
                    { label: i18n('schemas.top'), value: constants_js_1.VERTICAL_ALIGN_TOP },
                    { label: i18n('schemas.middle'), value: constants_js_1.VERTICAL_ALIGN_MIDDLE },
                    { label: i18n('schemas.bottom'), value: constants_js_1.VERTICAL_ALIGN_BOTTOM },
                ],
            },
            span: 8,
        },
        lineHeight: {
            title: i18n('schemas.text.lineHeight'),
            type: 'number',
            widget: 'inputNumber',
            props: { step: 0.1, min: 0 },
            span: 8,
        },
        fontColor: {
            title: i18n('schemas.textColor'),
            type: 'string',
            widget: 'color',
            props: {
                disabledAlpha: true,
            },
            rules: [{ pattern: constants_js_2.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        borderColor: {
            title: i18n('schemas.borderColor'),
            type: 'string',
            widget: 'color',
            props: {
                disabledAlpha: true,
            },
            rules: [{ pattern: constants_js_2.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        backgroundColor: {
            title: i18n('schemas.backgroundColor'),
            type: 'string',
            widget: 'color',
            props: {
                disabledAlpha: true,
            },
            rules: [{ pattern: constants_js_2.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
        },
        ...(isBody
            ? {
                alternateBackgroundColor: {
                    title: i18n('schemas.table.alternateBackgroundColor'),
                    type: 'string',
                    widget: 'color',
                    props: {
                        disabledAlpha: true,
                    },
                    rules: [{ pattern: constants_js_2.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
                },
            }
            : {}),
        '-': { type: 'void', widget: 'Divider' },
        borderWidth: {
            title: i18n('schemas.borderWidth'),
            type: 'object',
            widget: 'lineTitle',
            span: 24,
            properties: getBoxDimensionProp(0.1),
        },
        '--': { type: 'void', widget: 'Divider' },
        padding: {
            title: i18n('schemas.padding'),
            type: 'object',
            widget: 'lineTitle',
            span: 24,
            properties: getBoxDimensionProp(),
        },
    };
};
exports.getCellPropPanelSchema = getCellPropPanelSchema;
const getColumnStylesPropPanelSchema = ({ head, i18n, }) => ({
    alignment: {
        type: 'object',
        widget: 'lineTitle',
        title: i18n('schemas.text.textAlign'),
        column: 3,
        properties: head.reduce((acc, cur, i) => Object.assign(acc, {
            [i]: {
                title: cur || 'Column ' + String(i + 1),
                type: 'string',
                widget: 'select',
                props: {
                    options: [
                        { label: i18n('schemas.left'), value: constants_js_1.ALIGN_LEFT },
                        { label: i18n('schemas.center'), value: constants_js_1.ALIGN_CENTER },
                        { label: i18n('schemas.right'), value: constants_js_1.ALIGN_RIGHT },
                    ],
                },
            },
        }), {}),
    },
});
exports.getColumnStylesPropPanelSchema = getColumnStylesPropPanelSchema;
const getBody = (value) => {
    if (typeof value === 'string') {
        return JSON.parse(value || '[]');
    }
    return value || [];
};
exports.getBody = getBody;
const getBodyWithRange = (value, range) => {
    const body = (0, exports.getBody)(value);
    if (!range)
        return body;
    return body.slice(range.start, range.end);
};
exports.getBodyWithRange = getBodyWithRange;
//# sourceMappingURL=helper.js.map