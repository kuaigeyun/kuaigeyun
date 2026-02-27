import React, { MutableRefObject, ReactNode } from 'react';
import { SchemaForUI, Size } from '@pdfme/common';
declare const Paper: (props: {
    paperRefs: MutableRefObject<HTMLDivElement[]>;
    scale: number;
    size: Size;
    schemasList: SchemaForUI[][];
    pageSizes: Size[];
    backgrounds: string[];
    renderPaper: (arg: {
        index: number;
        paperSize: Size;
    }) => ReactNode;
    renderSchema: (arg: {
        index: number;
        schema: SchemaForUI;
    }) => ReactNode;
    hasRulers?: boolean;
}) => React.JSX.Element | null;
export default Paper;
