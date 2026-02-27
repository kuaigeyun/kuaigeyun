"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropPanelByBarcodeType = void 0;
const constants_js_1 = require("./constants.js");
const constants_js_2 = require("../constants.js");
const defaultColors = {
    backgroundColor: constants_js_1.DEFAULT_BARCODE_BG_COLOR,
    barColor: constants_js_1.DEFAULT_BARCODE_COLOR,
};
const defaultTextColors = { textColor: constants_js_1.DEFAULT_BARCODE_COLOR };
const defaultIncludetext = { includetext: constants_js_1.DEFAULT_BARCODE_INCLUDETEXT };
const position = { x: 0, y: 0 };
const default40x20 = { width: 40, height: 20 };
const barcodeDefaults = [
    {
        defaultSchema: {
            name: '',
            type: 'qrcode',
            content: 'https://pdfme.com/',
            position,
            ...defaultColors,
            width: 30,
            height: 30,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'japanpost',
            content: '6540123789-A-K-Z',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            width: 80,
            height: 7.2,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'ean13',
            content: '2112345678900',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            height: 16,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'ean8',
            content: '02345673',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'code39',
            content: 'THIS IS CODE 39',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'code128',
            content: 'This is Code 128!',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'nw7',
            content: 'A0123456789B',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'itf14',
            content: '04601234567893',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            height: 12,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'upca',
            content: '416000336108',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            height: 16,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'upce',
            content: '00123457',
            position,
            ...defaultColors,
            ...defaultTextColors,
            ...defaultIncludetext,
            ...default40x20,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'gs1datamatrix',
            content: '(01)03453120000011(17)191125(10)ABCD1234',
            position,
            ...defaultColors,
            width: 30,
            height: 30,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
    {
        defaultSchema: {
            name: '',
            type: 'pdf417',
            content: 'This is PDF417!',
            position,
            ...defaultColors,
            width: 40,
            height: 16,
            rotate: 0,
            opacity: constants_js_2.DEFAULT_OPACITY,
        },
    },
];
const getPropPanelByBarcodeType = (barcodeType) => {
    const barcodeHasText = barcodeType !== 'qrcode' && barcodeType !== 'gs1datamatrix' && barcodeType !== 'pdf417';
    const defaults = barcodeDefaults.find(({ defaultSchema }) => defaultSchema.type === barcodeType);
    if (!defaults)
        throw new Error(`[@pdfme/schemas/barcodes] No default for barcode type ${barcodeType}`);
    return {
        schema: ({ i18n }) => ({
            barColor: {
                title: i18n('schemas.barcodes.barColor'),
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
            ...(barcodeHasText
                ? {
                    textColor: {
                        title: i18n('schemas.textColor'),
                        type: 'string',
                        widget: 'color',
                        props: {
                            disabledAlpha: true,
                        },
                    },
                    includetext: {
                        title: i18n('schemas.barcodes.includetext'),
                        type: 'boolean',
                        widget: 'switch',
                    },
                }
                : {}),
        }),
        ...defaults,
    };
};
exports.getPropPanelByBarcodeType = getPropPanelByBarcodeType;
//# sourceMappingURL=propPanel.js.map