import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { TinyRingOptions } from '../../../core';
import { Chart, CommonConfig } from '../../../interface';
export type TinyRingConfig = CommonConfig<TinyRingOptions>;
declare const TinyRingChart: ForwardRefExoticComponent<PropsWithoutRef<TinyRingConfig> & RefAttributes<Chart>>;
export default TinyRingChart;
