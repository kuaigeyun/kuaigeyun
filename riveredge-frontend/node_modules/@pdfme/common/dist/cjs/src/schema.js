"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignerProps = exports.PreviewProps = exports.UIProps = exports.UIOptions = exports.GenerateProps = exports.GeneratorOptions = exports.CommonOptions = exports.Plugin = exports.Font = exports.Inputs = exports.Template = exports.SchemaPageArray = exports.LegacySchemaPageArray = exports.BasePdf = exports.CustomPdf = exports.BlankPdf = exports.SchemaForUI = exports.Schema = exports.Size = exports.ColorType = exports.Mode = exports.Dict = exports.Lang = void 0;
const zod_1 = require("zod");
const langs = ['en', 'zh', 'ja', 'ko', 'ar', 'th', 'pl', 'it', 'de', 'es', 'fr'];
exports.Lang = zod_1.z.enum(langs);
exports.Dict = zod_1.z.object({
    // -----------------used in ui-----------------
    cancel: zod_1.z.string(),
    close: zod_1.z.string(),
    set: zod_1.z.string(),
    clear: zod_1.z.string(),
    field: zod_1.z.string(),
    fieldName: zod_1.z.string(),
    align: zod_1.z.string(),
    width: zod_1.z.string(),
    opacity: zod_1.z.string(),
    height: zod_1.z.string(),
    rotate: zod_1.z.string(),
    edit: zod_1.z.string(),
    required: zod_1.z.string(),
    editable: zod_1.z.string(),
    plsInputName: zod_1.z.string(),
    fieldMustUniq: zod_1.z.string(),
    notUniq: zod_1.z.string(),
    noKeyName: zod_1.z.string(),
    fieldsList: zod_1.z.string(),
    editField: zod_1.z.string(),
    type: zod_1.z.string(),
    errorOccurred: zod_1.z.string(),
    errorBulkUpdateFieldName: zod_1.z.string(),
    commitBulkUpdateFieldName: zod_1.z.string(),
    bulkUpdateFieldName: zod_1.z.string(),
    addPageAfter: zod_1.z.string(),
    removePage: zod_1.z.string(),
    removePageConfirm: zod_1.z.string(),
    // --------------------validation-------------------
    'validation.uniqueName': zod_1.z.string(),
    'validation.hexColor': zod_1.z.string(),
    'validation.dateTimeFormat': zod_1.z.string(),
    'validation.outOfBounds': zod_1.z.string(),
    // -----------------used in schemas-----------------
    'schemas.color': zod_1.z.string(),
    'schemas.borderWidth': zod_1.z.string(),
    'schemas.borderColor': zod_1.z.string(),
    'schemas.backgroundColor': zod_1.z.string(),
    'schemas.textColor': zod_1.z.string(),
    'schemas.bgColor': zod_1.z.string(),
    'schemas.horizontal': zod_1.z.string(),
    'schemas.vertical': zod_1.z.string(),
    'schemas.left': zod_1.z.string(),
    'schemas.center': zod_1.z.string(),
    'schemas.right': zod_1.z.string(),
    'schemas.top': zod_1.z.string(),
    'schemas.middle': zod_1.z.string(),
    'schemas.bottom': zod_1.z.string(),
    'schemas.padding': zod_1.z.string(),
    'schemas.text.fontName': zod_1.z.string(),
    'schemas.text.size': zod_1.z.string(),
    'schemas.text.spacing': zod_1.z.string(),
    'schemas.text.textAlign': zod_1.z.string(),
    'schemas.text.verticalAlign': zod_1.z.string(),
    'schemas.text.lineHeight': zod_1.z.string(),
    'schemas.text.min': zod_1.z.string(),
    'schemas.text.max': zod_1.z.string(),
    'schemas.text.fit': zod_1.z.string(),
    'schemas.text.dynamicFontSize': zod_1.z.string(),
    'schemas.text.format': zod_1.z.string(),
    'schemas.radius': zod_1.z.string(),
    'schemas.mvt.typingInstructions': zod_1.z.string(),
    'schemas.mvt.sampleField': zod_1.z.string(),
    'schemas.mvt.variablesSampleData': zod_1.z.string(),
    'schemas.barcodes.barColor': zod_1.z.string(),
    'schemas.barcodes.includetext': zod_1.z.string(),
    'schemas.table.alternateBackgroundColor': zod_1.z.string(),
    'schemas.table.tableStyle': zod_1.z.string(),
    'schemas.table.showHead': zod_1.z.string(),
    'schemas.table.repeatHead': zod_1.z.string(),
    'schemas.table.headStyle': zod_1.z.string(),
    'schemas.table.bodyStyle': zod_1.z.string(),
    'schemas.table.columnStyle': zod_1.z.string(),
    'schemas.date.format': zod_1.z.string(),
    'schemas.date.locale': zod_1.z.string(),
    'schemas.select.options': zod_1.z.string(),
    'schemas.select.optionPlaceholder': zod_1.z.string(),
    'schemas.radioGroup.groupName': zod_1.z.string(),
});
exports.Mode = zod_1.z.enum(['viewer', 'form', 'designer']);
exports.ColorType = zod_1.z.enum(['rgb', 'cmyk']).optional();
exports.Size = zod_1.z.object({ height: zod_1.z.number(), width: zod_1.z.number() });
exports.Schema = zod_1.z
    .object({
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    content: zod_1.z.string().optional(),
    position: zod_1.z.object({ x: zod_1.z.number(), y: zod_1.z.number() }),
    width: zod_1.z.number(),
    height: zod_1.z.number(),
    rotate: zod_1.z.number().optional(),
    opacity: zod_1.z.number().optional(),
    readOnly: zod_1.z.boolean().optional(),
    required: zod_1.z.boolean().optional(),
    __bodyRange: zod_1.z.object({ start: zod_1.z.number(), end: zod_1.z.number().optional() }).optional(),
    __isSplit: zod_1.z.boolean().optional(),
})
    .passthrough();
