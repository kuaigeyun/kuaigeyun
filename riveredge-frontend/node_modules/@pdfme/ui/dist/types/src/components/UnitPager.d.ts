import React from 'react';
import { Size } from '@pdfme/common';
type Props = {
    size: Size;
    unitCursor: number;
    unitNum: number;
    setUnitCursor: (page: number) => void;
};
declare const UnitPager: ({ size, unitCursor, unitNum, setUnitCursor }: Props) => React.JSX.Element | null;
export default UnitPager;
