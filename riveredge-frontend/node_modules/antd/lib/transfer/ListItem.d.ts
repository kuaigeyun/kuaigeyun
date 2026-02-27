import * as React from 'react';
import type { KeyWiseTransferItem, SemanticName } from '.';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
type ListItemProps<RecordType> = {
    prefixCls: string;
    classNames: SemanticClassNames<SemanticName>;
    styles: SemanticStyles<SemanticName>;
    renderedText?: string | number;
    renderedEl: React.ReactNode;
    disabled?: boolean;
    checked?: boolean;
    onClick: (item: RecordType, e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    onRemove?: (item: RecordType) => void;
    item: RecordType;
    showRemove?: boolean;
};
declare const _default: React.MemoExoticComponent<(<RecordType extends KeyWiseTransferItem>(props: ListItemProps<RecordType>) => React.JSX.Element)>;
export default _default;
