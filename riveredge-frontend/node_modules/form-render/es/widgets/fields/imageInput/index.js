import "antd/es/input/style";
import _Input from "antd/es/input";
import _PictureOutlined from "@ant-design/icons/lib/icons/PictureOutlined";
import "antd/es/popover/style";
import _Popover from "antd/es/popover";
import "antd/es/config-provider/style";
import _ConfigProvider from "antd/es/config-provider";
import { __rest } from "tslib";
import React, { useContext } from 'react';
import { translation } from '../../utils';
import withFieldWrap from '../../utils/withFieldWrap';
import "./index.css";
var DEFAULT_IMG = 'https://img.alicdn.com/tfs/TB14tSiKhTpK1RjSZFKXXa2wXXa-354-330.png';
var PreviewNode = function PreviewNode(_ref) {
  var value = _ref.value;
  var configCtx = useContext(_ConfigProvider.ConfigContext);
  var t = translation(configCtx);
  return /*#__PURE__*/React.createElement(_Popover, {
    content: /*#__PURE__*/React.createElement("img", {
      src: value || DEFAULT_IMG,
      alt: t('img_src_error'),
      className: 'fr-preview-image'
    }),
    className: 'fr-preview',
    placement: 'bottom'
  }, /*#__PURE__*/React.createElement(_PictureOutlined, null));
};
var ImageInput = function ImageInput(_a) {
  var value = _a.value,
    rest = __rest(_a, ["value"]);
  return /*#__PURE__*/React.createElement(_Input, Object.assign({
    value: value,
    addonAfter: /*#__PURE__*/React.createElement(PreviewNode, {
      value: value
    })
  }, rest));
};
export default withFieldWrap(ImageInput);