import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { CirclePackingOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type CirclePackingConfig = CommonConfig<CirclePackingOptions>;
declare const CirclePackingChart: ForwardRefExoticComponent<PropsWithoutRef<CirclePackingConfig> & RefAttributes<Chart>>;
export default CirclePackingChart;
