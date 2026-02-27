import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { TreemapOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type TreemapConfig = CommonConfig<TreemapOptions>;
declare const TreemapChart: ForwardRefExoticComponent<PropsWithoutRef<TreemapConfig> & RefAttributes<Chart>>;
export default TreemapChart;
