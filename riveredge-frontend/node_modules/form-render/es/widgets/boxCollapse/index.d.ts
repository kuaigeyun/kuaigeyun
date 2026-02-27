import { FC } from 'react';
import './index.less';
interface IProps {
    className?: any;
    style?: object;
    children: any;
    title?: string;
    description?: any;
    collapsed?: boolean;
    displayType?: any;
    bordered?: boolean;
    ghost?: boolean;
}
/**
 * 折叠面板
 */
declare const BoxCollapse: FC<IProps>;
export default BoxCollapse;
