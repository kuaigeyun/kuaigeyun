import type { TableProps as RcTableProps } from '@rc-component/table';
import type { SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import type { AnyObject } from '../_util/type';
import type { SizeType } from '../config-provider/SizeContext';
import type { SemanticName as PaginationSemanticType } from '../pagination/Pagination';
import type { SpinProps } from '../spin';
import type { ColumnsType, FilterValue, GetPopupContainer, RefInternalTable, SorterResult, SorterTooltipProps, SortOrder, TableCurrentDataSource, TableLocale, TablePaginationConfig, TableRowSelection } from './interface';
export type { ColumnsType, TablePaginationConfig };
export type TableSemanticName = 'section' | 'title' | 'footer' | 'content' | 'root';
export type ComponentsSemantic = 'wrapper' | 'cell' | 'row';
export type TableClassNamesType<RecordType = AnyObject> = SemanticClassNamesType<TableProps<RecordType>, TableSemanticName, {
    body?: SemanticClassNames<ComponentsSemantic>;
    header?: SemanticClassNames<ComponentsSemantic>;
    pagination?: SemanticClassNames<PaginationSemanticType>;
}>;
export type TableStylesType<RecordType = AnyObject> = SemanticStylesType<TableProps<RecordType>, TableSemanticName, {
    body?: SemanticStyles<ComponentsSemantic>;
    header?: SemanticStyles<ComponentsSemantic>;
    pagination?: SemanticStyles<PaginationSemanticType>;
}>;
export interface TableProps<RecordType = AnyObject> extends Omit<RcTableProps<RecordType>, 'transformColumns' | 'internalHooks' | 'internalRefs' | 'data' | 'columns' | 'scroll' | 'emptyText' | 'classNames' | 'styles'> {
    classNames?: TableClassNamesType<RecordType>;
    styles?: TableStylesType<RecordType>;
    dropdownPrefixCls?: string;
    dataSource?: RcTableProps<RecordType>['data'];
    columns?: ColumnsType<RecordType>;
    pagination?: false | TablePaginationConfig;
    loading?: boolean | SpinProps;
    size?: SizeType;
    bordered?: boolean;
    locale?: TableLocale;
    rootClassName?: string;
    onChange?: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
    rowSelection?: TableRowSelection<RecordType>;
    getPopupContainer?: GetPopupContainer;
    scroll?: RcTableProps<RecordType>['scroll'] & {
        scrollToFirstRowOnChange?: boolean;
    };
    sortDirections?: SortOrder[];
    showSorterTooltip?: boolean | SorterTooltipProps;
    virtual?: boolean;
}
/** Same as `TableProps` but we need record parent render times */
export interface InternalTableProps<RecordType = AnyObject> extends TableProps<RecordType> {
    _renderTimes: number;
}
declare const _default_1: RefInternalTable;
export default _default_1;
