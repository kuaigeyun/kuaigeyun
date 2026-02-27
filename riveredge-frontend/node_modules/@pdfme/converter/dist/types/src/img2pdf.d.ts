import type { ImageType } from './types.js';
interface Img2PdfOptions {
    scale?: number;
    imageType?: ImageType;
    size?: {
        height: number;
        width: number;
    };
    margin?: [number, number, number, number];
}
export declare function img2pdf(imgs: ArrayBuffer[], options?: Img2PdfOptions): Promise<ArrayBuffer>;
export {};
