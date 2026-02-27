import "antd/es/space/style";
import _Space from "antd/es/space";
import "antd/es/checkbox/style";
import _Checkbox from "antd/es/checkbox";
import { __rest } from "tslib";
import React from 'react';
import withFieldWrap from '../../utils/withFieldWrap';
var Checkboxes = function Checkboxes(props) {
  var _props$direction = props.direction,
    direction = _props$direction === void 0 ? 'row' : _props$direction,
    _props$options = props.options,
    options = _props$options === void 0 ? [] : _props$options,
    rest = __rest(props, ["direction", "options"]);
  if (direction === 'column') {
    return /*#__PURE__*/React.createElement(_Checkbox.Group, Object.assign({}, rest), /*#__PURE__*/React.createElement(_Space, {
      direction: 'vertical'
    }, options.map(function (item) {
      var value = item.value,
        label = item.label,
        rest = __rest(item, ["value", "label"]);
      return /*#__PURE__*/React.createElement(_Checkbox, Object.assign({
        key: value,
        value: value
      }, rest), label);
    })));
  }
  return /*#__PURE__*/React.createElement(_Checkbox.Group, Object.assign({}, rest, {
    options: options
  }));
};
export default withFieldWrap(Checkboxes);