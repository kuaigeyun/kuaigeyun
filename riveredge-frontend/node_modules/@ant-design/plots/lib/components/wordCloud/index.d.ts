import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { WordCloudOptions } from '../../core';
import type { Chart, CommonConfig } from '../../interface';
export type WordCloudConfig = CommonConfig<WordCloudOptions>;
declare const WordCloudChart: ForwardRefExoticComponent<PropsWithoutRef<WordCloudConfig> & RefAttributes<Chart>>;
export default WordCloudChart;
