import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { BulletOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type BulletConfig = CommonConfig<BulletOptions>;
declare const BulletChart: ForwardRefExoticComponent<PropsWithoutRef<BulletConfig> & RefAttributes<Chart>>;
export default BulletChart;
