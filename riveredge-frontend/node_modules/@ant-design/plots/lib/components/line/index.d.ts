import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { LineOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type LineConfig = CommonConfig<LineOptions>;
declare const LineChart: ForwardRefExoticComponent<PropsWithoutRef<LineConfig> & RefAttributes<Chart>>;
export default LineChart;
