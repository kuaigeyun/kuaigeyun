import { z } from 'zod';
export declare const Lang: z.ZodEnum<{
    en: "en";
    zh: "zh";
    ja: "ja";
    ko: "ko";
    ar: "ar";
    th: "th";
    pl: "pl";
    it: "it";
    de: "de";
    es: "es";
    fr: "fr";
}>;
export declare const Dict: z.ZodObject<{
    cancel: z.ZodString;
    close: z.ZodString;
    set: z.ZodString;
    clear: z.ZodString;
    field: z.ZodString;
    fieldName: z.ZodString;
    align: z.ZodString;
    width: z.ZodString;
    opacity: z.ZodString;
    height: z.ZodString;
    rotate: z.ZodString;
    edit: z.ZodString;
    required: z.ZodString;
    editable: z.ZodString;
    plsInputName: z.ZodString;
    fieldMustUniq: z.ZodString;
    notUniq: z.ZodString;
    noKeyName: z.ZodString;
    fieldsList: z.ZodString;
    editField: z.ZodString;
    type: z.ZodString;
    errorOccurred: z.ZodString;
    errorBulkUpdateFieldName: z.ZodString;
    commitBulkUpdateFieldName: z.ZodString;
    bulkUpdateFieldName: z.ZodString;
    addPageAfter: z.ZodString;
    removePage: z.ZodString;
    removePageConfirm: z.ZodString;
    'validation.uniqueName': z.ZodString;
    'validation.hexColor': z.ZodString;
    'validation.dateTimeFormat': z.ZodString;
    'validation.outOfBounds': z.ZodString;
    'schemas.color': z.ZodString;
    'schemas.borderWidth': z.ZodString;
    'schemas.borderColor': z.ZodString;
    'schemas.backgroundColor': z.ZodString;
    'schemas.textColor': z.ZodString;
    'schemas.bgColor': z.ZodString;
    'schemas.horizontal': z.ZodString;
    'schemas.vertical': z.ZodString;
    'schemas.left': z.ZodString;
    'schemas.center': z.ZodString;
    'schemas.right': z.ZodString;
    'schemas.top': z.ZodString;
    'schemas.middle': z.ZodString;
    'schemas.bottom': z.ZodString;
    'schemas.padding': z.ZodString;
    'schemas.text.fontName': z.ZodString;
    'schemas.text.size': z.ZodString;
    'schemas.text.spacing': z.ZodString;
    'schemas.text.textAlign': z.ZodString;
    'schemas.text.verticalAlign': z.ZodString;
    'schemas.text.lineHeight': z.ZodString;
    'schemas.text.min': z.ZodString;
    'schemas.text.max': z.ZodString;
    'schemas.text.fit': z.ZodString;
    'schemas.text.dynamicFontSize': z.ZodString;
    'schemas.text.format': z.ZodString;
    'schemas.radius': z.ZodString;
    'schemas.mvt.typingInstructions': z.ZodString;
    'schemas.mvt.sampleField': z.ZodString;
    'schemas.mvt.variablesSampleData': z.ZodString;
    'schemas.barcodes.barColor': z.ZodString;
    'schemas.barcodes.includetext': z.ZodString;
    'schemas.table.alternateBackgroundColor': z.ZodString;
    'schemas.table.tableStyle': z.ZodString;
    'schemas.table.showHead': z.ZodString;
    'schemas.table.repeatHead': z.ZodString;
    'schemas.table.headStyle': z.ZodString;
    'schemas.table.bodyStyle': z.ZodString;
    'schemas.table.columnStyle': z.ZodString;
    'schemas.date.format': z.ZodString;
    'schemas.date.locale': z.ZodString;
    'schemas.select.options': z.ZodString;
    'schemas.select.optionPlaceholder': z.ZodString;
    'schemas.radioGroup.groupName': z.ZodString;
}, z.core.$strip>;
export declare const Mode: z.ZodEnum<{
    viewer: "viewer";
    form: "form";
    designer: "designer";
}>;
export declare const ColorType: z.ZodOptional<z.ZodEnum<{
    rgb: "rgb";
    cmyk: "cmyk";
}>>;
export declare const Size: z.ZodObject<{
    height: z.ZodNumber;
    width: z.ZodNumber;
}, z.core.$strip>;
export declare const Schema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    rotate: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
    __bodyRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    __isSplit: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
