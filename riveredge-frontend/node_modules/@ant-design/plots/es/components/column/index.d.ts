import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { ColumnOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type ColumnConfig = CommonConfig<ColumnOptions>;
declare const ColumnChart: ForwardRefExoticComponent<PropsWithoutRef<ColumnConfig> & RefAttributes<Chart>>;
export default ColumnChart;
