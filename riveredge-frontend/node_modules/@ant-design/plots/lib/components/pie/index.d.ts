import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { PieOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type PieConfig = CommonConfig<PieOptions>;
declare const PieChart: ForwardRefExoticComponent<PropsWithoutRef<PieConfig> & RefAttributes<Chart>>;
export default PieChart;
