import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { TinyProgressOptions } from '../../../core';
import type { Chart, CommonConfig } from '../../../interface';
export type TinyProgressConfig = CommonConfig<TinyProgressOptions>;
declare const TinyProgressChart: ForwardRefExoticComponent<PropsWithoutRef<TinyProgressConfig> & RefAttributes<Chart>>;
export default TinyProgressChart;
