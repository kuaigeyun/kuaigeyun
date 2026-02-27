import { RGB, RGBA, HSL, HSLA } from "./consts";
import { splitBracket, splitComma } from "./utils";

/**
* @namespace
* @name Color
*/

/**
* Remove the # from the hex color.
* @memberof Color
* @param {} hex - hex color
* @return {} hex color
* @example
import {cutHex} from "@daybrush/utils";

console.log(cutHex("#000000")) // "000000"
*/
export function cutHex(hex: string) {
  return hex.replace("#", "");
}
/**
* convert hex color to rgb color.
* @memberof Color
* @param {} hex - hex color
* @return {} rgb color
* @example
import {hexToRGBA} from "@daybrush/utils";

console.log(hexToRGBA("#00000005"));
// [0, 0, 0, 1]
console.log(hexToRGBA("#201045"));
// [32, 16, 69, 1]
*/
export function hexToRGBA(hex: string): [number, number, number, number] {
  const h = cutHex(hex);
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  let a = parseInt(h.substring(6, 8), 16) / 255;

  if (isNaN(a)) {
    a = 1;
  }
  return [r, g, b, a];
}

/**
* convert 3(or 4)-digit hex color to 6(or 8)-digit hex color.
* @memberof Color
* @param {} hex - 3(or 4)-digit hex color
* @return {} 6(or 8)-digit hex color
* @example
import {toFullHex} from "@daybrush/utils";

console.log(toFullHex("#123")); // "#112233"
console.log(toFullHex("#123a")); // "#112233aa"
*/
export function toFullHex(h: string): string {
  const r = h.charAt(1);
  const g = h.charAt(2);
  const b = h.charAt(3);
  const a = h.charAt(4);
  const arr = ["#", r, r, g, g, b, b, a, a];

  return arr.join("");
}
/**
* convert hsl color to rgba color.
* @memberof Color
* @param {} hsl - hsl color(hue: 0 ~ 360, saturation: 0 ~ 1, lightness: 0 ~ 1, alpha: 0 ~ 1)
* @return {} rgba color
* @example
import {hslToRGBA} from "@daybrush/utils";

console.log(hslToRGBA([150, 0.5, 0.4]));
// [51, 153, 102, 1]
*/
export function hslToRGBA(hsl: readonly [number, number, number, number?]): [number, number, number, number] {
  let h = hsl[0];
  const s = hsl[1];
  const l = hsl[2];

  if (h < 0) {
    h +=  Math.floor((Math.abs(h) + 360) / 360) * 360;
  }
  h %= 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let rgb: [number, number, number];

  if (h < 60) {
    rgb = [c, x, 0];
  } else if (h < 120) {
    rgb = [x, c, 0];
  } else if (h < 180) {
    rgb = [0, c, x];
  } else if (h < 240) {
    rgb = [0, x, c];
  } else if (h < 300) {
    rgb = [x, 0, c];
  } else if (h < 360) {
    rgb = [c, 0, x];
  } else {
    rgb = [0, 0, 0];
  }

  return [
    Math.round((rgb[0] + m) * 255),
    Math.round((rgb[1] + m) * 255),
    Math.round((rgb[2] + m) * 255),
    hsl[3] ?? 1,
  ];
}
/**
* convert string to rgba color.
* @memberof Color
* @param {} - 3-hex(#000), 4-hex(#0000) 6-hex(#000000), 8-hex(#00000000) or RGB(A), or HSL(A)
* @return {} rgba color
* @example
import {stringToRGBA} from "@daybrush/utils";

console.log(stringToRGBA("#000000")); // [0, 0, 0, 1]
console.log(stringToRGBA("rgb(100, 100, 100)")); // [100, 100, 100, 1]
console.log(stringToRGBA("hsl(150, 0.5, 0.4)")); // [51, 153, 102, 1]
*/
export function stringToRGBA(color: string): [number, number, number, number] {
  if (color.charAt(0) === "#") {
    if (color.length === 4 || color.length === 5) {
      return hexToRGBA(toFullHex(color));
    } else {
      return hexToRGBA(color);
    }
  } else if (color.indexOf("(") !== -1) {
    // in bracket.
    const {prefix, value} = splitBracket(color);

    if (!prefix || !value) {
      return undefined as never;
    }
    const arr = splitComma(value);
    const colorArr: [number, number, number, number] = [0, 0, 0, 1];
    const length = arr.length;

    switch (prefix) {
      case RGB:
      case RGBA:
        for (let i = 0; i < length; ++i) {
          colorArr[i] = parseFloat(arr[i]);
        }
        return colorArr;
      case HSL:
      case HSLA:
        for (let i = 0; i < length; ++i) {
          if (arr[i].indexOf("%") !== -1) {
            colorArr[i] = parseFloat(arr[i]) / 100;
          } else {
            colorArr[i] = parseFloat(arr[i]);
          }
        }
        // hsl, hsla to rgba
        return hslToRGBA(colorArr);
    }
  }
  return undefined as never;
}
