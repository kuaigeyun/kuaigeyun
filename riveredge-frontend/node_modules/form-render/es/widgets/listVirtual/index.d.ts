import React from 'react';
import type { FormListFieldData } from 'antd';
import './index.less';
interface ListVirtualProps {
    fields: FormListFieldData[];
    schema: any;
    delConfirmProps: any;
    renderCore: any;
    rootPath: any;
    hideEmptyTable?: boolean;
    [key: string]: any;
}
declare const VirtualList: React.FC<ListVirtualProps>;
export default VirtualList;
