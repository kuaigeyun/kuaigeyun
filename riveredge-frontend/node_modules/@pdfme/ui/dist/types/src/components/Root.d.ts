import React, { ReactNode } from 'react';
import { Size } from '@pdfme/common';
type Props = {
    size: Size;
    scale: number;
    children: ReactNode;
};
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export default _default;
