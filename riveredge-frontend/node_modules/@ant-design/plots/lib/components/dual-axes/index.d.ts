import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { DualAxesOptions } from '../../core';
import { Chart, CommonConfig } from '../../interface';
export type DualAxesConfig = CommonConfig<DualAxesOptions>;
declare const DualAxesChart: ForwardRefExoticComponent<PropsWithoutRef<DualAxesConfig> & RefAttributes<Chart>>;
export default DualAxesChart;
