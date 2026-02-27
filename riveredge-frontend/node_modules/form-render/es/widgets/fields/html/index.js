import "antd/es/image/style";
import _Image from "antd/es/image";
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import React from 'react';
export default function html(_ref) {
  var value = _ref.value,
    checked = _ref.checked,
    options = _ref.options,
    _ref$schema = _ref.schema,
    schema = _ref$schema === void 0 ? {} : _ref$schema;
  var __html = '-';
  if (schema.type === 'boolean') {
    __html = value === true || checked === true ? '✔' : '✘';
  } else if ((options === null || options === void 0 ? void 0 : options.length) > 0) {
    if (['string', 'number'].indexOf(_typeof(value)) > -1) {
      var item = options.find(function (item) {
        return item.value === value;
      });
      __html = (item === null || item === void 0 ? void 0 : item.label) || '-';
    } else if (Array.isArray(value)) {
      var idxStr = '-';
      value.forEach(function (v) {
        var item = options.find(function (item) {
          return item.value === v;
        });
        var name = item.label;
        if (name) {
          idxStr += ',' + name;
        }
      });
      __html = idxStr.replace('-,', '');
    }
  } else if (typeof value === 'number') {
    __html = String(value);
  } else if (typeof value === 'string') {
    __html = value;
  } else if (schema.type === 'range' && Array.isArray(value) && value[0] && value[1]) {
    __html = "".concat(value[0], " - ").concat(value[1]);
  } else if (value && ['number', 'string'].indexOf(_typeof(value)) === -1) {
    __html = JSON.stringify(value);
  }
  if (schema.format === 'image') {
    return /*#__PURE__*/React.createElement(_Image, Object.assign({
      height: 56,
      src: value
    }, schema.imageProps));
  }
  return /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: __html
    }
  });
}