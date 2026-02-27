export interface IArrayFormat<T> {
    length: number;
    [index: number]: T;
}
export interface IObject<T> {
    [name: string]: T;
}
export interface IEventMap extends ElementEventMap, HTMLElementEventMap, SVGElementEventMap, HTMLMediaElementEventMap, HTMLBodyElementEventMap {
    [name: string]: Event;
}
export interface OpenCloseCharacter {
    open: string;
    close: string;
    ignore?: RegExp;
}
export interface SplitOptions {
    separator?: string;
    isSeparateFirst?: boolean;
    isSeparateOnlyOpenClose?: boolean;
    isSeparateOpenClose?: boolean;
    openCloseCharacters?: OpenCloseCharacter[];
}
export declare type FlattedElement<T> = T extends any[] ? never : T;
