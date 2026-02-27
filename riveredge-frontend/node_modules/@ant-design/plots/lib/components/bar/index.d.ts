import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { BarOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type BarConfig = CommonConfig<BarOptions>;
declare const BarChart: ForwardRefExoticComponent<PropsWithoutRef<BarConfig> & RefAttributes<Chart>>;
export default BarChart;
