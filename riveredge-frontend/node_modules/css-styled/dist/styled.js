/*
Copyright (c) Daybrush
name: css-styled
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/css-styled.git
version: 1.0.8
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.styled = factory());
}(this, (function () { 'use strict';

  function hash(str) {
    var hash = 5381,
        i    = str.length;

    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
  }

  var stringHash = hash;

  /*
  Copyright (c) 2018 Daybrush
  @name: @daybrush/utils
  license: MIT
  author: Daybrush
  repository: https://github.com/daybrush/utils
  @version 1.13.0
  */
  /**
  * get string "string"
  * @memberof Consts
  * @example
  import {STRING} from "@daybrush/utils";

  console.log(STRING); // "string"
  */
  var STRING = "string";
  /**
  * get string "undefined"
  * @memberof Consts
  * @example
  import {UNDEFINED} from "@daybrush/utils";

  console.log(UNDEFINED); // "undefined"
  */
  var UNDEFINED = "undefined";
  /**
  * Check whether the environment is window or node.js.
  * @memberof Consts
  * @name document
  * @example
  import {IS_WINDOW} from "@daybrush/utils";

  console.log(IS_WINDOW); // false in node.js
  console.log(IS_WINDOW); // true in browser
  */
  var doc = typeof document !== UNDEFINED && document; // FIXME: this type maybe false
  var OPEN_CLOSED_CHARACTERS = [{
    open: "(",
    close: ")"
  }, {
    open: "\"",
    close: "\""
  }, {
    open: "'",
    close: "'"
  }, {
    open: "\\\"",
    close: "\\\""
  }, {
    open: "\\'",
    close: "\\'"
  }];

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
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
  function isString(value) {
    return typeof value === STRING;
  }
  function isEqualSeparator(character, separator) {
    var isCharacterSpace = character === "" || character == " ";
    var isSeparatorSpace = separator === "" || separator == " ";
    return isSeparatorSpace && isCharacterSpace || character === separator;
  }
  function findOpen(openCharacter, texts, index, length, openCloseCharacters) {
    var isIgnore = findIgnore(openCharacter, texts, index);
    if (!isIgnore) {
      return findClose(openCharacter, texts, index + 1, length, openCloseCharacters);
    }
    return index;
  }
  function findIgnore(character, texts, index) {
    if (!character.ignore) {
      return null;
    }
    var otherText = texts.slice(Math.max(index - 3, 0), index + 3).join("");
    return new RegExp(character.ignore).exec(otherText);
  }
  function findClose(closeCharacter, texts, index, length, openCloseCharacters) {
    var _loop_1 = function (i) {
      var character = texts[i].trim();
      if (character === closeCharacter.close && !findIgnore(closeCharacter, texts, i)) {
        return {
          value: i
        };
      }
      var nextIndex = i;
      // re open
      var openCharacter = find(openCloseCharacters, function (_a) {
        var open = _a.open;
        return open === character;
      });
      if (openCharacter) {
        nextIndex = findOpen(openCharacter, texts, i, length, openCloseCharacters);
      }
      if (nextIndex === -1) {
        return out_i_1 = i, "break";
      }
      i = nextIndex;
      out_i_1 = i;
    };
    var out_i_1;
    for (var i = index; i < length; ++i) {
      var state_1 = _loop_1(i);
      i = out_i_1;
      if (typeof state_1 === "object") return state_1.value;
      if (state_1 === "break") break;
    }
    return -1;
  }
  function splitText(text, splitOptions) {
    var _a = isString(splitOptions) ? {
        separator: splitOptions
      } : splitOptions,
      _b = _a.separator,
      separator = _b === void 0 ? "," : _b,
      isSeparateFirst = _a.isSeparateFirst,
      isSeparateOnlyOpenClose = _a.isSeparateOnlyOpenClose,
      _c = _a.isSeparateOpenClose,
      isSeparateOpenClose = _c === void 0 ? isSeparateOnlyOpenClose : _c,
      _d = _a.openCloseCharacters,
      openCloseCharacters = _d === void 0 ? OPEN_CLOSED_CHARACTERS : _d;
    var openClosedText = openCloseCharacters.map(function (_a) {
      var open = _a.open,
        close = _a.close;
      if (open === close) {
        return open;
      }
      return open + "|" + close;
    }).join("|");
    var regexText = "(\\s*" + separator + "\\s*|" + openClosedText + "|\\s+)";
    var regex = new RegExp(regexText, "g");
    var texts = text.split(regex).filter(function (chr) {
      return chr && chr !== "undefined";
    });
    var length = texts.length;
    var values = [];
    var tempValues = [];
    function resetTemp() {
      if (tempValues.length) {
        values.push(tempValues.join(""));
        tempValues = [];
        return true;
      }
      return false;
    }
    var _loop_2 = function (i) {
      var character = texts[i].trim();
      var nextIndex = i;
      var openCharacter = find(openCloseCharacters, function (_a) {
        var open = _a.open;
        return open === character;
      });
      var closeCharacter = find(openCloseCharacters, function (_a) {
        var close = _a.close;
        return close === character;
      });
      if (openCharacter) {
        nextIndex = findOpen(openCharacter, texts, i, length, openCloseCharacters);
        if (nextIndex !== -1 && isSeparateOpenClose) {
          if (resetTemp() && isSeparateFirst) {
            return out_i_2 = i, "break";
          }
          values.push(texts.slice(i, nextIndex + 1).join(""));
          i = nextIndex;
          if (isSeparateFirst) {
            return out_i_2 = i, "break";
          }
          return out_i_2 = i, "continue";
        }
      } else if (closeCharacter && !findIgnore(closeCharacter, texts, i)) {
        var nextOpenCloseCharacters = __spreadArrays(openCloseCharacters);
        nextOpenCloseCharacters.splice(openCloseCharacters.indexOf(closeCharacter), 1);
        return {
          value: splitText(text, {
            separator: separator,
            isSeparateFirst: isSeparateFirst,
            isSeparateOnlyOpenClose: isSeparateOnlyOpenClose,
            isSeparateOpenClose: isSeparateOpenClose,
            openCloseCharacters: nextOpenCloseCharacters
          })
        };
      } else if (isEqualSeparator(character, separator) && !isSeparateOnlyOpenClose) {
        resetTemp();
        if (isSeparateFirst) {
          return out_i_2 = i, "break";
        }
        return out_i_2 = i, "continue";
      }
      if (nextIndex === -1) {
        nextIndex = length - 1;
      }
      tempValues.push(texts.slice(i, nextIndex + 1).join(""));
      i = nextIndex;
      out_i_2 = i;
    };
    var out_i_2;
    for (var i = 0; i < length; ++i) {
      var state_2 = _loop_2(i);
      i = out_i_2;
      if (typeof state_2 === "object") return state_2.value;
      if (state_2 === "break") break;
    }
    if (tempValues.length) {
      values.push(tempValues.join(""));
    }
    return values;
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
  function splitComma(text) {
    // divide comma(,)
    // "[^"]*"|'[^']*'
    return splitText(text, ",");
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
  function findIndex(arr, callback, defaultIndex) {
    if (defaultIndex === void 0) {
      defaultIndex = -1;
    }
    var length = arr.length;
    for (var i = 0; i < length; ++i) {
      if (callback(arr[i], i, arr)) {
        return i;
      }
    }
    return defaultIndex;
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
  function find(arr, callback, defalutValue) {
    var index = findIndex(arr, callback);
    return index > -1 ? arr[index] : defalutValue;
  }
  function getDocument(el) {
    return (el === null || el === void 0 ? void 0 : el.ownerDocument) || doc;
  }

  function getHash(str) {
    return stringHash(str).toString(36);
  }
  function getShadowRoot(parentElement) {
    if (parentElement && parentElement.getRootNode) {
      var rootNode = parentElement.getRootNode();
      if (rootNode.nodeType === 11) {
        return rootNode;
      }
    }
    return;
  }
  function replaceStyle(className, css, options) {
    if (options.original) {
      return css;
    }
    return css.replace(/([^};{\s}][^};{]*|^\s*){/mg, function (_, selector) {
      var trimmedSelector = selector.trim();
      return (trimmedSelector ? splitComma(trimmedSelector) : [""]).map(function (subSelector) {
        var trimmedSubSelector = subSelector.trim();
        if (trimmedSubSelector.indexOf("@") === 0) {
          return trimmedSubSelector;
        } else if (trimmedSubSelector.indexOf(":global") > -1) {
          return trimmedSubSelector.replace(/\:global/g, "");
        } else if (trimmedSubSelector.indexOf(":host") > -1) {
          return "".concat(trimmedSubSelector.replace(/\:host/g, ".".concat(className)));
        } else if (trimmedSubSelector) {
          return ".".concat(className, " ").concat(trimmedSubSelector);
        } else {
          return ".".concat(className);
        }
      }).join(", ") + " {";
    });
  }
  function injectStyle(className, css, options, el, shadowRoot) {
    var doc = getDocument(el);
    var style = doc.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-styled-id", className);
    style.setAttribute("data-styled-count", "1");
    if (options.nonce) {
      style.setAttribute("nonce", options.nonce);
    }
    style.innerHTML = replaceStyle(className, css, options);
    (shadowRoot || doc.head || doc.body).appendChild(style);
    return style;
  }

  /**
   * Create an styled object that can be defined and inserted into the css.
   * @param - css styles
   */
  function styled(css) {
    var injectClassName = "rCS" + getHash(css);
    return {
      className: injectClassName,
      inject: function (el, options) {
        if (options === void 0) {
          options = {};
        }
        var shadowRoot = getShadowRoot(el);
        var styleElement = (shadowRoot || el.ownerDocument || document).querySelector("style[data-styled-id=\"".concat(injectClassName, "\"]"));
        if (!styleElement) {
          styleElement = injectStyle(injectClassName, css, options, el, shadowRoot);
        } else {
          var count = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;
          styleElement.setAttribute("data-styled-count", "".concat(count + 1));
        }
        return {
          destroy: function () {
            var _a;
            var injectCount = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;
            if (injectCount <= 1) {
              if (styleElement.remove) {
                styleElement.remove();
              } else {
                (_a = styleElement.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(styleElement);
              }
              styleElement = null;
            } else {
              styleElement.setAttribute("data-styled-count", "".concat(injectCount - 1));
            }
          }
        };
      }
    };
  }

  return styled;

})));
//# sourceMappingURL=styled.js.map
