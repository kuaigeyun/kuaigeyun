export declare function getFocusNodeList(node: HTMLElement, includePositive?: boolean): HTMLElement[];
/** @deprecated Do not use since this may failed when used in async */
export declare function saveLastFocusNode(): void;
/** @deprecated Do not use since this may failed when used in async */
export declare function clearLastFocusNode(): void;
/** @deprecated Do not use since this may failed when used in async */
export declare function backLastFocusNode(): void;
export declare function limitTabRange(node: HTMLElement, e: KeyboardEvent): void;
export interface InputFocusOptions extends FocusOptions {
    cursor?: 'start' | 'end' | 'all';
}
/**
 * Focus element and set cursor position for input/textarea elements.
 */
export declare function triggerFocus(element?: HTMLElement, option?: InputFocusOptions): void;
