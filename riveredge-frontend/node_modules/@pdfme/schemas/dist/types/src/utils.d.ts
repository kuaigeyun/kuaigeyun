import { Color } from '@pdfme/pdf-lib';
import { Schema, Mode, ColorType } from '@pdfme/common';
import { IconNode } from 'lucide';
export declare const convertForPdfLayoutProps: ({ schema, pageHeight, applyRotateTranslate, }: {
    schema: Schema;
    pageHeight: number;
    applyRotateTranslate?: boolean;
}) => {
    position: {
        x: number;
        y: number;
    };
    height: number;
    width: number;
    rotate: import("@pdfme/pdf-lib").Degrees;
    opacity: number | undefined;
};
export declare const rotatePoint: (point: {
    x: number;
    y: number;
}, pivot: {
    x: number;
    y: number;
}, angleDegrees: number) => {
    x: number;
    y: number;
};
export declare const getDynamicHeightsForTable: (value: string, args: {
    schema: Schema;
    basePdf: import("@pdfme/common").BasePdf;
    options: import("@pdfme/common").CommonOptions;
    _cache: Map<string | number, unknown>;
}) => Promise<number[]>;
export declare const addAlphaToHex: (hex: string, alphaPercentage: number) => string;
export declare const isEditable: (mode: Mode, schema: Schema) => boolean;
export declare const hex2RgbColor: (hexString: string | undefined) => import("@pdfme/pdf-lib").RGB | undefined;
export declare const hex2PrintingColor: (color?: string | Color, colorType?: ColorType) => Color | undefined;
export declare const readFile: (input: File | FileList | null) => Promise<string | ArrayBuffer>;
export declare const createErrorElm: () => HTMLDivElement;
export declare const createSvgStr: (icon: IconNode, attrs?: Record<string, string>) => string;
