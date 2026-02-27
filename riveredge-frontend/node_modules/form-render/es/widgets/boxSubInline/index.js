import "antd/es/form/style";
import _Form from "antd/es/form";
import { __rest } from "tslib";
import React from 'react';
import classnames from 'classnames';
import "./index.css";
var BoxSubInline = function BoxSubInline(props) {
  var children = props.children,
    title = props.title,
    _props$hasBackground = props.hasBackground,
    hasBackground = _props$hasBackground === void 0 ? true : _props$hasBackground,
    description = props.description,
    tooltip = props.tooltip,
    fieldCol = props.fieldCol,
    labelCol = props.labelCol,
    labelWidth = props.labelWidth,
    displayType = props.displayType,
    rest = __rest(props, ["children", "title", "hasBackground", "description", "tooltip", "fieldCol", "labelCol", "labelWidth", "displayType"]);
  var _tooltip = null;
  var _labelCol = {
    span: 3
  };
  var _fieldCol = {
    flex: 1
  };
  if (description) {
    _tooltip = {
      title: description
    };
  }
  if (tooltip) {
    _tooltip = tooltip;
  }
  if (labelWidth) {
    _labelCol = {
      flex: labelWidth + 'px'
    };
  }
  if (labelCol) {
    _labelCol = labelCol;
  }
  if (fieldCol) {
    _fieldCol = fieldCol;
  }
  return /*#__PURE__*/React.createElement(_Form.Item, Object.assign({}, rest, {
    className: classnames('fr-obj-subinline', {
      'fr-obj-subinline-label-hidden': !title,
      'fr-obj-subinline-background': hasBackground
    }),
    label: title || 'notitle',
    labelCol: _labelCol,
    wrapperCol: _fieldCol,
    tooltip: _tooltip
  }), children);
};
export default BoxSubInline;