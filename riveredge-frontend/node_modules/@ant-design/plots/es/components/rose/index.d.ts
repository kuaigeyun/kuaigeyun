import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { RoseOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type RoseConfig = CommonConfig<RoseOptions>;
declare const RoseChart: ForwardRefExoticComponent<PropsWithoutRef<RoseConfig> & RefAttributes<Chart>>;
export default RoseChart;
