import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { TinyAreaOptions } from '../../../core';
import type { Chart, CommonConfig } from '../../../interface';
export type TinyAreaConfig = CommonConfig<TinyAreaOptions>;
declare const TinyAreaChart: ForwardRefExoticComponent<PropsWithoutRef<TinyAreaConfig> & RefAttributes<Chart>>;
export default TinyAreaChart;
