import { InjectOptions } from "./types";
export declare function getHash(str: string): string;
export declare function getShadowRoot(parentElement: HTMLElement | SVGElement): ShadowRoot;
export declare function replaceStyle(className: string, css: string, options: Partial<InjectOptions>): string;
export declare function injectStyle(className: string, css: string, options: Partial<InjectOptions>, el: Node, shadowRoot?: Node): HTMLStyleElement;
