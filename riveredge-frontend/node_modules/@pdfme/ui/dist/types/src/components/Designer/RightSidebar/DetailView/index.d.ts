import React from 'react';
import type { SchemaForUI } from '@pdfme/common';
import type { SidebarProps } from '../../../../types.js';
type DetailViewProps = Pick<SidebarProps, 'size' | 'schemas' | 'schemasList' | 'pageSize' | 'basePdf' | 'changeSchemas' | 'activeElements' | 'deselectSchema'> & {
    activeSchema: SchemaForUI;
};
declare const _default: React.MemoExoticComponent<(props: DetailViewProps) => React.JSX.Element>;
export default _default;
