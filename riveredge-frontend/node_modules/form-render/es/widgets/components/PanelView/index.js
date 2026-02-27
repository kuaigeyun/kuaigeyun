import React from 'react';
import classnames from 'classnames';
import "./index.css";
var PanelView = function PanelView(_ref) {
  var children = _ref.children,
    bordered = _ref.bordered;
  return /*#__PURE__*/React.createElement("div", {
    className: classnames('fr-panel', {
      'fr-panel-bordered': bordered
    })
  }, children);
};
export default PanelView;