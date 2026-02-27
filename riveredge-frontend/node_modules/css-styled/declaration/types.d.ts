export interface StyledInjector {
    className: string;
    inject(el: HTMLElement | SVGElement, options?: Partial<InjectOptions>): InjectResult;
}
export interface InjectOptions {
    original: boolean;
    nonce: string;
}
export interface InjectResult {
    destroy(): void;
}
