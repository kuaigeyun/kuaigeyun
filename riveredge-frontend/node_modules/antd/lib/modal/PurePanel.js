"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _dialog = require("@rc-component/dialog");
var _clsx = require("clsx");
var _PurePanel = require("../_util/PurePanel");
var _configProvider = require("../config-provider");
var _useCSSVarCls = _interopRequireDefault(require("../config-provider/hooks/useCSSVarCls"));
var _ConfirmDialog = require("./ConfirmDialog");
var _shared = require("./shared");
var _style = _interopRequireDefault(require("./style"));
const PurePanel = props => {
  const {
    prefixCls: customizePrefixCls,
    className,
    closeIcon,
    closable,
    type,
    title,
    children,
    footer,
    ...restProps
  } = props;
  const {
    getPrefixCls
  } = React.useContext(_configProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const prefixCls = customizePrefixCls || getPrefixCls('modal');
  const rootCls = (0, _useCSSVarCls.default)(rootPrefixCls);
  const [hashId, cssVarCls] = (0, _style.default)(prefixCls, rootCls);
  const confirmPrefixCls = `${prefixCls}-confirm`;
  // Choose target props by confirm mark
  let additionalProps = {};
  if (type) {
    additionalProps = {
      closable: closable ?? false,
      title: '',
      footer: '',
      children: (/*#__PURE__*/React.createElement(_ConfirmDialog.ConfirmContent, {
        ...props,
        prefixCls: prefixCls,
        confirmPrefixCls: confirmPrefixCls,
        rootPrefixCls: rootPrefixCls,
        content: children
      }))
    };
  } else {
    additionalProps = {
      closable: closable ?? true,
      title,
      footer: footer !== null && /*#__PURE__*/React.createElement(_shared.Footer, {
        ...props
      }),
      children
    };
  }
  return /*#__PURE__*/React.createElement(_dialog.Panel, {
    prefixCls: prefixCls,
    className: (0, _clsx.clsx)(hashId, `${prefixCls}-pure-panel`, type && confirmPrefixCls, type && `${confirmPrefixCls}-${type}`, className, cssVarCls, rootCls),
    ...restProps,
    closeIcon: (0, _shared.renderCloseIcon)(prefixCls, closeIcon),
    closable: closable,
    ...additionalProps
  });
};
var _default = exports.default = (0, _PurePanel.withPureRenderTheme)(PurePanel);