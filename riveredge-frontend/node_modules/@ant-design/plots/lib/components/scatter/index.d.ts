import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { ScatterOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type ScatterConfig = CommonConfig<ScatterOptions>;
declare const ScatterChart: ForwardRefExoticComponent<PropsWithoutRef<ScatterConfig> & RefAttributes<Chart>>;
export default ScatterChart;
