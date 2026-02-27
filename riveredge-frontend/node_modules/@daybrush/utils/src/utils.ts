import {
  UNDEFINED, STRING,
  OBJECT, FUNCTION,
  IS_WINDOW, OPEN_CLOSED_CHARACTERS, NUMBER,
  DEFAULT_UNIT_PRESETS,
  TINY_NUM
} from "./consts";
import {
  FlattedElement,
  IArrayFormat, IObject, OpenCloseCharacter,
  SplitOptions,
} from "./types";
/**
* @namespace
* @name Utils
*/

/**
 * Returns the inner product of two numbers(`a1`, `a2`) by two criteria(`b1`, `b2`).
 * @memberof Utils
 * @param - The first number
 * @param - The second number
 * @param - The first number to base on the inner product
 * @param - The second number to base on the inner product
 * @return - Returns the inner product
import { dot } from "@daybrush/utils";

console.log(dot(0, 15, 2, 3)); // 6
console.log(dot(5, 15, 2, 3)); // 9
console.log(dot(5, 15, 1, 1)); // 10
 */
export function dot(a1: number, a2: number, b1: number, b2: number) {
  return (a1 * b2 + a2 * b1) / (b1 + b2);
}
/**
* Check the type that the value is undefined.
* @memberof Utils
* @param {string} value - Value to check the type
* @return {boolean} true if the type is correct, false otherwise
* @example
import {isUndefined} from "@daybrush/utils";

console.log(isUndefined(undefined)); // true
console.log(isUndefined("")); // false
console.log(isUndefined(1)); // false
console.log(isUndefined(null)); // false
*/
export function isUndefined(value: any): value is undefined {
  return (typeof value === UNDEFINED);
}
/**
* Check the type that the value is object.
* @memberof Utils
* @param {string} value - Value to check the type
* @return {} true if the type is correct, false otherwise
* @example
import {isObject} from "@daybrush/utils";

console.log(isObject({})); // true
console.log(isObject(undefined)); // false
console.log(isObject("")); // false
console.log(isObject(null)); // false
*/
export function isObject(value: any): value is IObject<any> {
  return value && (typeof value === OBJECT);
}
/**
* Check the type that the value is isArray.
* @memberof Utils
* @param {string} value - Value to check the type
* @return {} true if the type is correct, false otherwise
* @example
import {isArray} from "@daybrush/utils";

console.log(isArray([])); // true
console.log(isArray({})); // false
console.log(isArray(undefined)); // false
console.log(isArray(null)); // false
*/
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
/**
* Check the type that the value is string.
* @memberof Utils
* @param {string} value - Value to check the type
* @return {} true if the type is correct, false otherwise
* @example
import {isString} from "@daybrush/utils";

console.log(isString("1234")); // true
console.log(isString(undefined)); // false
console.log(isString(1)); // false
console.log(isString(null)); // false
*/
export function isString(value: any): value is string {
  return typeof value === STRING;
}

export function isNumber(value: any): value is number {
  return typeof value === NUMBER;
}

/**
* Check the type that the value is function.
* @memberof Utils
* @param {string} value - Value to check the type
* @return {} true if the type is correct, false otherwise
* @example
import {isFunction} from "@daybrush/utils";

console.log(isFunction(function a() {})); // true
console.log(isFunction(() => {})); // true
console.log(isFunction("1234")); // false
console.log(isFunction(1)); // false
console.log(isFunction(null)); // false
*/
export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === FUNCTION;
}
function isEqualSeparator(
  character: string,
  separator: string,
) {
  const isCharacterSpace = character === "" || character == " ";
  const isSeparatorSpace = separator === "" || separator == " ";

  return (isSeparatorSpace && isCharacterSpace) || character === separator;
}
function findOpen(
  openCharacter: OpenCloseCharacter,
  texts: string[],
  index: number,
  length: number,
  openCloseCharacters: OpenCloseCharacter[],
) {
  const isIgnore = findIgnore(openCharacter, texts, index);

  if (!isIgnore) {
    return findClose(openCharacter, texts, index + 1, length, openCloseCharacters);
  }
  return index;
}
function findIgnore(
  character: OpenCloseCharacter,
  texts: string[],
  index: number,
) {
  if (!character.ignore) {
    return null;
  }
  const otherText = texts.slice(Math.max(index - 3, 0), index + 3).join("");

  return new RegExp(character.ignore).exec(otherText);

}
function findClose(
  closeCharacter: OpenCloseCharacter,
  texts: string[],
  index: number,
  length: number,
  openCloseCharacters: OpenCloseCharacter[],
) {
  for (let i = index; i < length; ++i) {
    const character = texts[i].trim();

    if (character === closeCharacter.close && !findIgnore(closeCharacter, texts, i)) {
      return i;
    }
    let nextIndex = i;
    // re open
    const openCharacter = find(openCloseCharacters, ({ open }) => open === character);

    if (openCharacter) {
      nextIndex = findOpen(openCharacter, texts, i, length, openCloseCharacters);
    }
    if (nextIndex === -1) {
      break;
    }
    i = nextIndex;
  }
  return -1;
}

