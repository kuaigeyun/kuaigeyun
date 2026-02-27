import * as React from 'react';
export interface ProgressIconProps {
    prefixCls: string;
    children?: React.ReactNode;
    percent: number;
}
export default function ProgressIcon(props: ProgressIconProps): React.JSX.Element;
