import React from 'react';
import type { FormListFieldData } from 'antd';
import './index.less';
interface ListTabProps {
    fields: FormListFieldData[];
    schema: any;
    delConfirmProps: any;
    renderCore: any;
    rootPath: any;
    [key: string]: any;
}
declare const TabList: React.FC<ListTabProps>;
export default TabList;
