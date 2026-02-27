import React from 'react';
import type { PropPanelWidgetProps } from '@pdfme/common';
type Props = PropPanelWidgetProps & {
    widget: (props: PropPanelWidgetProps) => void;
};
declare const WidgetRenderer: (props: Props) => React.JSX.Element;
export default WidgetRenderer;
