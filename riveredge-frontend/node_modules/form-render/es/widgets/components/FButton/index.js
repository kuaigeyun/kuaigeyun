import "antd/es/button/style";
import _Button from "antd/es/button";
import { __rest } from "tslib";
import React from 'react';
var HeaderTitle = function HeaderTitle(props) {
  var icon = props.icon,
    children = props.children,
    btnType = props.btnType,
    otherProps = __rest(props, ["icon", "children", "btnType"]);
  var btnProps = Object.assign({}, otherProps);
  if (btnType === 'icon') {
    btnProps.icon = icon;
    btnProps.size = 'small';
  } else {
    btnProps.children = children;
  }
  return /*#__PURE__*/React.createElement(_Button, Object.assign({
    type: 'link',
    style: {
      padding: 0
    }
  }, btnProps));
};
export default HeaderTitle;