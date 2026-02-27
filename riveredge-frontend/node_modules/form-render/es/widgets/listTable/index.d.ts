import React from 'react';
import type { FormListFieldData } from 'antd';
import './index.less';
interface ListTableProps {
    fields: FormListFieldData[];
    schema: any;
    delConfirmProps: any;
    renderCore: any;
    rootPath: any;
    hideEmptyTable?: boolean;
    [key: string]: any;
}
declare const TableList: React.FC<ListTableProps>;
export default TableList;
