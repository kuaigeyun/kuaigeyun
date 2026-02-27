import React, { MutableRefObject } from 'react';
import { SchemaForUI, Size, ChangeSchemas, BasePdf } from '@pdfme/common';
interface Props {
    basePdf: BasePdf;
    height: number;
    hoveringSchemaId: string | null;
    onChangeHoveringSchemaId: (id: string | null) => void;
    pageCursor: number;
    schemasList: SchemaForUI[][];
    scale: number;
    backgrounds: string[];
    pageSizes: Size[];
    size: Size;
    activeElements: HTMLElement[];
    onEdit: (targets: HTMLElement[]) => void;
    changeSchemas: ChangeSchemas;
    removeSchemas: (ids: string[]) => void;
    paperRefs: MutableRefObject<HTMLDivElement[]>;
    sidebarOpen: boolean;
}
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export default _default;
