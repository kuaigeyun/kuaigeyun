import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { ViolinOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type ViolinConfig = CommonConfig<ViolinOptions>;
declare const ViolinChart: ForwardRefExoticComponent<PropsWithoutRef<ViolinConfig> & RefAttributes<Chart>>;
export default ViolinChart;
