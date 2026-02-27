import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { MixOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type MixConfig = CommonConfig<MixOptions>;
declare const MixChart: ForwardRefExoticComponent<PropsWithoutRef<MixConfig> & RefAttributes<Chart>>;
export default MixChart;
