import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { Chart } from '../interface';
export declare function makeChartComp<C>(chartType: string): ForwardRefExoticComponent<PropsWithoutRef<C> & RefAttributes<Chart>>;
