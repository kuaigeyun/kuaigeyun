/**
* @namespace
* @name Consts
*/

import { IObject, OpenCloseCharacter } from "./types";

/**
* get string "rgb"
* @memberof Color
* @example
import {RGB} from "@daybrush/utils";

console.log(RGB); // "rgb"
*/
export const RGB = "rgb";
/**
* get string "rgba"
* @memberof Color
* @example
import {RGBA} from "@daybrush/utils";

console.log(RGBA); // "rgba"
*/
export const RGBA = "rgba";
/**
* get string "hsl"
* @memberof Color
* @example
import {HSL} from "@daybrush/utils";

console.log(HSL); // "hsl"
*/
export const HSL = "hsl";
/**
* get string "hsla"
* @memberof Color
* @example
import {HSLA} from "@daybrush/utils";

console.log(HSLA); // "hsla"
*/
export const HSLA = "hsla";
/**
* gets an array of color models.
* @memberof Color
* @example
import {COLOR_MODELS} from "@daybrush/utils";

console.log(COLOR_MODELS); // ["rgb", "rgba", "hsl", "hsla"];
*/
export const COLOR_MODELS = [RGB, RGBA, HSL, HSLA];

/**
* get string "function"
* @memberof Consts
* @example
import {FUNCTION} from "@daybrush/utils";

console.log(FUNCTION); // "function"
*/
export const FUNCTION = "function";
/**
* get string "property"
* @memberof Consts
* @example
import {PROPERTY} from "@daybrush/utils";

console.log(PROPERTY); // "property"
*/
export const PROPERTY = "property";
/**
* get string "array"
* @memberof Consts
* @example
import {ARRAY} from "@daybrush/utils";

console.log(ARRAY); // "array"
*/
export const ARRAY = "array";
/**
* get string "object"
* @memberof Consts
* @example
import {OBJECT} from "@daybrush/utils";

console.log(OBJECT); // "object"
*/
export const OBJECT = "object";
/**
* get string "string"
* @memberof Consts
* @example
import {STRING} from "@daybrush/utils";

console.log(STRING); // "string"
*/
export const STRING = "string";
/**
* get string "number"
* @memberof Consts
* @example
import {NUMBER} from "@daybrush/utils";

console.log(NUMBER); // "number"
*/
export const NUMBER = "number";
/**
* get string "undefined"
* @memberof Consts
* @example
import {UNDEFINED} from "@daybrush/utils";

console.log(UNDEFINED); // "undefined"
*/
export const UNDEFINED = "undefined";

/**
* Check whether the environment is window or node.js.
* @memberof Consts
* @example
import {IS_WINDOW} from "@daybrush/utils";

console.log(IS_WINDOW); // false in node.js
console.log(IS_WINDOW); // true in browser
*/
export const IS_WINDOW = typeof window !== UNDEFINED;

/**
* Check whether the environment is window or node.js.
* @memberof Consts
* @name document
* @example
import {IS_WINDOW} from "@daybrush/utils";

console.log(IS_WINDOW); // false in node.js
console.log(IS_WINDOW); // true in browser
*/
const doc = (typeof document !== UNDEFINED && document) as Document; // FIXME: this type maybe false

export {doc as document};

const prefixes: string[] = ["webkit", "ms", "moz", "o"];

/**
 * @namespace CrossBrowser
 */

/**
* Get a CSS property with a vendor prefix that supports cross browser.
* @function
* @param {string} property - A CSS property
* @return {string} CSS property with cross-browser vendor prefix
* @memberof CrossBrowser
* @example
import {getCrossBrowserProperty} from "@daybrush/utils";

console.log(getCrossBrowserProperty("transform")); // "transform", "-ms-transform", "-webkit-transform"
console.log(getCrossBrowserProperty("filter")); // "filter", "-webkit-filter"
*/
export const getCrossBrowserProperty =  /*#__PURE__*/(property: string) => {
  if (!doc) {
    return "";
  }
  const styles = (doc.body || doc.documentElement).style as any;
  const length = prefixes.length;

  if (typeof styles[property] !== UNDEFINED) {
    return property;
  }
  for (let i = 0; i < length; ++i) {
    const name = `-${prefixes[i]}-${property}`;

    if (typeof styles[name] !== UNDEFINED) {
      return name;
    }
  }
  return "";
};

/**
* get string "transfrom" with the vendor prefix.
* @memberof CrossBrowser
* @example
import {TRANSFORM} from "@daybrush/utils";

console.log(TRANSFORM); // "transform", "-ms-transform", "-webkit-transform"
*/
export const TRANSFORM = /*#__PURE__*/getCrossBrowserProperty("transform");
/**
* get string "filter" with the vendor prefix.
* @memberof CrossBrowser
* @example
import {FILTER} from "@daybrush/utils";

console.log(FILTER); // "filter", "-ms-filter", "-webkit-filter"
*/
export const FILTER = /*#__PURE__*/getCrossBrowserProperty("filter");
/**
* get string "animation" with the vendor prefix.
* @memberof CrossBrowser
* @example
import {ANIMATION} from "@daybrush/utils";

console.log(ANIMATION); // "animation", "-ms-animation", "-webkit-animation"
*/
export const ANIMATION = /*#__PURE__*/getCrossBrowserProperty("animation");
/**
* get string "keyframes" with the vendor prefix.
* @memberof CrossBrowser
* @example
import {KEYFRAMES} from "@daybrush/utils";

console.log(KEYFRAMES); // "keyframes", "-ms-keyframes", "-webkit-keyframes"
*/
export const KEYFRAMES = /*#__PURE__*/ANIMATION.replace("animation", "keyframes");

export const OPEN_CLOSED_CHARACTERS: OpenCloseCharacter[] = [
  { open: "(", close: ")" },
  { open: `"`, close: `"`},
  { open: `'`, close: `'`},
  { open: `\\"`, close: `\\"`},
  { open: `\\'`, close: `\\'`},
];
export const TINY_NUM = 0.0000001;
export const REVERSE_TINY_NUM = 1 / TINY_NUM;
export const DEFAULT_UNIT_PRESETS: IObject<(pos: number, size?: number) => number> = {
  "cm": pos => pos * 96 / 2.54,
  "mm": pos => pos * 96 / 254,
  "in": pos => pos * 96,
  "pt": pos => pos * 96 / 72,
  "pc": pos => pos * 96 / 6,
  "%": (pos, size) => pos * size! / 100,
  "vw": (pos, size = window.innerWidth) => pos / 100 * size,
  "vh": (pos, size = window.innerHeight) => pos / 100 * size,
  "vmax": (pos, size = Math.max(window.innerWidth, window.innerHeight)) => pos / 100 * size,
  "vmin": (pos, size = Math.min(window.innerWidth, window.innerHeight)) => pos / 100 * size,
};
