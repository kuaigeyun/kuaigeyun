import PDFDict from './PDFDict';
import PDFStream from './PDFStream';
import PDFContext from '../PDFContext';
import { CipherTransform } from '../crypto';
declare class PDFRawStream extends PDFStream {
    static of: (dict: PDFDict, contents: Uint8Array, transform?: CipherTransform) => PDFRawStream;
    readonly contents: Uint8Array;
    readonly transform?: CipherTransform;
    private constructor();
    asUint8Array(): Uint8Array;
    clone(context?: PDFContext): PDFRawStream;
    getContentsString(): string;
    getContents(): Uint8Array;
    getContentsSize(): number;
}
export default PDFRawStream;