export function splitText(
  text: string,
  splitOptions: string | SplitOptions,
): string[] {
  const {
    separator = ",",
    isSeparateFirst,
    isSeparateOnlyOpenClose,
    isSeparateOpenClose = isSeparateOnlyOpenClose,
    openCloseCharacters = OPEN_CLOSED_CHARACTERS,
  } = isString(splitOptions) ? {
    separator: splitOptions,
  } as SplitOptions : splitOptions;
  const openClosedText = openCloseCharacters.map(({ open, close }) => {
    if (open === close) {
      return open;
    }
    return `${open}|${close}`;
  }).join("|");
  const regexText = `(\\s*${separator}\\s*|${openClosedText}|\\s+)`;
  const regex = new RegExp(regexText, "g");
  const texts = text.split(regex).filter(chr => {
    return chr && chr !== "undefined";
  });
  const length = texts.length;
  const values: string[] = [];
  let tempValues: string[] = [];

  function resetTemp() {
    if (tempValues.length) {
      values.push(tempValues.join(""));
      tempValues = [];

      return true;
    }
    return false;
  }
  for (let i = 0; i < length; ++i) {
    const character = texts[i].trim();
    let nextIndex = i;


    const openCharacter = find(openCloseCharacters, ({ open }) => open === character);
    const closeCharacter = find(openCloseCharacters, ({ close }) => close === character);

    if (openCharacter) {
      nextIndex = findOpen(openCharacter, texts, i, length, openCloseCharacters);

      if (nextIndex !== -1 && isSeparateOpenClose) {
        if (resetTemp() && isSeparateFirst) {
          break;
        }
        values.push(texts.slice(i, nextIndex + 1).join(""));
        i = nextIndex;

        if (isSeparateFirst) {
          break;
        }
        continue;
      }
    } else if (closeCharacter && !findIgnore(closeCharacter, texts, i)) {
      const nextOpenCloseCharacters = [...openCloseCharacters];

      nextOpenCloseCharacters.splice(openCloseCharacters.indexOf(closeCharacter), 1);

      return splitText(
        text,
        {
          separator,
          isSeparateFirst,
          isSeparateOnlyOpenClose,
          isSeparateOpenClose,
          openCloseCharacters: nextOpenCloseCharacters,
        });
    } else if (isEqualSeparator(character, separator) && !isSeparateOnlyOpenClose) {
      resetTemp();
      if (isSeparateFirst) {
        break;
      }
      continue;
    }

    if (nextIndex === -1) {
      nextIndex = length - 1;
    }
    tempValues.push(texts.slice(i, nextIndex + 1).join(""));
    i = nextIndex;
  }
  if (tempValues.length) {
    values.push(tempValues.join(""));
  }
  return values;
}

/**
* divide text by space.
* @memberof Utils
* @param {string} text - text to divide
* @return {Array} divided texts
* @example
import {spliceSpace} from "@daybrush/utils";

console.log(splitSpace("a b c d e f g"));
// ["a", "b", "c", "d", "e", "f", "g"]
console.log(splitSpace("'a,b' c 'd,e' f g"));
// ["'a,b'", "c", "'d,e'", "f", "g"]
*/
export function splitSpace(text: string) {
  // divide comma(space)
  return splitText(text, "");
}

