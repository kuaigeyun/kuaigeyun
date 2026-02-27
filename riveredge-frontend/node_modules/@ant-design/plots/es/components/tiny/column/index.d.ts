import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { TinyColumnOptions } from '../../../core';
import type { Chart, CommonConfig } from '../../../interface';
export type TinyColumnConfig = CommonConfig<TinyColumnOptions>;
declare const TinyLineChart: ForwardRefExoticComponent<PropsWithoutRef<TinyColumnConfig> & RefAttributes<Chart>>;
export default TinyLineChart;
