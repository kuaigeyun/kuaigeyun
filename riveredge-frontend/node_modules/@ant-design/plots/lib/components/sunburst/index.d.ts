import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { SunburstOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type SunburstConfig = CommonConfig<SunburstOptions>;
declare const SunburstChart: ForwardRefExoticComponent<PropsWithoutRef<SunburstConfig> & RefAttributes<Chart>>;
export default SunburstChart;
