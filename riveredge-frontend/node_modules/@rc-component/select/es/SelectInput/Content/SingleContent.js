function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import * as React from 'react';
import { clsx } from 'clsx';
import Input from "../Input";
import { useSelectInputContext } from "../context";
import useBaseProps from "../../hooks/useBaseProps";
import Placeholder from "./Placeholder";
import SelectContext from "../../SelectContext";
import { getTitle } from "../../utils/commonUtil";
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
  } = useSelectInputContext();
  const {
    triggerOpen,
    title: rootTitle,
    showSearch,
    classNames,
    styles
  } = useBaseProps();
  const selectContext = React.useContext(SelectContext);
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
          title: getTitle(option.data),
          className: clsx(restProps.className, className),
          style: {
            ...restProps.style,
            ...style
          }
        };
      }
    }
    if (displayValue && !restProps.title) {
      restProps.title = getTitle(displayValue);
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
    className: clsx(`${prefixCls}-content`, classNames?.content),
    style: styles?.content
  }, displayValue ? /*#__PURE__*/React.createElement("div", optionProps, displayValue.label) : /*#__PURE__*/React.createElement(Placeholder, {
    show: !mergedSearchValue
  }), /*#__PURE__*/React.createElement(Input, _extends({
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
export default SingleContent;