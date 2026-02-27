import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { ImageType } from './types.js';
interface Environment {
    getDocument: (pdf: ArrayBuffer | Uint8Array) => Promise<PDFDocumentProxy>;
    createCanvas: (width: number, height: number) => HTMLCanvasElement | OffscreenCanvas;
    canvasToArrayBuffer: (canvas: HTMLCanvasElement | OffscreenCanvas, imageType: ImageType) => ArrayBuffer;
}
export interface Pdf2ImgOptions {
    scale?: number;
    imageType?: ImageType;
    range?: {
        start?: number;
        end?: number;
    };
}
export declare function pdf2img(pdf: ArrayBuffer | Uint8Array, options: Pdf2ImgOptions | undefined, env: Environment): Promise<ArrayBuffer[]>;
export {};
