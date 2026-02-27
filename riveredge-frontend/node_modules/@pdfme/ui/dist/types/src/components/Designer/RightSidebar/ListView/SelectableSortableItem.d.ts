import React from 'react';
import { SchemaForUI } from '@pdfme/common';
interface Props {
    isSelected: boolean;
    style?: React.CSSProperties;
    onSelect: (id: string, isShiftSelect: boolean) => void;
    onEdit: (id: string) => void;
    schema: SchemaForUI;
    schemas: SchemaForUI[];
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}
declare const SelectableSortableItem: ({ isSelected, style, onSelect, onEdit, schema, schemas, onMouseEnter, onMouseLeave, }: Props) => React.JSX.Element;
export default SelectableSortableItem;
