import React from 'react';
import { Template } from '@pdfme/common';
declare const StaticSchema: (props: {
    template: Template;
    input: Record<string, string>;
    scale: number;
    totalPages: number;
    currentPage: number;
}) => React.JSX.Element | null;
export default StaticSchema;
