
/**
 * @typedef
 */
export interface IArrayFormat<T> {
  length: number;
  [index: number]: T;
}
/**
 * @typedef
 */
export interface IObject<T> {
  [name: string]: T;
}
/**
 * @typedef
 */
export interface IEventMap extends ElementEventMap,
  HTMLElementEventMap, SVGElementEventMap, HTMLMediaElementEventMap, HTMLBodyElementEventMap {
  [name: string]: Event;
}
/**
 * @typedef
 */
export interface OpenCloseCharacter {
  open: string;
  close: string;
  ignore?: RegExp;
}

export interface SplitOptions {
  separator?: string;
  isSeparateFirst?: boolean;
  isSeparateOnlyOpenClose?: boolean,
  isSeparateOpenClose?: boolean,
  openCloseCharacters?: OpenCloseCharacter[],
}

/**
 * @typedef
 */
export type FlattedElement<T> = T extends any[] ? never : T;
