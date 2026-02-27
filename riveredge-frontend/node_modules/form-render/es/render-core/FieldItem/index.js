import "antd/es/form/style";
import _Form from "antd/es/form";
import { __rest } from "tslib";
import React, { useContext } from 'react';
import { getDependValues } from './module';
import { FRContext, ConfigContext } from '../../models/context';
import { isHasExpression, parseAllExpression } from '../../models/expression';
import fieldShouldUpdate from '../../models/fieldShouldUpdate';
import Main from './main';
export default (function (props) {
  var _a, _b;
  var schema = props.schema,
    rootPath = props.rootPath,
    restProps = __rest(props, ["schema", "rootPath"]);
  var store = useContext(FRContext);
  var _store$getState = store.getState(),
    formSchema = _store$getState.schema;
  var configCtx = useContext(ConfigContext);
  var mustacheDisabled = (_a = configCtx === null || configCtx === void 0 ? void 0 : configCtx.globalConfig) === null || _a === void 0 ? void 0 : _a.mustacheDisabled;
  var shouldUpdateOpen = (_b = configCtx === null || configCtx === void 0 ? void 0 : configCtx.globalConfig) === null || _b === void 0 ? void 0 : _b.shouldUpdateOpen;
  var dependencies = schema === null || schema === void 0 ? void 0 : schema.dependencies;
  // No function expressions exist
  if (!isHasExpression(schema) && !mustacheDisabled && (!dependencies || !(dependencies === null || dependencies === void 0 ? void 0 : dependencies.length))) {
    return /*#__PURE__*/React.createElement(Main, Object.assign({}, props, {
      store: store,
      configCtx: configCtx
    }));
  }
  var schemaStr = JSON.stringify(schema);
  // Need to listen to form values for dynamic rendering
  return /*#__PURE__*/React.createElement(_Form.Item, {
    noStyle: true,
    shouldUpdate: fieldShouldUpdate(schemaStr, rootPath, dependencies, shouldUpdateOpen)
  }, function (form) {
    var formData = form.getFieldsValue(true);
    var formDependencies = [];
    var dependValues = (dependencies || []).map(function (depPath) {
      var item = [];
      formDependencies.push(item);
      return getDependValues(formData, depPath, props, item);
    });
    var newSchema = mustacheDisabled ? schema : parseAllExpression(schema, formData, rootPath, formSchema);
    return /*#__PURE__*/React.createElement(Main, Object.assign({
      schema: Object.assign(Object.assign({}, newSchema), {
        dependencies: formDependencies
      }),
      rootPath: rootPath
    }, restProps, {
      dependValues: dependValues,
      store: store,
      configCtx: configCtx
    }));
  });
});