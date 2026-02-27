import type { useBaseProps } from '@rc-component/select';
import type { RefOptionListProps } from '@rc-component/select/lib/OptionList';
import * as React from 'react';
export type RawOptionListProps = Pick<ReturnType<typeof useBaseProps>, 'prefixCls' | 'multiple' | 'searchValue' | 'toggleOpen' | 'notFoundContent' | 'direction' | 'open' | 'disabled'>;
declare const RawOptionList: React.ForwardRefExoticComponent<RawOptionListProps & React.RefAttributes<RefOptionListProps>>;
export default RawOptionList;
