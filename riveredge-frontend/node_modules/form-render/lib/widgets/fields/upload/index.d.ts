import React from 'react';
import { ButtonProps } from 'antd/es/button';
import './index.less';
interface Props {
    action: any;
    value: string;
    onChange: any;
    uploadProps: any;
    buttonProps: ButtonProps;
    schema: any;
}
declare const FrUpload: ({ action, value, onChange, uploadProps, buttonProps, schema, }: Props) => React.JSX.Element;
export default FrUpload;
