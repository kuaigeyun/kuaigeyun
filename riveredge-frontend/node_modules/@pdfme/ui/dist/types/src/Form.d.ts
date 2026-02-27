import { PreviewProps } from '@pdfme/common';
import { PreviewUI } from './class.js';
declare class Form extends PreviewUI {
    private onChangeInputCallback?;
    private onPageChangeCallback?;
    private pageCursor;
    constructor(props: PreviewProps);
    onChangeInput(cb: (arg: {
        index: number;
        value: string;
        name: string;
    }) => void): void;
    onPageChange(cb: (pageInfo: {
        currentPage: number;
        totalPages: number;
    }) => void): void;
    getPageCursor(): number;
    getTotalPages(): number;
    setInputs(inputs: {
        [key: string]: string;
    }[]): void;
    protected render(): void;
}
export default Form;
