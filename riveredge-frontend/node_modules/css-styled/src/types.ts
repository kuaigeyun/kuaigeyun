/**
 * @typedef
 * @property - Unique class name of the corresponding css
 * @property - Insert css into the document owned by the target element.
 */
export interface StyledInjector {
    className: string;
    inject(el: HTMLElement | SVGElement, options?: Partial<InjectOptions>): InjectResult;
}
/**
 * @typedef
 * @property - Whether to put the unique class name of css or show it as original
 * @property - csp nonce id
 */
export interface InjectOptions {
    original: boolean;
    nonce: string;
}

/**
 * @typedef
 * @property - Remove css.
 */
export interface InjectResult {
    destroy(): void;
}
