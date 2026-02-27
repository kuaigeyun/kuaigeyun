/*
Copyright (c) 2019 Daybrush
name: react-css-styled
license: MIT
author: Daybrush
repository: https://github.com/daybrush/css-styled/tree/master/packages/react-css-styled
version: 1.1.9
*/
'use strict';

var cssStyled = require('css-styled');
var react = require('react');
var frameworkUtils = require('framework-utils');

/******************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

var StyledElement = /*#__PURE__*/function (_super) {
  __extends(StyledElement, _super);
  function StyledElement() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.injectResult = null;
    _this.tag = "div";
    return _this;
  }
  var __proto = StyledElement.prototype;
  __proto.render = function () {
    var _a = this.props,
      _b = _a.className,
      className = _b === void 0 ? "" : _b,
      cspNonce = _a.cspNonce,
      portalContainer = _a.portalContainer,
      attributes = __rest(_a, ["className", "cspNonce", "portalContainer"]);
    var cssId = this.injector.className;
    var Tag = this.tag;
    var portalAttributes = {};
    if ((react.version || "").indexOf("simple") > -1 && portalContainer) {
      portalAttributes = {
        portalContainer: portalContainer
      };
    }
    return react.createElement(Tag, __assign(__assign({
      "ref": frameworkUtils.ref(this, "element"),
      "data-styled-id": cssId,
      "className": "".concat(className, " ").concat(cssId)
    }, portalAttributes), attributes));
  };
  __proto.componentDidMount = function () {
    this.injectResult = this.injector.inject(this.element, {
      nonce: this.props.cspNonce
    });
  };
  __proto.componentWillUnmount = function () {
    this.injectResult.destroy();
    this.injectResult = null;
  };
  __proto.getElement = function () {
    return this.element;
  };
  return StyledElement;
}(react.Component);

function defaultStyled(tag, css) {
  var injector = cssStyled(css);
  return (/*#__PURE__*/function (_super) {
      __extends(Styled, _super);
      function Styled() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.injector = injector;
        _this.tag = tag;
        return _this;
      }
      return Styled;
    }(StyledElement)
  );
}
function styled(Tag, css) {
  var injector = cssStyled(css);
  var cssId = injector.className;
  return react.forwardRef(function (props, ref) {
    var _a = props.className,
      className = _a === void 0 ? "" : _a,
      cspNonce = props.cspNonce,
      attributes = __rest(props, ["className", "cspNonce"]);
    var targetRef = react.useRef();
    react.useImperativeHandle(ref, function () {
      return targetRef.current;
    }, []);
    react.useEffect(function () {
      var injectResult = injector.inject(targetRef.current, {
        nonce: props.cspNonce
      });
      return function () {
        injectResult.destroy();
      };
    }, []);
    return react.createElement(Tag, __assign({
      "ref": targetRef,
      "data-styled-id": cssId,
      "className": "".concat(className, " ").concat(cssId)
    }, attributes));
  });
}



var modules = {
    __proto__: null,
    'default': defaultStyled,
    StyledElement: StyledElement,
    styled: styled
};

for (var name in modules) {
  defaultStyled[name] = modules[name];
}
module.exports = defaultStyled;

exports.StyledElement = StyledElement;
exports.default = defaultStyled;
exports.styled = styled;
//# sourceMappingURL=styled.cjs.js.map
