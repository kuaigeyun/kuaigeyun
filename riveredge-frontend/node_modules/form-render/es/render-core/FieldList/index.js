import "antd/es/form/style";
import _Form from "antd/es/form";
import { __rest } from "tslib";
import React, { useContext } from 'react';
import { FRContext, ConfigContext } from '../../models/context';
import { isHasExpression, parseAllExpression } from '../../models/expression';
import fieldShouldUpdate from '../../models/fieldShouldUpdate';
import Main from './main';
export default (function (props) {
  var _a;
  var schema = props.schema,
    rootPath = props.rootPath;
  var _b = schema || {},
    items = _b.items,
    listSchema = __rest(_b, ["items"]);
  var store = useContext(FRContext);
  var _store$getState = store.getState(),
    formSchema = _store$getState.schema;
  var configCtx = useContext(ConfigContext);
  var mustacheDisabled = (_a = configCtx === null || configCtx === void 0 ? void 0 : configCtx.globalConfig) === null || _a === void 0 ? void 0 : _a.mustacheDisabled;
  var dependencies = schema === null || schema === void 0 ? void 0 : schema.dependencies;
  // No function expressions exist
  if (!isHasExpression(schema) && !mustacheDisabled && (!dependencies || !(dependencies === null || dependencies === void 0 ? void 0 : dependencies.length))) {
    return /*#__PURE__*/React.createElement(Main, Object.assign({
      configContext: configCtx
    }, props));
  }
  // Need to listen to form values for dynamic rendering
  return /*#__PURE__*/React.createElement(_Form.Item, {
    noStyle: true,
    shouldUpdate: fieldShouldUpdate(JSON.stringify(listSchema || {}), rootPath, dependencies, true)
  }, function (form) {
    var formData = form.getFieldsValue(true);
    var newListSchema = mustacheDisabled ? schema : parseAllExpression(listSchema, formData, rootPath, formSchema);
    return /*#__PURE__*/React.createElement(Main, Object.assign({
      configContext: configCtx
    }, props, {
      schema: Object.assign({
        items: items
      }, newListSchema),
      rootPath: rootPath
    }));
  });
});