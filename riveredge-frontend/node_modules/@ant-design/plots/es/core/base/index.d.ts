import EE from '@antv/event-emitter';
import { Controller as Annotation } from '../annotation';
import type { G2Chart } from './chart';
import type { Adaptor, Options } from '../types';
type PickOptions = Pick<Options, 'autoFit' | 'width' | 'height'>;
export declare abstract class Plot<O extends PickOptions> extends EE {
    /** plot 类型名称 */
    abstract readonly type: string;
    /** plot 绘制的 dom */
    readonly container: HTMLElement;
    /** G2 Spec */
    options: O;
    /** G2 chart 实例 */
    chart: G2Chart;
    annotation: Annotation<O>;
    private eventListeners;
    private bindedEvents;
    constructor(container: string | HTMLElement, options: O);
    /**
     * new Chart 所需配置
     */
    private getChartOptions;
    /**
     * G2 options(Spec) 配置
     */
    private getSpecOptions;
    /**
     * 创建 G2 实例
     */
    private createG2;
    /**
     * 绑定代理所有 G2 的事件
     */
    private bindEvents;
    private getBaseOptions;
    /**
     * 获取默认的 options 配置项，每个组件都可以复写
     */
    protected getDefaultOptions(): any;
    /**
     * 绘制
     */
    render(): void;
    /**
     * 更新
     * @param options
     */
    update(options: Partial<O>): void;
    protected mergeOption(options: Partial<O>): any;
    /**
     * 更新数据
     * @override
     * @param options
     */
    changeData(data: any): void;
    /**
     * 修改画布大小
     * @param width
     * @param height
     */
    changeSize(width: number, height: number): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 每个组件有自己的 schema adaptor
     */
    protected abstract getSchemaAdaptor(): (params: Adaptor<O>) => void;
    /**
     * 执行 adaptor 操作
     */
    protected execAdaptor(): void;
    /**
     * 当图表容器大小变化的时候，执行的函数
     */
    protected triggerResize(): void;
    /**
     * 绑定 dom 容器大小变化的事件
     */
    private bindSizeSensor;
}
export {};