export declare const SchemaForUI: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    rotate: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
    __bodyRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    __isSplit: z.ZodOptional<z.ZodBoolean>;
    id: z.ZodString;
}, z.core.$strip>;
export declare const BlankPdf: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        rotate: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
        readOnly: z.ZodOptional<z.ZodBoolean>;
        required: z.ZodOptional<z.ZodBoolean>;
        __bodyRange: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        __isSplit: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>>>;
}, z.core.$strip>;
export declare const CustomPdf: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
export declare const BasePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        rotate: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
        readOnly: z.ZodOptional<z.ZodBoolean>;
        required: z.ZodOptional<z.ZodBoolean>;
        __bodyRange: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        __isSplit: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>>>;
}, z.core.$strip>]>;
export declare const LegacySchemaPageArray: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    rotate: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
    __bodyRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    __isSplit: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>>>;
export declare const SchemaPageArray: z.ZodArray<z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    rotate: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    required: z.ZodOptional<z.ZodBoolean>;
    __bodyRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    __isSplit: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>>>;
export declare const Template: z.ZodObject<{
    schemas: z.ZodArray<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        rotate: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
        readOnly: z.ZodOptional<z.ZodBoolean>;
        required: z.ZodOptional<z.ZodBoolean>;
        __bodyRange: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        __isSplit: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>>>;
    basePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>>>;
    }, z.core.$strip>]>;
    pdfmeVersion: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const Inputs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>;
export declare const Font: z.ZodRecord<z.ZodString, z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
    fallback: z.ZodOptional<z.ZodBoolean>;
    subset: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
