import "antd/es/checkbox/style";
import _Checkbox from "antd/es/checkbox";
import { __rest } from "tslib";
import React from 'react';
import withFieldWrap from '../../utils/withFieldWrap';
var CheckBox = function CheckBox(_a) {
  var title = _a.title,
    rest = __rest(_a, ["title"]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Checkbox, Object.assign({}, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '12px'
    }
  }, title));
};
export default withFieldWrap(CheckBox);