const SchemaForUIAdditionalInfo = zod_1.z.object({ id: zod_1.z.string() });
exports.SchemaForUI = exports.Schema.merge(SchemaForUIAdditionalInfo);
const ArrayBufferSchema = zod_1.z.any().refine((v) => v instanceof ArrayBuffer);
const Uint8ArraySchema = zod_1.z
    .any()
    .refine((v) => v instanceof Uint8Array && v.buffer instanceof ArrayBuffer);
exports.BlankPdf = zod_1.z.object({
    width: zod_1.z.number(),
    height: zod_1.z.number(),
    padding: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]),
    staticSchema: zod_1.z.array(exports.Schema).optional(),
});
exports.CustomPdf = zod_1.z.union([zod_1.z.string(), ArrayBufferSchema, Uint8ArraySchema]);
exports.BasePdf = zod_1.z.union([exports.CustomPdf, exports.BlankPdf]);
// Legacy keyed structure for BC - we convert to SchemaPageArray on import
exports.LegacySchemaPageArray = zod_1.z.array(zod_1.z.record(zod_1.z.string(), exports.Schema));
exports.SchemaPageArray = zod_1.z.array(zod_1.z.array(exports.Schema));
exports.Template = zod_1.z
    .object({
    schemas: exports.SchemaPageArray,
    basePdf: exports.BasePdf,
    pdfmeVersion: zod_1.z.string().optional(),
})
    .passthrough();
exports.Inputs = zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).min(1);
exports.Font = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    data: zod_1.z.union([zod_1.z.string(), ArrayBufferSchema, Uint8ArraySchema]),
    fallback: zod_1.z.boolean().optional(),
    subset: zod_1.z.boolean().optional(),
}));
exports.Plugin = zod_1.z
    .object({
    ui: zod_1.z.any(),
    pdf: zod_1.z.any(),
    propPanel: zod_1.z.object({
        schema: zod_1.z.unknown(),
        widgets: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
        defaultSchema: exports.Schema,
    }),
    icon: zod_1.z.string().optional(),
})
    .passthrough();
exports.CommonOptions = zod_1.z.object({ font: exports.Font.optional() }).passthrough();
const CommonProps = zod_1.z.object({
    template: exports.Template,
    options: exports.CommonOptions.optional(),
    plugins: zod_1.z.record(zod_1.z.string(), exports.Plugin).optional(),
});
// -------------------generate-------------------
exports.GeneratorOptions = exports.CommonOptions.extend({
    colorType: exports.ColorType,
    author: zod_1.z.string().optional(),
    creationDate: zod_1.z.date().optional(),
    creator: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
    lang: exports.Lang.optional(),
    modificationDate: zod_1.z.date().optional(),
    producer: zod_1.z.string().optional(),
    subject: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
});
exports.GenerateProps = CommonProps.extend({
    inputs: exports.Inputs,
    options: exports.GeneratorOptions.optional(),
}).strict();
// ---------------------ui------------------------
exports.UIOptions = exports.CommonOptions.extend({
    lang: exports.Lang.optional(),
    labels: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    theme: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    icons: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    requiredByDefault: zod_1.z.boolean().optional(),
    maxZoom: zod_1.z.number().optional(),
    sidebarOpen: zod_1.z.boolean().optional(),
    zoomLevel: zod_1.z.number().optional(),
});
const HTMLElementSchema = zod_1.z.any().refine((v) => v instanceof HTMLElement);
exports.UIProps = CommonProps.extend({
    domContainer: HTMLElementSchema,
    options: exports.UIOptions.optional(),
});
exports.PreviewProps = exports.UIProps.extend({ inputs: exports.Inputs }).strict();
exports.DesignerProps = exports.UIProps.extend({}).strict();
//# sourceMappingURL=schema.js.map