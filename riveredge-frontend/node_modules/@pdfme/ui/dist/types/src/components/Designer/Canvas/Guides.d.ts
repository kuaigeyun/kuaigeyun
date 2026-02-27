import React, { Ref } from 'react';
import GuidesComponent from '@scena/react-guides';
import { Size } from '@pdfme/common';
declare const _Guides: ({ paperSize, horizontalRef, verticalRef, }: {
    paperSize: Size;
    horizontalRef: Ref<GuidesComponent> | undefined;
    verticalRef: Ref<GuidesComponent> | undefined;
}) => React.JSX.Element;
export default _Guides;
