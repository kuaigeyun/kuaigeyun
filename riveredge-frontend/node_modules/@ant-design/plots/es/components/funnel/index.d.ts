import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { FunnelOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type FunnelConfig = CommonConfig<FunnelOptions>;
declare const FunnelChart: ForwardRefExoticComponent<PropsWithoutRef<FunnelConfig> & RefAttributes<Chart>>;
export default FunnelChart;