/**
* divide text by comma.
* @memberof Utils
* @param {string} text - text to divide
* @return {Array} divided texts
* @example
import {splitComma} from "@daybrush/utils";

console.log(splitComma("a,b,c,d,e,f,g"));
// ["a", "b", "c", "d", "e", "f", "g"]
console.log(splitComma("'a,b',c,'d,e',f,g"));
// ["'a,b'", "c", "'d,e'", "f", "g"]
*/
export function splitComma(text: string): string[] {
  // divide comma(,)
  // "[^"]*"|'[^']*'
  return splitText(text, ",");
}
/**
* divide text by bracket "(", ")".
* @memberof Utils
* @param {string} text - text to divide
* @return {object} divided texts
* @example
import {splitBracket} from "@daybrush/utils";

console.log(splitBracket("a(1, 2)"));
// {prefix: "a", value: "1, 2", suffix: ""}
console.log(splitBracket("a(1, 2)b"));
// {prefix: "a", value: "1, 2", suffix: "b"}
*/
export function splitBracket(text: string) {
  const matches = (/([^(]*)\(([\s\S]*)\)([\s\S]*)/g).exec(text);

  if (!matches || matches.length < 4) {
    return {};
  } else {
    return { prefix: matches[1], value: matches[2], suffix: matches[3] };
  }
}
/**
* divide text by number and unit.
* @memberof Utils
* @param {string} text - text to divide
* @return {} divided texts
* @example
import {splitUnit} from "@daybrush/utils";

console.log(splitUnit("10px"));
// {prefix: "", value: 10, unit: "px"}
console.log(splitUnit("-10px"));
// {prefix: "", value: -10, unit: "px"}
console.log(splitUnit("a10%"));
// {prefix: "a", value: 10, unit: "%"}
*/
export function splitUnit(text: string): { prefix: string, unit: string, value: number } {
  const matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);

  if (!matches) {
    return { prefix: "", unit: "", value: NaN };
  }
  const prefix = matches[1];
  const value = matches[2];
  const unit = matches[3];

  return { prefix, unit, value: parseFloat(value) };
}

/**
* transform strings to camel-case
* @memberof Utils
* @param {String} text - string
* @return {String} camel-case string
* @example
import {camelize} from "@daybrush/utils";

console.log(camelize("transform-origin")); // transformOrigin
console.log(camelize("abcd_efg")); // abcdEfg
console.log(camelize("abcd efg")); // abcdEfg
*/
export function camelize(str: string) {
  return str.replace(/[\s-_]+([^\s-_])/g, (all, letter) => letter.toUpperCase());
}
/**
* transform a camelized string into a lowercased string.
* @memberof Utils
* @param {string} text - a camel-cased string
* @param {string} [separator="-"] - a separator
* @return {string}  a lowercased string
* @example
import {decamelize} from "@daybrush/utils";

console.log(decamelize("transformOrigin")); // transform-origin
console.log(decamelize("abcdEfg", "_")); // abcd_efg
*/
export function decamelize(str: string, separator: string = "-") {
  return str.replace(/([a-z])([A-Z])/g, (all, letter, letter2) => `${letter}${separator}${letter2.toLowerCase()}`);
}

/**
* transforms something in an array into an array.
* @memberof Utils
* @param - Array form
* @return an array
* @example
import {toArray} from "@daybrush/utils";

const arr1 = toArray(document.querySelectorAll(".a")); // Element[]
const arr2 = toArray(document.querySelectorAll<HTMLElement>(".a")); // HTMLElement[]
*/
export function toArray<T>(value: IArrayFormat<T>): T[] {
  return [].slice.call(value);
}

/**
* Date.now() method
* @memberof CrossBrowser
* @return {number} milliseconds
* @example
import {now} from "@daybrush/utils";

console.log(now()); // 12121324241(milliseconds)
*/
export function now() {
  return Date.now ? Date.now() : new Date().getTime();
}

/**
* Returns the index of the first element in the array that satisfies the provided testing function.
* @function
* @memberof CrossBrowser
* @param - The array `findIndex` was called upon.
* @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
* @param - Returns defaultIndex if not found by the function.
* @example
import { findIndex } from "@daybrush/utils";

findIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
*/
export function findIndex<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defaultIndex: number = -1,
): number {
  const length = arr.length;

  for (let i = 0; i < length; ++i) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return defaultIndex;
}

/**
* Returns the reverse direction index of the first element in the array that satisfies the provided testing function.
* @function
* @memberof CrossBrowser
* @param - The array `findLastIndex` was called upon.
* @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
* @param - Returns defaultIndex if not found by the function.
* @example
import { findLastIndex } from "@daybrush/utils";

findLastIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
*/
export function findLastIndex<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defaultIndex: number = -1,
): number {
  const length = arr.length;

  for (let i = length - 1; i >= 0; --i) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return defaultIndex;
}

/**
* Returns the value of the reverse direction element in the array that satisfies the provided testing function.
* @function
* @memberof CrossBrowser
* @param - The array `findLast` was called upon.
* @param - A function to execute on each value in the array,
* @param - Returns defalutValue if not found by the function.
* @example
import { find } from "@daybrush/utils";

find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
*/
export function findLast<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defalutValue?: T,
): T | undefined {
  const index = findLastIndex(arr, callback);

  return index > - 1 ? arr[index] : defalutValue;
}
/**
* Returns the value of the first element in the array that satisfies the provided testing function.
* @function
* @memberof CrossBrowser
* @param - The array `find` was called upon.
* @param - A function to execute on each value in the array,
* @param - Returns defalutValue if not found by the function.
* @example
import { find } from "@daybrush/utils";

find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
*/
export function find<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defalutValue?: T,
): T | undefined {
  const index = findIndex(arr, callback);

  return index > - 1 ? arr[index] : defalutValue;
}

