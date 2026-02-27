import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { RadarOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type RadarConfig = CommonConfig<RadarOptions>;
declare const RadarChart: ForwardRefExoticComponent<PropsWithoutRef<RadarConfig> & RefAttributes<Chart>>;
export default RadarChart;
