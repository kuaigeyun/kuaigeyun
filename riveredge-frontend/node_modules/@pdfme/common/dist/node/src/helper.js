"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGenerateProps = exports.checkTemplate = exports.checkUIProps = exports.checkDesignerProps = exports.checkPreviewProps = exports.checkUIOptions = exports.checkInputs = exports.checkPlugins = exports.checkFont = exports.b64toUint8Array = exports.isBlankPdf = exports.getB64BasePdf = exports.getInputFromTemplate = exports.migrateTemplate = exports.isHexValid = exports.px2mm = exports.pt2px = exports.pt2mm = exports.mm2pt = exports.getDefaultFont = exports.getFallbackFontName = exports.cloneDeep = void 0;
const zod_1 = require("zod");
const buffer_1 = require("buffer");
const schema_js_1 = require("./schema.js");
const constants_js_1 = require("./constants.js");
exports.cloneDeep = structuredClone;
const uniq = (array) => Array.from(new Set(array));
const getFallbackFontName = (font) => {
    const initial = '';
    const fallbackFontName = Object.entries(font).reduce((acc, cur) => {
        const [fontName, fontValue] = cur;
        return !acc && fontValue.fallback ? fontName : acc;
    }, initial);
    if (fallbackFontName === initial) {
        throw Error(`[@pdfme/common] fallback flag is not found in font. true fallback flag must be only one.`);
    }
    return fallbackFontName;
};
exports.getFallbackFontName = getFallbackFontName;
const getDefaultFont = () => ({
    [constants_js_1.DEFAULT_FONT_NAME]: { data: (0, exports.b64toUint8Array)(constants_js_1.DEFAULT_FONT_VALUE), fallback: true },
});
exports.getDefaultFont = getDefaultFont;
const mm2pt = (mm) => {
    return parseFloat(String(mm)) * constants_js_1.MM_TO_PT_RATIO;
};
exports.mm2pt = mm2pt;
const pt2mm = (pt) => {
    return pt * constants_js_1.PT_TO_MM_RATIO;
};
exports.pt2mm = pt2mm;
const pt2px = (pt) => {
    return pt * constants_js_1.PT_TO_PX_RATIO;
};
exports.pt2px = pt2px;
const px2mm = (px) => {
    // http://www.endmemo.com/sconvert/millimeterpixel.php
    const ratio = 0.26458333333333;
    return parseFloat(String(px)) * ratio;
};
exports.px2mm = px2mm;
const blob2Base64Pdf = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result.startsWith('data:application/pdf;')) {
                resolve(reader.result);
            }
            else {
                reject(Error('[@pdfme/common] template.basePdf must be pdf data.'));
            }
        };
        reader.readAsDataURL(blob);
    });
};
const isHexValid = (hex) => {
    return /^#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/i.test(hex);
};
exports.isHexValid = isHexValid;
/**
 * Migrate from legacy keyed object format to array format
 * @param template Template
 */
const migrateTemplate = (template) => {
    if (!template.schemas) {
        return;
    }
    if (Array.isArray(template.schemas) &&
        template.schemas.length > 0 &&
        !Array.isArray(template.schemas[0])) {
        template.schemas = template.schemas.map((page) => Object.entries(page).map(([key, value]) => ({
            ...value,
            name: key,
        })));
    }
};
exports.migrateTemplate = migrateTemplate;
const getInputFromTemplate = (template) => {
    (0, exports.migrateTemplate)(template);
    const input = {};
    template.schemas.forEach((page) => {
        page.forEach((schema) => {
            if (!schema.readOnly) {
                input[schema.name] = schema.content || '';
            }
        });
    });
    return [input];
};
exports.getInputFromTemplate = getInputFromTemplate;
const getB64BasePdf = async (customPdf) => {
    if (typeof customPdf === 'string' &&
        !customPdf.startsWith('data:application/pdf;') &&
        typeof window !== 'undefined') {
        const response = await fetch(customPdf);
        const blob = await response.blob();
        return blob2Base64Pdf(blob);
    }
    if (typeof customPdf === 'string') {
        return customPdf;
    }
    const uint8Array = customPdf instanceof Uint8Array ? customPdf : new Uint8Array(customPdf);
    return 'data:application/pdf;base64,' + buffer_1.Buffer.from(uint8Array).toString('base64');
};
exports.getB64BasePdf = getB64BasePdf;
const isBlankPdf = (basePdf) => schema_js_1.BlankPdf.safeParse(basePdf).success;
exports.isBlankPdf = isBlankPdf;
const getByteString = (base64) => buffer_1.Buffer.from(base64, 'base64').toString('binary');
const b64toUint8Array = (base64) => {
    const data = base64.split(';base64,')[1] ? base64.split(';base64,')[1] : base64;
    const byteString = getByteString(data);
    const unit8arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
        unit8arr[i] = byteString.charCodeAt(i);
    }
    return unit8arr;
};
exports.b64toUint8Array = b64toUint8Array;
const getFontNamesInSchemas = (schemas) => uniq(schemas
    .map((p) => p.map((v) => v.fontName ?? ''))
    .reduce((acc, cur) => acc.concat(cur), [])
    .filter(Boolean));