/**
* window.requestAnimationFrame() method with cross browser.
* @function
* @memberof CrossBrowser
* @param {FrameRequestCallback} callback - The function to call when it's time to update your animation for the next repaint.
* @return {number} id
* @example
import {requestAnimationFrame} from "@daybrush/utils";

requestAnimationFrame((timestamp) => {
  console.log(timestamp);
});
*/
export const requestAnimationFrame = /*#__PURE__*/(() => {
  const firstTime = now();

  const raf = IS_WINDOW
    && (window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame
      || (window as any).mozRequestAnimationFrame || (window as any).msRequestAnimationFrame);

  return raf ? (raf.bind(window) as (callback: FrameRequestCallback) => number) : ((callback: FrameRequestCallback) => {
    const currTime = now();
    const id = setTimeout(() => {
      callback(currTime - firstTime);
    }, 1000 / 60);

    return id as any as number;
  });
})();

/**
* window.cancelAnimationFrame() method with cross browser.
* @function
* @memberof CrossBrowser
* @param {number} handle - the id obtained through requestAnimationFrame method
* @return {void}
* @example
import { requestAnimationFrame, cancelAnimationFrame } from "@daybrush/utils";

const id = requestAnimationFrame((timestamp) => {
  console.log(timestamp);
});

cancelAnimationFrame(id);
*/
export const cancelAnimationFrame = /*#__PURE__*/(() => {
  const caf = IS_WINDOW
    && (window.cancelAnimationFrame || (window as any).webkitCancelAnimationFrame
      || (window as any).mozCancelAnimationFrame || (window as any).msCancelAnimationFrame);

  return caf
    ? caf.bind(window) as (handle: number) => void
    : ((handle: number) => { clearTimeout(handle); });
})();

/**
* @function
* @memberof Utils
*/
export function getKeys(obj: IObject<any>): string[] {
  return Object.keys(obj);
}

/**
* @function
* @memberof Utils
*/
export function getValues(obj: IObject<any>): any[] {
  const keys = getKeys(obj);

  return keys.map(key => obj[key]);
}
/**
* @function
* @memberof Utils
*/
export function getEntries(obj: IObject<any>): [string, any][] {
  const keys = getKeys(obj);

  return keys.map(key => [key, obj[key]]);
}

/**
* @function
* @memberof Utils
*/
export function sortOrders(keys: Array<string | number>, orders: Array<string | number> = []) {
  keys.sort((a, b) => {
    const index1 = orders.indexOf(a);
    const index2 = orders.indexOf(b);

    if (index2 === -1 && index1 === -1) {
      return 0;
    }
    if (index1 === -1) {
      return 1;
    }
    if (index2 === -1) {
      return -1;
    }
    return index1 - index2;
  });
}

/**
* convert unit size to px size
* @function
* @memberof Utils
*/
export function convertUnitSize(pos: string, size: number | IObject<((pos: number) => number) | number>) {
  const { value, unit } = splitUnit(pos);

  if (isObject(size)) {
    const sizeFunction = size[unit];
    if (sizeFunction) {
      if (isFunction(sizeFunction)) {
        return sizeFunction(value);
      } else if (DEFAULT_UNIT_PRESETS[unit]) {
        return DEFAULT_UNIT_PRESETS[unit](value, sizeFunction);
      }
    }
  } else if (unit === "%") {
    return value * size / 100;
  }
  if (DEFAULT_UNIT_PRESETS[unit]) {
    return DEFAULT_UNIT_PRESETS[unit](value);
  }
  return value;
}

