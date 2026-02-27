import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { TinyLineOptions } from '../../../core';
import type { Chart, CommonConfig } from '../../../interface';
export type TinyLineConfig = CommonConfig<TinyLineOptions>;
declare const TinyLineChart: ForwardRefExoticComponent<PropsWithoutRef<TinyLineConfig> & RefAttributes<Chart>>;
export default TinyLineChart;
