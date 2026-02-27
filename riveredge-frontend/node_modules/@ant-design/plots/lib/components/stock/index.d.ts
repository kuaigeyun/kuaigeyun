import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { StockOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type StockConfig = CommonConfig<StockOptions>;
declare const StockChart: ForwardRefExoticComponent<PropsWithoutRef<StockConfig> & RefAttributes<Chart>>;
export default StockChart;
