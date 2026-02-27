"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _checkbox = _interopRequireDefault(require("@rc-component/checkbox"));
var _ref = require("@rc-component/util/lib/ref");
var _clsx = require("clsx");
var _hooks = require("../_util/hooks");
var _isNonNullable = _interopRequireDefault(require("../_util/isNonNullable"));
var _warning = require("../_util/warning");
var _wave = _interopRequireDefault(require("../_util/wave"));
var _interface = require("../_util/wave/interface");
var _context = require("../config-provider/context");
var _DisabledContext = _interopRequireDefault(require("../config-provider/DisabledContext"));
var _useCSSVarCls = _interopRequireDefault(require("../config-provider/hooks/useCSSVarCls"));
var _context2 = require("../form/context");
var _GroupContext = _interopRequireDefault(require("./GroupContext"));
var _style = _interopRequireDefault(require("./style"));
var _useBubbleLock = _interopRequireDefault(require("./useBubbleLock"));
const InternalCheckbox = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    children,
    indeterminate = false,
    style,
    onMouseEnter,
    onMouseLeave,
    skipGroup = false,
    disabled,
    classNames,
    styles,
    ...restProps
  } = props;
  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles
  } = (0, _context.useComponentConfig)('checkbox');
  const checkboxGroup = React.useContext(_GroupContext.default);
  const {
    isFormItemInput
  } = React.useContext(_context2.FormItemInputContext);
  const contextDisabled = React.useContext(_DisabledContext.default);
  const mergedDisabled = (checkboxGroup?.disabled || disabled) ?? contextDisabled;
  // =========== Merged Props for Semantic ==========
  const mergedProps = {
    ...props,
    indeterminate,
    disabled: mergedDisabled
  };
  const [mergedClassNames, mergedStyles] = (0, _hooks.useMergeSemantic)([contextClassNames, classNames], [contextStyles, styles], {
    props: mergedProps
  });
  const prevValue = React.useRef(restProps.value);
  const checkboxRef = React.useRef(null);
  const mergedRef = (0, _ref.composeRef)(ref, checkboxRef);
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Checkbox');
    process.env.NODE_ENV !== "production" ? warning('checked' in restProps || !!checkboxGroup || !('value' in restProps), 'usage', '`value` is not a valid prop, do you mean `checked`?') : void 0;
  }
  React.useEffect(() => {
    checkboxGroup?.registerValue(restProps.value);
  }, []);
  React.useEffect(() => {
    if (skipGroup) {
      return;
    }
    if (restProps.value !== prevValue.current) {
      checkboxGroup?.cancelValue(prevValue.current);
      checkboxGroup?.registerValue(restProps.value);
      prevValue.current = restProps.value;
    }
    return () => checkboxGroup?.cancelValue(restProps.value);
  }, [restProps.value]);
  React.useEffect(() => {
    if (checkboxRef.current?.input) {
      checkboxRef.current.input.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
  const rootCls = (0, _useCSSVarCls.default)(prefixCls);
  const [hashId, cssVarCls] = (0, _style.default)(prefixCls, rootCls);
  const checkboxProps = {
    ...restProps
  };
  if (checkboxGroup && !skipGroup) {
    checkboxProps.onChange = (...args) => {
      if (restProps.onChange) {
        restProps.onChange.apply(restProps, args);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({
          label: children,
          value: restProps.value
        });
      }
    };
    checkboxProps.name = checkboxGroup.name;
    checkboxProps.checked = checkboxGroup.value.includes(restProps.value);
  }
  const classString = (0, _clsx.clsx)(`${prefixCls}-wrapper`, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
    [`${prefixCls}-wrapper-disabled`]: mergedDisabled,
    [`${prefixCls}-wrapper-in-form-item`]: isFormItemInput
  }, contextClassName, className, mergedClassNames.root, rootClassName, cssVarCls, rootCls, hashId);
  const checkboxClass = (0, _clsx.clsx)(mergedClassNames.icon, {
    [`${prefixCls}-indeterminate`]: indeterminate
  }, _interface.TARGET_CLS, hashId);
  // ============================ Event Lock ============================
  const [onLabelClick, onInputClick] = (0, _useBubbleLock.default)(checkboxProps.onClick);
  // ============================== Render ==============================
  return /*#__PURE__*/React.createElement(_wave.default, {
    component: "Checkbox",
    disabled: mergedDisabled
  }, /*#__PURE__*/React.createElement("label", {
    className: classString,
    style: {
      ...mergedStyles.root,
      ...contextStyle,
      ...style
    },
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onLabelClick
  }, /*#__PURE__*/React.createElement(_checkbox.default, {
    ...checkboxProps,
    onClick: onInputClick,
    prefixCls: prefixCls,
    className: checkboxClass,
    style: mergedStyles.icon,
    disabled: mergedDisabled,
    ref: mergedRef
  }), (0, _isNonNullable.default)(children) && (/*#__PURE__*/React.createElement("span", {
    className: (0, _clsx.clsx)(`${prefixCls}-label`, mergedClassNames.label),
    style: mergedStyles.label
  }, children))));
};
const Checkbox = /*#__PURE__*/React.forwardRef(InternalCheckbox);
if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}
var _default = exports.default = Checkbox;