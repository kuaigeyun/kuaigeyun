import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { RadialBarOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type RadialBarConfig = CommonConfig<RadialBarOptions>;
declare const RadialBar: ForwardRefExoticComponent<PropsWithoutRef<RadialBarConfig> & RefAttributes<Chart>>;
export default RadialBar;
