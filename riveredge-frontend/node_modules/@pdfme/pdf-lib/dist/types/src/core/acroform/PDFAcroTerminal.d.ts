import PDFDict from '../objects/PDFDict';
import PDFName from '../objects/PDFName';
import PDFRef from '../objects/PDFRef';
import PDFAcroField from './PDFAcroField';
import PDFWidgetAnnotation from '../annotation/PDFWidgetAnnotation';
declare class PDFAcroTerminal extends PDFAcroField {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroTerminal;
    FT(): PDFName;
    getWidgets(): PDFWidgetAnnotation[];
    addWidget(ref: PDFRef): void;
    removeWidget(idx: number): void;
    normalizedEntries(): {
        Kids: import("..").PDFArray;
    };
}
export default PDFAcroTerminal;
