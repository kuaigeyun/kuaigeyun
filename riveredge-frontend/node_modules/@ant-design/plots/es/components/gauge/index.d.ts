import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { GaugeOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type GaugeConfig = CommonConfig<GaugeOptions>;
declare const GaugeChart: ForwardRefExoticComponent<PropsWithoutRef<GaugeConfig> & RefAttributes<Chart>>;
export default GaugeChart;
