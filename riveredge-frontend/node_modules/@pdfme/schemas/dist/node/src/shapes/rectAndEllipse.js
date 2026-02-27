"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipse = exports.rectangle = void 0;
const common_1 = require("@pdfme/common");
const constants_js_1 = require("../constants.js");
const utils_js_1 = require("../utils.js");
const pdf_lib_1 = require("@pdfme/pdf-lib");
const lucide_1 = require("lucide");
const shape = {
    ui: (arg) => {
        const { schema, rootElement } = arg;
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.boxSizing = 'border-box';
        if (schema.type === 'ellipse') {
            div.style.borderRadius = '50%';
        }
        else if (schema.radius && schema.radius > 0) {
            div.style.borderRadius = `${schema.radius}mm`;
        }
        div.style.borderWidth = `${schema.borderWidth ?? 0}mm`;
        div.style.borderStyle = schema.borderWidth && schema.borderColor ? 'solid' : 'none';
        div.style.borderColor = schema.borderColor ?? 'transparent';
        div.style.backgroundColor = schema.color ?? 'transparent';
        rootElement.appendChild(div);
    },
    pdf: (arg) => {
        const { schema, page, options } = arg;
        if (!schema.color && !schema.borderColor)
            return;
        const { colorType } = options;
        const pageHeight = page.getHeight();
        const cArg = { schema, pageHeight };
        const { position, width, height, rotate, opacity } = (0, utils_js_1.convertForPdfLayoutProps)(cArg);
        const { position: { x: x4Ellipse, y: y4Ellipse }, } = (0, utils_js_1.convertForPdfLayoutProps)({ ...cArg, applyRotateTranslate: false });
        const borderWidth = schema.borderWidth ? (0, common_1.mm2pt)(schema.borderWidth) : 0;
        const drawOptions = {
            rotate,
            borderWidth,
            borderColor: (0, utils_js_1.hex2PrintingColor)(schema.borderColor, colorType),
            color: (0, utils_js_1.hex2PrintingColor)(schema.color, colorType),
            opacity,
            borderOpacity: opacity,
        };
        if (schema.type === 'ellipse') {
            page.drawEllipse({
                x: x4Ellipse + width / 2,
                y: y4Ellipse + height / 2,
                xScale: width / 2 - borderWidth / 2,
                yScale: height / 2 - borderWidth / 2,
                ...drawOptions,
            });
        }
        else if (schema.type === 'rectangle') {
            const radius = schema.radius ?? 0;
            page.drawRectangle({
                x: position.x +
                    borderWidth * ((1 - Math.sin((0, pdf_lib_1.toRadians)(rotate))) / 2) +
                    Math.tan((0, pdf_lib_1.toRadians)(rotate)) * Math.PI ** 2,
                y: position.y +
                    borderWidth * ((1 + Math.sin((0, pdf_lib_1.toRadians)(rotate))) / 2) +
                    Math.tan((0, pdf_lib_1.toRadians)(rotate)) * Math.PI ** 2,
                width: width - borderWidth,
                height: height - borderWidth,
                ...(radius ? { radius: (0, common_1.mm2pt)(radius) } : {}),
                ...drawOptions,
            });
        }
    },
    propPanel: {
        schema: ({ i18n }) => ({
            borderWidth: {
                title: i18n('schemas.borderWidth'),
                type: 'number',
                widget: 'inputNumber',
                props: { min: 0, step: 1 },
                span: 12,
            },
            borderColor: {
                title: i18n('schemas.borderColor'),
                type: 'string',
                widget: 'color',
                props: {
                    disabledAlpha: true,
                },
                rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
                span: 12,
            },
            color: {
                title: i18n('schemas.color'),
                type: 'string',
                widget: 'color',
                props: {
                    disabledAlpha: true,
                },
                rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
            },
            radius: {
                title: i18n('schemas.radius'),
                type: 'number',
                widget: 'inputNumber',
                props: { min: 0, step: 1 },
                span: 12,
            },
        }),
        defaultSchema: {
            name: '',
            type: 'rectangle',
            position: { x: 0, y: 0 },
            width: 62.5,
            height: 37.5,
            rotate: 0,
            opacity: 1,
            borderWidth: 1,
            borderColor: '#000000',
            color: '',
            readOnly: true,
            radius: 0,
        },
    },
};
const getPropPanelSchema = (type) => ({
    ...shape.propPanel,
    defaultSchema: {
        ...shape.propPanel.defaultSchema,
        type,
    },
});
exports.rectangle = {
    ...shape,
    propPanel: getPropPanelSchema('rectangle'),
    icon: (0, utils_js_1.createSvgStr)(lucide_1.Square),
};
exports.ellipse = {
    ...shape,
    propPanel: getPropPanelSchema('ellipse'),
    icon: (0, utils_js_1.createSvgStr)(lucide_1.Circle),
};
//# sourceMappingURL=rectAndEllipse.js.map