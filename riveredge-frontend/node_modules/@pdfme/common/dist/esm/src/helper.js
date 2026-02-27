import { z } from 'zod';
import { Buffer } from 'buffer';
import { Inputs as InputsSchema, UIOptions as UIOptionsSchema, Template as TemplateSchema, PreviewProps as PreviewPropsSchema, DesignerProps as DesignerPropsSchema, GenerateProps as GeneratePropsSchema, UIProps as UIPropsSchema, BlankPdf as BlankPdfSchema, } from './schema.js';
import { MM_TO_PT_RATIO, PT_TO_MM_RATIO, PT_TO_PX_RATIO, DEFAULT_FONT_NAME, DEFAULT_FONT_VALUE, } from './constants.js';
export const cloneDeep = structuredClone;
const uniq = (array) => Array.from(new Set(array));
export const getFallbackFontName = (font) => {
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
export const getDefaultFont = () => ({
    [DEFAULT_FONT_NAME]: { data: b64toUint8Array(DEFAULT_FONT_VALUE), fallback: true },
});
export const mm2pt = (mm) => {
    return parseFloat(String(mm)) * MM_TO_PT_RATIO;
};
export const pt2mm = (pt) => {
    return pt * PT_TO_MM_RATIO;
};
export const pt2px = (pt) => {
    return pt * PT_TO_PX_RATIO;
};
export const px2mm = (px) => {
    // http://www.endmemo.com/sconvert/millimeterpixel.php
    const ratio = 0.26458333333333;
    return parseFloat(String(px)) * ratio;
};
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
export const isHexValid = (hex) => {
    return /^#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/i.test(hex);
};
/**
 * Migrate from legacy keyed object format to array format
 * @param template Template
 */
export const migrateTemplate = (template) => {
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
export const getInputFromTemplate = (template) => {
    migrateTemplate(template);
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
export const getB64BasePdf = async (customPdf) => {
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
    return 'data:application/pdf;base64,' + Buffer.from(uint8Array).toString('base64');
};
export const isBlankPdf = (basePdf) => BlankPdfSchema.safeParse(basePdf).success;
const getByteString = (base64) => Buffer.from(base64, 'base64').toString('binary');
export const b64toUint8Array = (base64) => {
    const data = base64.split(';base64,')[1] ? base64.split(';base64,')[1] : base64;
    const byteString = getByteString(data);
    const unit8arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
        unit8arr[i] = byteString.charCodeAt(i);
    }
    return unit8arr;
};
const getFontNamesInSchemas = (schemas) => uniq(schemas
    .map((p) => p.map((v) => v.fontName ?? ''))
    .reduce((acc, cur) => acc.concat(cur), [])
    .filter(Boolean));
export const checkFont = (arg) => {
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
export const checkPlugins = (arg) => {
    const { plugins, template: { schemas }, } = arg;
    const allSchemaTypes = uniq(schemas.map((p) => p.map((v) => v.type)).flat());
    const pluginsSchemaTypes = Object.values(plugins).map((p) => p ? p.propPanel.defaultSchema.type : undefined);
    if (allSchemaTypes.some((s) => !pluginsSchemaTypes.includes(s))) {
        throw Error(`[@pdfme/common] ${allSchemaTypes
            .filter((s) => !pluginsSchemaTypes.includes(s))
            .join()} of template.schemas is not found in plugins.`);
    }
};
const checkProps = (data, zodSchema) => {
    try {
        zodSchema.parse(data);
    }
    catch (e) {
        if (e instanceof z.ZodError) {
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
            checkFont({ font: options.font, template });
        }
    }
    // Check plugins if template and plugins exist
    if (data && typeof data === 'object' && 'template' in data && 'plugins' in data) {
        const { template, plugins } = data;
        if (plugins) {
            checkPlugins({ plugins, template });
        }
    }
};
export const checkInputs = (data) => checkProps(data, InputsSchema);
export const checkUIOptions = (data) => checkProps(data, UIOptionsSchema);
export const checkPreviewProps = (data) => checkProps(data, PreviewPropsSchema);
export const checkDesignerProps = (data) => checkProps(data, DesignerPropsSchema);
export const checkUIProps = (data) => {
    if (typeof data === 'object' && data !== null && 'template' in data) {
        migrateTemplate(data.template);
    }
    checkProps(data, UIPropsSchema);
};
export const checkTemplate = (template) => {
    migrateTemplate(template);
    checkProps(template, TemplateSchema);
};
export const checkGenerateProps = (data) => {
    if (typeof data === 'object' && data !== null && 'template' in data) {
        migrateTemplate(data.template);
    }
    checkProps(data, GeneratePropsSchema);
};
//# sourceMappingURL=helper.js.map