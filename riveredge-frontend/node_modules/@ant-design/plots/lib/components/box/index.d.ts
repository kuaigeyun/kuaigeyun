import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { BoxOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type BoxConfig = CommonConfig<BoxOptions>;
declare const BoxChart: ForwardRefExoticComponent<PropsWithoutRef<BoxConfig> & RefAttributes<Chart>>;
export default BoxChart;
