import React from 'react';
import { Size } from '@pdfme/common';
type CtlBarProps = {
    size: Size;
    pageCursor: number;
    pageNum: number;
    setPageCursor: (page: number) => void;
    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;
    addPageAfter?: () => void;
    removePage?: () => void;
};
declare const CtlBar: (props: CtlBarProps) => React.JSX.Element;
export default CtlBar;
