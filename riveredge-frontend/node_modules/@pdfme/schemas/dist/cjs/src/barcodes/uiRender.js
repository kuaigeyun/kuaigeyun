"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiRender = void 0;
const helper_js_1 = require("./helper.js");
const utils_js_1 = require("../utils.js");
const fullSize = { width: '100%', height: '100%' };
const blobToDataURL = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});
const createBarcodeImage = async (schema, value) => {
    const imageBuf = await (0, helper_js_1.createBarCode)({
        ...schema,
        input: value,
    });
    const barcodeData = new Blob([new Uint8Array(imageBuf)], { type: 'image/png' });
    const barcodeDataURL = await blobToDataURL(barcodeData);
    return barcodeDataURL;
};
const createBarcodeImageElm = async (schema, value) => {
    const barcodeDataURL = await createBarcodeImage(schema, value);
    const img = document.createElement('img');
    img.src = barcodeDataURL;
    const imgStyle = { ...fullSize, borderRadius: 0 };
    Object.assign(img.style, imgStyle);
    return img;
};
const uiRender = async (arg) => {
    const { value, rootElement, mode, onChange, stopEditing, tabIndex, placeholder, schema, theme } = arg;
    const container = document.createElement('div');
    const containerStyle = {
        ...fullSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Open Sans', sans-serif",
    };
    Object.assign(container.style, containerStyle);
    rootElement.appendChild(container);
    const editable = (0, utils_js_1.isEditable)(mode, schema);
    if (editable) {
        const input = document.createElement('input');
        const inputStyle = {
            width: '100%',
            position: 'absolute',
            textAlign: 'center',
            fontSize: '12pt',
            fontWeight: 'bold',
            color: theme.colorWhite,
            backgroundColor: editable || value ? (0, utils_js_1.addAlphaToHex)('#000000', 80) : 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
        };
        Object.assign(input.style, inputStyle);
        input.value = value;
        input.placeholder = placeholder || '';
        input.tabIndex = tabIndex || 0;
        input.addEventListener('change', (e) => {
            if (onChange)
                onChange({ key: 'content', value: e.target.value });
        });
        input.addEventListener('blur', () => {
            if (stopEditing)
                stopEditing();
        });
        container.appendChild(input);
        input.setSelectionRange(value.length, value.length);
        if (mode === 'designer') {
            input.focus();
        }
    }
    if (!value)
        return;
    try {
        if (!(0, helper_js_1.validateBarcodeInput)(schema.type, value))
            throw new Error('[@pdfme/schemas/barcodes] Invalid barcode input');
        const imgElm = await createBarcodeImageElm(schema, value);
        container.appendChild(imgElm);
    }
    catch (err) {
        console.error(`[@pdfme/ui] ${String(err)}`);
        container.appendChild((0, utils_js_1.createErrorElm)());
    }
};
exports.uiRender = uiRender;
//# sourceMappingURL=uiRender.js.map