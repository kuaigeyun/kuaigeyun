import * as React from 'react';
import type { BaseSelectRef } from '@rc-component/select';
import type { TreeSelectProps as RcTreeSelectProps } from '@rc-component/tree-select';
import { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode } from '@rc-component/tree-select';
import type { DataNode } from '@rc-component/tree-select/lib/interface';
import type { SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import type { SelectCommonPlacement } from '../_util/motion';
import type { InputStatus } from '../_util/statusUtils';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import type { TreeProps } from '../tree';
import type { SwitcherIcon } from '../tree/Tree';
type RawValue = string | number;
export interface LabeledValue {
    key?: string;
    value: RawValue;
    label: React.ReactNode;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];
type SemanticName = 'root' | 'prefix' | 'input' | 'suffix' | 'content' | 'placeholder' | 'item' | 'itemContent' | 'itemRemove';
type PopupSemantic = 'item' | 'itemTitle' | 'root';
export type TreeSelectClassNamesType = SemanticClassNamesType<TreeSelectProps, SemanticName> & {
    popup?: SemanticClassNames<PopupSemantic>;
};
export type TreeSelectStylesType = SemanticStylesType<TreeSelectProps, SemanticName> & {
    popup?: SemanticStyles<PopupSemantic>;
};
interface BaseTreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode> extends React.AriaAttributes, Omit<RcTreeSelectProps<ValueType, OptionType>, 'showTreeIcon' | 'treeMotion' | 'mode' | 'getInputElement' | 'backfill' | 'treeLine' | 'switcherIcon' | 'classNames' | 'styles'> {
    size?: SizeType;
    disabled?: boolean;
    status?: InputStatus;
    variant?: Variant;
}
export interface TreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode> extends BaseTreeSelectProps<ValueType, OptionType> {
    styles?: TreeSelectStylesType;
    classNames?: TreeSelectClassNamesType;
    suffixIcon?: React.ReactNode;
    size?: SizeType;
    disabled?: boolean;
    placement?: SelectCommonPlacement;
    /** @deprecated Please use `classNames.popup.root` instead */
    popupClassName?: string;
    /** @deprecated Please use `classNames.popup.root` instead */
    dropdownClassName?: string;
    /** @deprecated Please use `popupRender` instead */
    dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
    popupRender?: (menu: React.ReactElement) => React.ReactElement;
    /** @deprecated Please use `styles.popup.root` instead */
    dropdownStyle?: React.CSSProperties;
    /** @deprecated Please use `onOpenChange` instead */
    onDropdownVisibleChange?: (visible: boolean) => void;
    onOpenChange?: (open: boolean) => void;
    /** @deprecated Use `variant` instead. */
    bordered?: boolean;
    treeLine?: TreeProps['showLine'];
    status?: InputStatus;
    switcherIcon?: SwitcherIcon | RcTreeSelectProps<ValueType, OptionType>['switcherIcon'];
    rootClassName?: string;
    /** @deprecated Please use `popupMatchSelectWidth` instead */
    dropdownMatchSelectWidth?: boolean | number;
    popupMatchSelectWidth?: boolean | number;
    /**
     * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
     *   default behavior, you can hide it by setting `suffixIcon` to null.
     */
    showArrow?: boolean;
    /**
     * @since 5.13.0
     * @default "outlined"
     */
    variant?: Variant;
}
declare const TreeSelectRef: <ValueType = any, OptionType extends DataNode = DataNode>(props: React.PropsWithChildren<TreeSelectProps<ValueType, OptionType>> & React.RefAttributes<BaseSelectRef>) => React.ReactElement;
type InternalTreeSelectType = typeof TreeSelectRef;
type CompoundedComponent = InternalTreeSelectType & {
    displayName?: string;
    TreeNode: typeof TreeNode;
    SHOW_ALL: typeof SHOW_ALL;
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const TreeSelect: CompoundedComponent;
declare const PurePanel: (props: import("../_util/type").AnyObject) => React.JSX.Element;
export { TreeNode };
export default TreeSelect;
