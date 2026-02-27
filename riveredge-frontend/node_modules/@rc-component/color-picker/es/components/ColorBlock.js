import { clsx } from 'clsx';
import React from 'react';
const ColorBlock = ({
  color,
  prefixCls,
  className,
  style,
  onClick
}) => {
  const colorBlockCls = `${prefixCls}-color-block`;
  return /*#__PURE__*/React.createElement("div", {
    className: clsx(colorBlockCls, className),
    style: style,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: `${colorBlockCls}-inner`,
    style: {
      background: color
    }
  }));
};
export default ColorBlock;