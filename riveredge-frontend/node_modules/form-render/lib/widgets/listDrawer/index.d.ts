import React from 'react';
import type { FormListFieldData, FormListOperation } from 'antd';
import './index.less';
interface Props {
    schema: any;
    fields: FormListFieldData[];
    operation: FormListOperation;
    prefix: string;
    [key: string]: any;
}
declare const TableList: React.FC<Props>;
export default TableList;
