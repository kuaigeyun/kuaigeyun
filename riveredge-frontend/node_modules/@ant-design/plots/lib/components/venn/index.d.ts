import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { VennOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type VennConfig = CommonConfig<VennOptions>;
declare const VennChart: ForwardRefExoticComponent<PropsWithoutRef<VennConfig> & RefAttributes<Chart>>;
export default VennChart;
