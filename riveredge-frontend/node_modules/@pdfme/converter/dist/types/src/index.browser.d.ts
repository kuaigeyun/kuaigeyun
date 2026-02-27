import { Pdf2ImgOptions } from './pdf2img.js';
import { Pdf2SizeOptions } from './pdf2size.js';
export declare const pdf2img: (pdf: ArrayBuffer | Uint8Array, options?: Pdf2ImgOptions) => Promise<ArrayBuffer[]>;
export declare const pdf2size: (pdf: ArrayBuffer | Uint8Array, options?: Pdf2SizeOptions) => Promise<{
    height: number;
    width: number;
}[]>;
export { img2pdf } from './img2pdf.js';
