import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { HeatmapOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type HeatmapConfig = CommonConfig<HeatmapOptions>;
declare const HeatmapChart: ForwardRefExoticComponent<PropsWithoutRef<HeatmapConfig> & RefAttributes<Chart>>;
export default HeatmapChart;
