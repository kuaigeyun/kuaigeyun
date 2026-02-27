"use client";

import * as React from 'react';
import { Panel } from '@rc-component/dialog';
import { clsx } from 'clsx';
import { withPureRenderTheme } from '../_util/PurePanel';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import { ConfirmContent } from './ConfirmDialog';
import { Footer, renderCloseIcon } from './shared';
import useStyle from './style';
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
  } = React.useContext(ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const prefixCls = customizePrefixCls || getPrefixCls('modal');
  const rootCls = useCSSVarCls(rootPrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const confirmPrefixCls = `${prefixCls}-confirm`;
  // Choose target props by confirm mark
  let additionalProps = {};
  if (type) {
    additionalProps = {
      closable: closable ?? false,
      title: '',
      footer: '',
      children: (/*#__PURE__*/React.createElement(ConfirmContent, {
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
      footer: footer !== null && /*#__PURE__*/React.createElement(Footer, {
        ...props
      }),
      children
    };
  }
  return /*#__PURE__*/React.createElement(Panel, {
    prefixCls: prefixCls,
    className: clsx(hashId, `${prefixCls}-pure-panel`, type && confirmPrefixCls, type && `${confirmPrefixCls}-${type}`, className, cssVarCls, rootCls),
    ...restProps,
    closeIcon: renderCloseIcon(prefixCls, closeIcon),
    closable: closable,
    ...additionalProps
  });
};
export default withPureRenderTheme(PurePanel);