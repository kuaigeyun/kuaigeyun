import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { LiquidOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type LiquidConfig = CommonConfig<LiquidOptions>;
declare const LiquidChart: ForwardRefExoticComponent<PropsWithoutRef<LiquidConfig> & RefAttributes<Chart>>;
export default LiquidChart;
