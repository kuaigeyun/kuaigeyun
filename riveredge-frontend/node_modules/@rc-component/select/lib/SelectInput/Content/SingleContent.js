"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = require("clsx");
var _Input = _interopRequireDefault(require("../Input"));
var _context = require("../context");
var _useBaseProps = _interopRequireDefault(require("../../hooks/useBaseProps"));
var _Placeholder = _interopRequireDefault(require("./Placeholder"));
var _SelectContext = _interopRequireDefault(require("../../SelectContext"));
var _commonUtil = require("../../utils/commonUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SingleContent = /*#__PURE__*/React.forwardRef(({
  inputProps
}, ref) => {
  const {
    prefixCls,
    searchValue,
    activeValue,
    displayValues,
    maxLength,
    mode
  } = (0, _context.useSelectInputContext)();
  const {
    triggerOpen,
    title: rootTitle,
    showSearch,
    classNames,
    styles
  } = (0, _useBaseProps.default)();
  const selectContext = React.useContext(_SelectContext.default);
  const [inputChanged, setInputChanged] = React.useState(false);
  const combobox = mode === 'combobox';
  const displayValue = displayValues[0];

  // Implement the same logic as the old SingleSelector
  const mergedSearchValue = React.useMemo(() => {
    if (combobox && activeValue && !inputChanged && triggerOpen) {
      return activeValue;
    }
    return showSearch ? searchValue : '';
  }, [combobox, activeValue, inputChanged, triggerOpen, searchValue, showSearch]);

  // Extract option props, excluding label and value, and handle className/style merging
  const optionProps = React.useMemo(() => {
    let restProps = {
      className: `${prefixCls}-content-value`,
      style: {
        visibility: mergedSearchValue ? 'hidden' : 'visible'
      }
    };
    if (displayValue && selectContext?.flattenOptions) {
      const option = selectContext.flattenOptions.find(opt => opt.value === displayValue.value);
      if (option?.data) {
        const {
          label,
          value,
          className,
          style,
          key,
          ...rest
        } = option.data;
        restProps = {
          ...restProps,
          ...rest,
          title: (0, _commonUtil.getTitle)(option.data),
          className: (0, _clsx.clsx)(restProps.className, className),
          style: {
            ...restProps.style,
            ...style
          }
        };
      }
    }
    if (displayValue && !restProps.title) {
      restProps.title = (0, _commonUtil.getTitle)(displayValue);
    }
    if (rootTitle !== undefined) {
      restProps.title = rootTitle;
    }
    return restProps;
  }, [displayValue, selectContext?.flattenOptions, prefixCls, mergedSearchValue, rootTitle]);
  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _clsx.clsx)(`${prefixCls}-content`, classNames?.content),
    style: styles?.content
  }, displayValue ? /*#__PURE__*/React.createElement("div", optionProps, displayValue.label) : /*#__PURE__*/React.createElement(_Placeholder.default, {
    show: !mergedSearchValue
  }), /*#__PURE__*/React.createElement(_Input.default, _extends({
    ref: ref
  }, inputProps, {
    value: mergedSearchValue,
    maxLength: mode === 'combobox' ? maxLength : undefined,
    onChange: e => {
      setInputChanged(true);
      inputProps.onChange?.(e);
    }
  })));
});
var _default = exports.default = SingleContent;