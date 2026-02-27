import React from 'react';
import { UIRenderProps, SchemaForUI, BasePdf, Schema } from '@pdfme/common';
type RendererProps = Omit<UIRenderProps<Schema>, 'schema' | 'rootElement' | 'options' | 'theme' | 'i18n' | '_cache'> & {
    basePdf: BasePdf;
    schema: SchemaForUI;
    value: string;
    outline: string;
    onChangeHoveringSchemaId?: (id: string | null) => void;
    scale: number;
    selectable?: boolean;
};
declare const Renderer: (props: RendererProps) => React.JSX.Element;
export default Renderer;
