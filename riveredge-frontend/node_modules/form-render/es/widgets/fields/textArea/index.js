import "antd/es/input/style";
import _Input from "antd/es/input";
import React from 'react';
import withFieldWrap from '../../utils/withFieldWrap';
var TextArea = function TextArea(props) {
  var finalProps = Object.assign({
    autoSize: {
      minRows: 3
    }
  }, props);
  if (finalProps.rows) delete finalProps.autoSize;
  return /*#__PURE__*/React.createElement(_Input.TextArea, Object.assign({}, finalProps));
};
export default withFieldWrap(TextArea);