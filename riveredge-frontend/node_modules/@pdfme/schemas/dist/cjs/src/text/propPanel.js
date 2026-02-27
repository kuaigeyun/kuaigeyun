"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propPanel = void 0;
const common_1 = require("@pdfme/common");
const constants_js_1 = require("./constants.js");
const constants_js_2 = require("../constants.js");
const extraFormatter_js_1 = require("./extraFormatter.js");
const UseDynamicFontSize = (props) => {
    const { rootElement, changeSchemas, activeSchema, i18n } = props;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(activeSchema?.dynamicFontSize);
    checkbox.onchange = (e) => {
        const val = e.target.checked
            ? {
                min: constants_js_1.DEFAULT_DYNAMIC_MIN_FONT_SIZE,
                max: constants_js_1.DEFAULT_DYNAMIC_MAX_FONT_SIZE,
                fit: constants_js_1.DEFAULT_DYNAMIC_FIT,
            }
            : undefined;
        changeSchemas([{ key: 'dynamicFontSize', value: val, schemaId: activeSchema.id }]);
    };
    const label = document.createElement('label');
    const span = document.createElement('span');
    span.innerText = i18n('schemas.text.dynamicFontSize') || '';
    span.style.cssText = 'margin-left: 0.5rem';
    label.style.cssText = 'display: flex; width: 100%;';
    label.appendChild(checkbox);
    label.appendChild(span);
    rootElement.appendChild(label);
};
exports.propPanel = {
    schema: ({ options, activeSchema, i18n }) => {
        const font = options.font || { [common_1.DEFAULT_FONT_NAME]: { data: '', fallback: true } };
        const fontNames = Object.keys(font);
        const fallbackFontName = (0, common_1.getFallbackFontName)(font);
        const enableDynamicFont = Boolean(activeSchema?.dynamicFontSize);
        const textSchema = {
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
                span: 6,
                disabled: enableDynamicFont,
                props: { min: 0 },
            },
            characterSpacing: {
                title: i18n('schemas.text.spacing'),
                type: 'number',
                widget: 'inputNumber',
                span: 6,
                props: { min: 0 },
            },
            formatter: (0, extraFormatter_js_1.getExtraFormatterSchema)(i18n),
            lineHeight: {
                title: i18n('schemas.text.lineHeight'),
                type: 'number',
                widget: 'inputNumber',
                props: { step: 0.1, min: 0 },
                span: 8,
            },
            useDynamicFontSize: { type: 'boolean', widget: 'UseDynamicFontSize', bind: false, span: 16 },
            dynamicFontSize: {
                type: 'object',
                widget: 'card',
                column: 3,
                properties: {
                    min: {
                        title: i18n('schemas.text.min'),
                        type: 'number',
                        widget: 'inputNumber',
                        hidden: !enableDynamicFont,
                        props: { min: 0 },
                    },
                    max: {
                        title: i18n('schemas.text.max'),
                        type: 'number',
                        widget: 'inputNumber',
                        hidden: !enableDynamicFont,
                        props: { min: 0 },
                    },
                    fit: {
                        title: i18n('schemas.text.fit'),
                        type: 'string',
                        widget: 'select',
                        hidden: !enableDynamicFont,
                        props: {
                            options: [
                                { label: i18n('schemas.horizontal'), value: constants_js_1.DYNAMIC_FIT_HORIZONTAL },
                                { label: i18n('schemas.vertical'), value: constants_js_1.DYNAMIC_FIT_VERTICAL },
                            ],
                        },
                    },
                },
            },
            fontColor: {
                title: i18n('schemas.textColor'),
                type: 'string',
                widget: 'color',
                props: {
                    disabledAlpha: true,
                },
                rules: [
                    {
                        pattern: constants_js_2.HEX_COLOR_PATTERN,
                        message: i18n('validation.hexColor'),
                    },
                ],
            },
            backgroundColor: {
                title: i18n('schemas.bgColor'),
                type: 'string',
                widget: 'color',
                props: {
                    disabledAlpha: true,
                },
                rules: [
                    {
                        pattern: constants_js_2.HEX_COLOR_PATTERN,
                        message: i18n('validation.hexColor'),
                    },
                ],
            },
        };
        return textSchema;
    },
    widgets: { UseDynamicFontSize },
    defaultSchema: {
        name: '',
        type: 'text',
        content: 'Type Something...',
        position: { x: 0, y: 0 },
        width: 45,
        height: 10,
        // If the value of "rotate" is set to undefined or not set at all, rotation will be disabled in the UI.
        // Check this document: https://pdfme.com//docs/custom-schemas#learning-how-to-create-from-pdfmeschemas-code
        rotate: 0,
        alignment: constants_js_1.DEFAULT_ALIGNMENT,
        verticalAlignment: constants_js_1.DEFAULT_VERTICAL_ALIGNMENT,
        fontSize: constants_js_1.DEFAULT_FONT_SIZE,
        lineHeight: constants_js_1.DEFAULT_LINE_HEIGHT,
        characterSpacing: constants_js_1.DEFAULT_CHARACTER_SPACING,
        dynamicFontSize: undefined,
        fontColor: constants_js_1.DEFAULT_FONT_COLOR,
        fontName: undefined,
        backgroundColor: '',
        opacity: constants_js_2.DEFAULT_OPACITY,
        strikethrough: false,
        underline: false,
    },
};
//# sourceMappingURL=propPanel.js.map