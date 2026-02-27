import { PreviewProps } from '@pdfme/common';
import { PreviewUI } from './class.js';
declare class Viewer extends PreviewUI {
    private onPageChangeCallback?;
    private pageCursor;
    constructor(props: PreviewProps);
    onPageChange(cb: (pageInfo: {
        currentPage: number;
        totalPages: number;
    }) => void): void;
    getPageCursor(): number;
    getTotalPages(): number;
    protected render(): void;
}
export default Viewer;
