import { Font } from '@pdfme/common';
export declare const getFont: () => Font;
export declare const pdfToImages: (pdf: ArrayBuffer | Uint8Array) => Promise<Buffer[]>;
