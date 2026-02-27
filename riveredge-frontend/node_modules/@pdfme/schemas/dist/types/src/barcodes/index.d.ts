import type { BarcodeSchema } from './types.js';
import { Plugin } from '@pdfme/common';
declare const barcodes: Record<"qrcode" | "japanpost" | "ean13" | "ean8" | "code39" | "code128" | "nw7" | "itf14" | "upca" | "upce" | "gs1datamatrix" | "pdf417", Plugin<BarcodeSchema>>;
export default barcodes;
