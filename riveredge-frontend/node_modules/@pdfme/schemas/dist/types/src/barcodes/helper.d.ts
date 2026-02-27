import { Buffer } from 'buffer';
import { BarcodeTypes } from './types.js';
export declare const validateBarcodeInput: (type: BarcodeTypes, input: string) => boolean;
/**
 * The bwip.js lib has a different name for nw7 type barcodes
 */
export declare const barCodeType2Bcid: (type: BarcodeTypes) => "qrcode" | "japanpost" | "ean13" | "ean8" | "code39" | "code128" | "itf14" | "upca" | "upce" | "gs1datamatrix" | "pdf417" | "rationalizedCodabar";
/**
 *  Strip hash from the beginning of HTML hex color codes for the bwip.js lib
 */
export declare const mapHexColorForBwipJsLib: (color: string | undefined, fallback?: string) => string;
export declare const createBarCode: (arg: {
    type: BarcodeTypes;
    input: string;
    width: number;
    height: number;
    backgroundColor?: string;
    barColor?: string;
    textColor?: string;
    includetext?: boolean;
}) => Promise<Buffer>;
