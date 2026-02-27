"use client";

import * as React from 'react';
import RcCheckbox from '@rc-component/checkbox';
import { composeRef } from "@rc-component/util/es/ref";
import { clsx } from 'clsx';
import { useMergeSemantic } from '../_util/hooks';
import isNonNullable from '../_util/isNonNullable';
import { devUseWarning } from '../_util/warning';
import Wave from '../_util/wave';
import { TARGET_CLS } from '../_util/wave/interface';
import { useComponentConfig } from '../config-provider/context';
import DisabledContext from '../config-provider/DisabledContext';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import { FormItemInputContext } from '../form/context';
import GroupContext from './GroupContext';
import useStyle from './style';
import useBubbleLock from './useBubbleLock';
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
  } = useComponentConfig('checkbox');
  const checkboxGroup = React.useContext(GroupContext);
  const {
    isFormItemInput
  } = React.useContext(FormItemInputContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = (checkboxGroup?.disabled || disabled) ?? contextDisabled;
  // =========== Merged Props for Semantic ==========
  const mergedProps = {
    ...props,
    indeterminate,
    disabled: mergedDisabled
  };
  const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames], [contextStyles, styles], {
    props: mergedProps
  });
  const prevValue = React.useRef(restProps.value);
  const checkboxRef = React.useRef(null);
  const mergedRef = composeRef(ref, checkboxRef);
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Checkbox');
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
  const rootCls = useCSSVarCls(prefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls);
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
  const classString = clsx(`${prefixCls}-wrapper`, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
    [`${prefixCls}-wrapper-disabled`]: mergedDisabled,
    [`${prefixCls}-wrapper-in-form-item`]: isFormItemInput
  }, contextClassName, className, mergedClassNames.root, rootClassName, cssVarCls, rootCls, hashId);
  const checkboxClass = clsx(mergedClassNames.icon, {
    [`${prefixCls}-indeterminate`]: indeterminate
  }, TARGET_CLS, hashId);
  // ============================ Event Lock ============================
  const [onLabelClick, onInputClick] = useBubbleLock(checkboxProps.onClick);
  // ============================== Render ==============================
  return /*#__PURE__*/React.createElement(Wave, {
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
  }, /*#__PURE__*/React.createElement(RcCheckbox, {
    ...checkboxProps,
    onClick: onInputClick,
    prefixCls: prefixCls,
    className: checkboxClass,
    style: mergedStyles.icon,
    disabled: mergedDisabled,
    ref: mergedRef
  }), isNonNullable(children) && (/*#__PURE__*/React.createElement("span", {
    className: clsx(`${prefixCls}-label`, mergedClassNames.label),
    style: mergedStyles.label
  }, children))));
};
const Checkbox = /*#__PURE__*/React.forwardRef(InternalCheckbox);
if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}
export default Checkbox;