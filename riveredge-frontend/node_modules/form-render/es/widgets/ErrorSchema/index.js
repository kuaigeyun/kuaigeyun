import "antd/es/config-provider/style";
import _ConfigProvider from "antd/es/config-provider";
import React, { useContext } from "react";
import { translation } from '../utils';
var ErrorSchema = function ErrorSchema(schema) {
  var configCtx = useContext(_ConfigProvider.ConfigContext);
  var t = translation(configCtx);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'red'
    }
  }, t('schema_not_match')), /*#__PURE__*/React.createElement("div", null, JSON.stringify(schema)));
};
export default ErrorSchema;