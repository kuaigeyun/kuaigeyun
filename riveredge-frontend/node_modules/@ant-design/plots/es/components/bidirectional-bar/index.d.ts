import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { BidirectionalBarOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type BidirectionalBarConfig = CommonConfig<BidirectionalBarOptions>;
declare const BidirectionalBarChart: ForwardRefExoticComponent<PropsWithoutRef<BidirectionalBarConfig> & RefAttributes<Chart>>;
export default BidirectionalBarChart;
