import * as React from 'react';
import type { SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import type { ButtonSemanticName } from '../button/Button';
import type { InputProps, InputRef } from './Input';
type SemanticName = 'root' | 'input' | 'prefix' | 'suffix' | 'count';
export type InputSearchClassNamesType = SemanticClassNamesType<SearchProps, SemanticName> & {
    button?: SemanticClassNames<ButtonSemanticName>;
};
export type InputSearchStylesType = SemanticStylesType<SearchProps, SemanticName> & {
    button?: SemanticStyles<ButtonSemanticName>;
};
export interface SearchProps extends InputProps {
    inputPrefixCls?: string;
    onSearch?: (value: string, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>, info?: {
        source?: 'clear' | 'input';
    }) => void;
    enterButton?: React.ReactNode;
    loading?: boolean;
    onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    classNames?: InputSearchClassNamesType;
    styles?: InputSearchStylesType;
}
declare const Search: React.ForwardRefExoticComponent<SearchProps & React.RefAttributes<InputRef>>;
export default Search;
