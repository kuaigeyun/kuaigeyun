import * as React from 'react';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
export interface ItemProps {
    className: string;
    children: React.ReactNode;
    prefix: string;
    index: number;
    separator?: React.ReactNode;
    style?: React.CSSProperties;
    classNames: SemanticClassNames<'separator'>;
    styles: SemanticStyles<'separator'>;
}
declare const Item: React.FC<ItemProps>;
export default Item;
