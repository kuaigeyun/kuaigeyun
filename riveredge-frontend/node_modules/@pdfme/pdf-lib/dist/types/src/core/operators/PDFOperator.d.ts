import PDFArray from '../objects/PDFArray';
import PDFHexString from '../objects/PDFHexString';
import PDFName from '../objects/PDFName';
import PDFNumber from '../objects/PDFNumber';
import PDFString from '../objects/PDFString';
import PDFOperatorNames from './PDFOperatorNames';
import PDFContext from '../PDFContext';
export type PDFOperatorArg = string | PDFName | PDFArray | PDFNumber | PDFString | PDFHexString;
declare class PDFOperator {
    static of: (name: PDFOperatorNames, args?: PDFOperatorArg[]) => PDFOperator;
    private readonly name;
    private readonly args;
    private constructor();
    clone(context?: PDFContext): PDFOperator;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(buffer: Uint8Array, offset: number): number;
}
export default PDFOperator;
