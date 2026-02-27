import React from 'react';
import PanelView from '../components/PanelView';
import "./index.css";
var FLineTitle = function FLineTitle(_ref) {
  var children = _ref.children,
    title = _ref.title,
    description = _ref.description;
  if (!title) {
    return /*#__PURE__*/React.createElement(PanelView, null, children);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: 'fr-obj-line-title'
  }, /*#__PURE__*/React.createElement("div", {
    className: 'fr-obj-header'
  }, /*#__PURE__*/React.createElement("span", {
    className: 'fr-header-title'
  }, title), description && /*#__PURE__*/React.createElement("span", {
    className: 'fr-header-desc'
  }, description)), /*#__PURE__*/React.createElement("div", {
    className: 'fr-obj-content'
  }, children));
};
export default FLineTitle;