export declare const Plugin: z.ZodObject<{
    ui: z.ZodAny;
    pdf: z.ZodAny;
    propPanel: z.ZodObject<{
        schema: z.ZodUnknown;
        widgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        defaultSchema: z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>;
    }, z.core.$strip>;
    icon: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const CommonOptions: z.ZodObject<{
    font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
        fallback: z.ZodOptional<z.ZodBoolean>;
        subset: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$loose>;
export declare const GeneratorOptions: z.ZodObject<{
    font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
        fallback: z.ZodOptional<z.ZodBoolean>;
        subset: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    colorType: z.ZodOptional<z.ZodEnum<{
        rgb: "rgb";
        cmyk: "cmyk";
    }>>;
    author: z.ZodOptional<z.ZodString>;
    creationDate: z.ZodOptional<z.ZodDate>;
    creator: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lang: z.ZodOptional<z.ZodEnum<{
        en: "en";
        zh: "zh";
        ja: "ja";
        ko: "ko";
        ar: "ar";
        th: "th";
        pl: "pl";
        it: "it";
        de: "de";
        es: "es";
        fr: "fr";
    }>>;
    modificationDate: z.ZodOptional<z.ZodDate>;
    producer: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const GenerateProps: z.ZodObject<{
    template: z.ZodObject<{
        schemas: z.ZodArray<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>>>;
        basePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>>>;
        }, z.core.$strip>]>;
        pdfmeVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    plugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        ui: z.ZodAny;
        pdf: z.ZodAny;
        propPanel: z.ZodObject<{
            schema: z.ZodUnknown;
            widgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            defaultSchema: z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>;
        }, z.core.$strip>;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    inputs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>;
    options: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
            fallback: z.ZodOptional<z.ZodBoolean>;
            subset: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        colorType: z.ZodOptional<z.ZodEnum<{
            rgb: "rgb";
            cmyk: "cmyk";
        }>>;
        author: z.ZodOptional<z.ZodString>;
        creationDate: z.ZodOptional<z.ZodDate>;
        creator: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
        lang: z.ZodOptional<z.ZodEnum<{
            en: "en";
            zh: "zh";
            ja: "ja";
            ko: "ko";
            ar: "ar";
            th: "th";
            pl: "pl";
            it: "it";
            de: "de";
            es: "es";
            fr: "fr";
        }>>;
        modificationDate: z.ZodOptional<z.ZodDate>;
        producer: z.ZodOptional<z.ZodString>;
        subject: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>;
}, z.core.$strict>;
export declare const UIOptions: z.ZodObject<{
    font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
        fallback: z.ZodOptional<z.ZodBoolean>;
        subset: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    lang: z.ZodOptional<z.ZodEnum<{
        en: "en";
        zh: "zh";
        ja: "ja";
        ko: "ko";
        ar: "ar";
        th: "th";
        pl: "pl";
        it: "it";
        de: "de";
        es: "es";
        fr: "fr";
    }>>;
    labels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    theme: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    icons: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    requiredByDefault: z.ZodOptional<z.ZodBoolean>;
    maxZoom: z.ZodOptional<z.ZodNumber>;
    sidebarOpen: z.ZodOptional<z.ZodBoolean>;
    zoomLevel: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>;
export declare const UIProps: z.ZodObject<{
    template: z.ZodObject<{
        schemas: z.ZodArray<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>>>;
        basePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>>>;
        }, z.core.$strip>]>;
        pdfmeVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    plugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        ui: z.ZodAny;
        pdf: z.ZodAny;
        propPanel: z.ZodObject<{
            schema: z.ZodUnknown;
            widgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            defaultSchema: z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>;
        }, z.core.$strip>;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    domContainer: z.ZodType<HTMLElement, unknown, z.core.$ZodTypeInternals<HTMLElement, unknown>>;
    options: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
            fallback: z.ZodOptional<z.ZodBoolean>;
            subset: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        lang: z.ZodOptional<z.ZodEnum<{
            en: "en";
            zh: "zh";
            ja: "ja";
            ko: "ko";
            ar: "ar";
            th: "th";
            pl: "pl";
            it: "it";
            de: "de";
            es: "es";
            fr: "fr";
        }>>;
        labels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        theme: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        icons: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        requiredByDefault: z.ZodOptional<z.ZodBoolean>;
        maxZoom: z.ZodOptional<z.ZodNumber>;
        sidebarOpen: z.ZodOptional<z.ZodBoolean>;
        zoomLevel: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>;
}, z.core.$strip>;
export declare const PreviewProps: z.ZodObject<{
    template: z.ZodObject<{
        schemas: z.ZodArray<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>>>;
        basePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>>>;
        }, z.core.$strip>]>;
        pdfmeVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    plugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        ui: z.ZodAny;
        pdf: z.ZodAny;
        propPanel: z.ZodObject<{
            schema: z.ZodUnknown;
            widgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            defaultSchema: z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>;
        }, z.core.$strip>;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    domContainer: z.ZodType<HTMLElement, unknown, z.core.$ZodTypeInternals<HTMLElement, unknown>>;
    options: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
            fallback: z.ZodOptional<z.ZodBoolean>;
            subset: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        lang: z.ZodOptional<z.ZodEnum<{
            en: "en";
            zh: "zh";
            ja: "ja";
            ko: "ko";
            ar: "ar";
            th: "th";
            pl: "pl";
            it: "it";
            de: "de";
            es: "es";
            fr: "fr";
        }>>;
        labels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        theme: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        icons: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        requiredByDefault: z.ZodOptional<z.ZodBoolean>;
        maxZoom: z.ZodOptional<z.ZodNumber>;
        sidebarOpen: z.ZodOptional<z.ZodBoolean>;
        zoomLevel: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>;
    inputs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strict>;
export declare const DesignerProps: z.ZodObject<{
    template: z.ZodObject<{
        schemas: z.ZodArray<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            content: z.ZodOptional<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotate: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
            readOnly: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            __bodyRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            __isSplit: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>>>;
        basePdf: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>, z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            padding: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            staticSchema: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>>>;
        }, z.core.$strip>]>;
        pdfmeVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
    plugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        ui: z.ZodAny;
        pdf: z.ZodAny;
        propPanel: z.ZodObject<{
            schema: z.ZodUnknown;
            widgets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            defaultSchema: z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
                content: z.ZodOptional<z.ZodString>;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strip>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotate: z.ZodOptional<z.ZodNumber>;
                opacity: z.ZodOptional<z.ZodNumber>;
                readOnly: z.ZodOptional<z.ZodBoolean>;
                required: z.ZodOptional<z.ZodBoolean>;
                __bodyRange: z.ZodOptional<z.ZodObject<{
                    start: z.ZodNumber;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                __isSplit: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$loose>;
        }, z.core.$strip>;
        icon: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    domContainer: z.ZodType<HTMLElement, unknown, z.core.$ZodTypeInternals<HTMLElement, unknown>>;
    options: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            data: z.ZodUnion<readonly [z.ZodString, z.ZodType<ArrayBuffer, unknown, z.core.$ZodTypeInternals<ArrayBuffer, unknown>>, z.ZodType<Uint8Array<ArrayBuffer>, unknown, z.core.$ZodTypeInternals<Uint8Array<ArrayBuffer>, unknown>>]>;
            fallback: z.ZodOptional<z.ZodBoolean>;
            subset: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        lang: z.ZodOptional<z.ZodEnum<{
            en: "en";
            zh: "zh";
            ja: "ja";
            ko: "ko";
            ar: "ar";
            th: "th";
            pl: "pl";
            it: "it";
            de: "de";
            es: "es";
            fr: "fr";
        }>>;
        labels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        theme: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        icons: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        requiredByDefault: z.ZodOptional<z.ZodBoolean>;
        maxZoom: z.ZodOptional<z.ZodNumber>;
        sidebarOpen: z.ZodOptional<z.ZodBoolean>;
        zoomLevel: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>;
}, z.core.$strict>;
