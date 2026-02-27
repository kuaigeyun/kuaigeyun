import React from 'react';
import { PreviewProps, Size } from '@pdfme/common';
declare const Preview: ({ template, inputs, size, onChangeInput, onPageChange, }: Omit<PreviewProps, "domContainer"> & {
    onChangeInput?: (args: {
        index: number;
        value: string;
        name: string;
    }) => void;
    onPageChange?: (pageInfo: {
        currentPage: number;
        totalPages: number;
    }) => void;
    size: Size;
}) => React.JSX.Element;
export default Preview;