/**
* calculate between min, max
* @function
* @memberof Utils
*/
export function between(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function checkBoundSize(targetSize: number[], compareSize: number[], isMax: boolean, ratio = targetSize[0] / targetSize[1]) {
  return [
    [throttle(compareSize[0], TINY_NUM), throttle(compareSize[0] / ratio, TINY_NUM)],
    [throttle(compareSize[1] * ratio, TINY_NUM), throttle(compareSize[1], TINY_NUM)],
  ].filter(size => size.every((value, i) => {
    const defaultSize = compareSize[i];
    const throttledSize = throttle(defaultSize, TINY_NUM);

    return isMax ? value <= defaultSize || value <= throttledSize : value >= defaultSize || value >= throttledSize;
  }))[0] || targetSize;
}

/**
* calculate bound size
* @function
* @memberof Utils
*/
export function calculateBoundSize(
  size: number[],
  minSize: number[],
  maxSize: number[],
  keepRatio?: number | boolean,
): number[] {
  if (!keepRatio) {
    return size.map((value, i) => between(value, minSize[i], maxSize[i]));
  }
  let [width, height] = size;

  const ratio = keepRatio === true ? width / height : keepRatio;
  // width : height = minWidth : minHeight;
  const [minWidth, minHeight] = checkBoundSize(size, minSize, false, ratio);
  const [maxWidth, maxHeight] = checkBoundSize(size, maxSize, true, ratio);

  if (width < minWidth || height < minHeight) {
    width = minWidth;
    height = minHeight;
  } else if (width > maxWidth || height > maxHeight) {
    width = maxWidth;
    height = maxHeight;
  }
  return [width, height];
}


/**
* Add all the numbers.
* @function
* @memberof Utils
*/
export function sum(nums: number[]): number {
  const length = nums.length;
  let total = 0;

  for (let i = length - 1; i >= 0; --i) {
    total += nums[i];
  }
  return total;
}

/**
* Average all numbers.
* @function
* @memberof Utils
*/
export function average(nums: number[]) {
  const length = nums.length;
  let total = 0;

  for (let i = length - 1; i >= 0; --i) {
    total += nums[i];
  }
  return length ? total / length : 0;
}
/**
* Get the angle of two points. (0 <= rad < 359)
* @function
* @memberof Utils
*/
export function getRad(pos1: number[], pos2: number[]): number {
  const distX = pos2[0] - pos1[0];
  const distY = pos2[1] - pos1[1];
  const rad = Math.atan2(distY, distX);

  return rad >= 0 ? rad : rad + Math.PI * 2;
}
/**
* Get the average point of all points.
* @function
* @memberof Utils
*/
export function getCenterPoint(points: number[][]): number[] {
  return [0, 1].map(i => average(points.map(pos => pos[i])));
}
/**
* Gets the direction of the shape.
* @function
* @memberof Utils
*/
export function getShapeDirection(points: number[][]): 1 | -1 {
  const center = getCenterPoint(points);
  const pos1Rad = getRad(center, points[0]);
  const pos2Rad = getRad(center, points[1]);

  return (pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI) || (pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI)
    ? 1 : -1;
}

/**
* Get the distance between two points.
* @function
* @memberof Utils
*/
export function getDist(a: number[], b?: number[]) {
  return Math.sqrt(Math.pow((b ? b[0] : 0) - a[0], 2) + Math.pow((b ? b[1] : 0) - a[1], 2));
}

/**
* throttle number depending on the unit.
* @function
* @memberof Utils
*/
export function throttle(num: number, unit?: number) {
  if (!unit) {
    return num;
  }
  const reverseUnit = 1 / unit;
  return Math.round(num / unit) / reverseUnit;
}

/**
* throttle number array depending on the unit.
* @function
* @memberof Utils
*/
export function throttleArray(nums: number[], unit?: number) {
  nums.forEach((_, i) => {
    nums[i] = throttle(nums[i], unit);
  });
  return nums;
}

/**
* @function
* @memberof Utils
*/
export function counter(num: number): number[] {
  const nums: number[] = [];

  for (let i = 0; i < num; ++i) {
    nums.push(i);
  }

  return nums;
}

/**
* @function
* @memberof Utils
*/
export function replaceOnce(text: string, fromText: RegExp | string, toText: string | ((...args: any[]) => string)): string {
  let isOnce = false;
  return text.replace(fromText, (...args: any[]) => {
    if (isOnce) {
      return args[0];
    }
    isOnce = true;
    return isString(toText) ? toText : toText(...args);
  });
}


/**
* @function
* @memberof Utils
*/
export function flat<Type>(arr: Type[][]): Type[] {
  return arr.reduce((prev, cur) => {
    return prev.concat(cur);
  }, []);
}

/**
* @function
* @memberof Utils
*/
export function deepFlat<T extends any[]>(arr: T): Array<FlattedElement<T[0]>> {
  return arr.reduce((prev, cur) => {
    if (isArray(cur)) {
      prev.push(...deepFlat(cur));
    } else {
      prev.push(cur);
    }
    return prev;
  }, [] as any[]);
}


/**
 * @function
 * @memberof Utils
 */
export function pushSet<T>(elements: T[], element: T) {
  if (elements.indexOf(element) === -1) {
    elements.push(element);
  }
}
