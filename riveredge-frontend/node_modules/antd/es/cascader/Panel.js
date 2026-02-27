"use client";

import * as React from 'react';
import { Panel } from '@rc-component/cascader';
import { clsx } from 'clsx';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import DisabledContext from '../config-provider/DisabledContext';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import useBase from './hooks/useBase';
import useCheckable from './hooks/useCheckable';
import useColumnIcons from './hooks/useColumnIcons';
import useStyle from './style';
import usePanelStyle from './style/panel';
function CascaderPanel(props) {
  const {
    prefixCls: customizePrefixCls,
    className,
    multiple,
    rootClassName,
    notFoundContent,
    direction,
    expandIcon,
    disabled: customDisabled
  } = props;
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;
  const [prefixCls, cascaderPrefixCls, mergedDirection, renderEmpty] = useBase(customizePrefixCls, direction);
  const rootCls = useCSSVarCls(cascaderPrefixCls);
  const [hashId, cssVarCls] = useStyle(cascaderPrefixCls, rootCls);
  usePanelStyle(cascaderPrefixCls);
  const isRtl = mergedDirection === 'rtl';
  // ===================== Icon ======================
  const [mergedExpandIcon, loadingIcon] = useColumnIcons(prefixCls, isRtl, expandIcon);
  // ===================== Empty =====================
  const mergedNotFoundContent = notFoundContent || renderEmpty?.('Cascader') || (/*#__PURE__*/React.createElement(DefaultRenderEmpty, {
    componentName: "Cascader"
  }));
  // =================== Multiple ====================
  const checkable = useCheckable(cascaderPrefixCls, multiple);
  // ==================== Render =====================
  return /*#__PURE__*/React.createElement(Panel, {
    ...props,
    checkable: checkable,
    prefixCls: cascaderPrefixCls,
    className: clsx(className, hashId, rootClassName, cssVarCls, rootCls),
    notFoundContent: mergedNotFoundContent,
    direction: mergedDirection,
    expandIcon: mergedExpandIcon,
    loadingIcon: loadingIcon,
    disabled: mergedDisabled
  });
}
export default CascaderPanel;