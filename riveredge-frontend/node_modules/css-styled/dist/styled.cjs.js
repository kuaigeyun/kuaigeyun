/*
Copyright (c) Daybrush
name: css-styled
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/css-styled.git
version: 1.0.8
*/
'use strict';

var utils = require('@daybrush/utils');

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
    return (trimmedSelector ? utils.splitComma(trimmedSelector) : [""]).map(function (subSelector) {
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
  var doc = utils.getDocument(el);
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

module.exports = styled;

exports.default = styled;
//# sourceMappingURL=styled.cjs.js.map
