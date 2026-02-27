import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Size } from '@pdfme/common';
interface Environment {
    getDocument: (pdf: ArrayBuffer | Uint8Array) => Promise<PDFDocumentProxy>;
}
export interface Pdf2SizeOptions {
    scale?: number;
}
export declare function pdf2size(pdf: ArrayBuffer | Uint8Array, options: Pdf2SizeOptions | undefined, env: Environment): Promise<Size[]>;
export {};
