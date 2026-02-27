import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { WaterfallOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type WaterfallConfig = CommonConfig<WaterfallOptions>;
declare const WaterfallChart: ForwardRefExoticComponent<PropsWithoutRef<WaterfallConfig> & RefAttributes<Chart>>;
export default WaterfallChart;
