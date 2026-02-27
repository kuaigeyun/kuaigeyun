import React from 'react';
import "./index.css";
var HeaderTitle = function HeaderTitle(props) {
  var title = props.title,
    description = props.description;
  return /*#__PURE__*/React.createElement("div", {
    className: 'fr-obj-header'
  }, /*#__PURE__*/React.createElement("span", {
    className: 'fr-header-title'
  }, title), description && /*#__PURE__*/React.createElement("span", {
    className: 'fr-header-desc'
  }, "( ", description, " )"));
};
export default HeaderTitle;