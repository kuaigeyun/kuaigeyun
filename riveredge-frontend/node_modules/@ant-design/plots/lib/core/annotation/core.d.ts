import { CustomElement, Group } from '@antv/g';
import { Chart } from '@antv/g2';
import type { DisplayObjectConfig } from '@antv/g';
import type { GenericAnimation, AnimationResult } from './type';
export declare abstract class Annotation<T extends Record<string, any>> extends CustomElement<T> {
    chart: Chart;
    constructor(chart: Chart, config: DisplayObjectConfig<T>, defaultOptions: DisplayObjectConfig<T>);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback<Key extends keyof T>(name: Key): void;
    update(attr?: Partial<T>, animate?: GenericAnimation): void | import("@antv/g").IAnimation[];
    clear(): void;
    abstract render(attributes: Required<T>, container: Group, animate?: GenericAnimation): void | AnimationResult[];
    getElementsLayout(): any[];
    bindEvents(attributes: T, container: Group): void;
}