const checkFont = (arg) => {
    const { font, template: { schemas }, } = arg;
    const fontValues = Object.values(font);
    const fallbackFontNum = fontValues.reduce((acc, cur) => (cur.fallback ? acc + 1 : acc), 0);
    if (fallbackFontNum === 0) {
        throw Error(`[@pdfme/common] fallback flag is not found in font. true fallback flag must be only one.
Check this document: https://pdfme.com/docs/custom-fonts#about-font-type`);
    }
    if (fallbackFontNum > 1) {
        throw Error(`[@pdfme/common] ${fallbackFontNum} fallback flags found in font. true fallback flag must be only one.
Check this document: https://pdfme.com/docs/custom-fonts#about-font-type`);
    }
    const fontNamesInSchemas = getFontNamesInSchemas(schemas);
    const fontNames = Object.keys(font);
    if (fontNamesInSchemas.some((f) => !fontNames.includes(f))) {
        throw Error(`[@pdfme/common] ${fontNamesInSchemas
            .filter((f) => !fontNames.includes(f))
            .join()} of template.schemas is not found in font.
Check this document: https://pdfme.com/docs/custom-fonts`);
    }
};
exports.checkFont = checkFont;
const checkPlugins = (arg) => {
    const { plugins, template: { schemas }, } = arg;
    const allSchemaTypes = uniq(schemas.map((p) => p.map((v) => v.type)).flat());
    const pluginsSchemaTypes = Object.values(plugins).map((p) => p ? p.propPanel.defaultSchema.type : undefined);
    if (allSchemaTypes.some((s) => !pluginsSchemaTypes.includes(s))) {
        throw Error(`[@pdfme/common] ${allSchemaTypes
            .filter((s) => !pluginsSchemaTypes.includes(s))
            .join()} of template.schemas is not found in plugins.`);
    }
};
exports.checkPlugins = checkPlugins;
const checkProps = (data, zodSchema) => {
    try {
        zodSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            const messages = e.issues.map((issue) => `ERROR POSITION: ${issue.path.join('.')}
ERROR MESSAGE: ${issue.message}
--------------------------`);
            throw Error(`[@pdfme/common] Invalid argument:
--------------------------
${messages.join('\n')}`);
        }
        else {
            throw Error(`[@pdfme/common] Unexpected parsing error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    // Check fonts if template and options exist
    if (data && typeof data === 'object' && 'template' in data && 'options' in data) {
        const { template, options } = data;
        if (options && options.font) {
            (0, exports.checkFont)({ font: options.font, template });
        }
    }
    // Check plugins if template and plugins exist
    if (data && typeof data === 'object' && 'template' in data && 'plugins' in data) {
        const { template, plugins } = data;
        if (plugins) {
            (0, exports.checkPlugins)({ plugins, template });
        }
    }
};
const checkInputs = (data) => checkProps(data, schema_js_1.Inputs);
exports.checkInputs = checkInputs;
const checkUIOptions = (data) => checkProps(data, schema_js_1.UIOptions);
exports.checkUIOptions = checkUIOptions;
const checkPreviewProps = (data) => checkProps(data, schema_js_1.PreviewProps);
exports.checkPreviewProps = checkPreviewProps;
const checkDesignerProps = (data) => checkProps(data, schema_js_1.DesignerProps);
exports.checkDesignerProps = checkDesignerProps;
const checkUIProps = (data) => {
    if (typeof data === 'object' && data !== null && 'template' in data) {
        (0, exports.migrateTemplate)(data.template);
    }
    checkProps(data, schema_js_1.UIProps);
};
exports.checkUIProps = checkUIProps;
const checkTemplate = (template) => {
    (0, exports.migrateTemplate)(template);
    checkProps(template, schema_js_1.Template);
};
exports.checkTemplate = checkTemplate;
const checkGenerateProps = (data) => {
    if (typeof data === 'object' && data !== null && 'template' in data) {
        (0, exports.migrateTemplate)(data.template);
    }
    checkProps(data, schema_js_1.GenerateProps);
};
exports.checkGenerateProps = checkGenerateProps;
//# sourceMappingURL=helper.js.map