import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { SankeyOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type SankeyConfig = CommonConfig<SankeyOptions>;
declare const SankeyChart: ForwardRefExoticComponent<PropsWithoutRef<SankeyConfig> & RefAttributes<Chart>>;
export default SankeyChart;
