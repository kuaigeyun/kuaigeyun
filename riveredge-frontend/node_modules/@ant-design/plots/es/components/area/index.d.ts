import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { AreaOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type AreaConfig = CommonConfig<AreaOptions>;
declare const AreaChart: ForwardRefExoticComponent<PropsWithoutRef<AreaConfig> & RefAttributes<Chart>>;
export default AreaChart;
