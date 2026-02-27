import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { HistogramOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type HistogramConfig = CommonConfig<HistogramOptions>;
declare const HistogramChart: ForwardRefExoticComponent<PropsWithoutRef<HistogramConfig> & RefAttributes<Chart>>;
export default HistogramChart;
