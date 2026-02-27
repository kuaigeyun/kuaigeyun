import "antd/es/input/style";
import _Input from "antd/es/input";
import "antd/es/config-provider/style";
import _ConfigProvider from "antd/es/config-provider";
import { __rest } from "tslib";
import React, { useContext } from 'react';
import { isUrl, translation } from '../../utils';
import withFieldWrap from '../../utils/withFieldWrap';
var UrlNode = function UrlNode(props) {
  var configCtx = useContext(_ConfigProvider.ConfigContext);
  var t = translation(configCtx);
  var value = props.value,
    _props$addonText = props.addonText,
    addonText = _props$addonText === void 0 ? t('test_src') : _props$addonText;
  var useUrl = isUrl(value);
  if (useUrl) {
    return /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      href: value
    }, addonText);
  }
  return /*#__PURE__*/React.createElement("div", null, addonText);
};
var UrlInput = function UrlInput(_a) {
  var value = _a.value,
    prefix = _a.prefix,
    suffix = _a.suffix,
    addonText = _a.addonText,
    onChange = _a.onChange,
    rest = __rest(_a, ["value", "prefix", "suffix", "addonText", "onChange"]);
  var _value = value || '';
  if (prefix) {
    _value = _value.replace(prefix, '');
  }
  if (suffix) {
    _value = _value.replace(suffix, '');
  }
  var handleChange = function handleChange(e) {
    var _value = e.target.value;
    if (!_value) {
      onChange === null || onChange === void 0 ? void 0 : onChange(_value);
      return;
    }
    if (prefix) {
      _value = prefix + _value;
    }
    if (suffix) {
      _value = _value + suffix;
    }
    onChange === null || onChange === void 0 ? void 0 : onChange(_value);
  };
  return /*#__PURE__*/React.createElement(_Input, Object.assign({
    value: _value,
    prefix: prefix,
    suffix: suffix,
    onChange: handleChange,
    addonAfter: /*#__PURE__*/React.createElement(UrlNode, {
      value: value,
      addonText: addonText
    })
  }, rest));
};
export default withFieldWrap(UrlInput);