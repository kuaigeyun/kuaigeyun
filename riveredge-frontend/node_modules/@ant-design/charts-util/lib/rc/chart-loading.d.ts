import React from 'react';
import { ContainerConfig } from '../types';
export interface ChartLoadingConfig extends Pick<ContainerConfig, 'loadingTemplate' | 'loading'> {
    /**
     * @title 主题
     * @description 配置主题颜色
     */
    theme?: string;
}
export declare const ChartLoading: ({ loadingTemplate, theme, loading }: ChartLoadingConfig) => React.JSX.Element;
