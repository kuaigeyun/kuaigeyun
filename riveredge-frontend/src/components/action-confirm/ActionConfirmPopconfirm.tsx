import React from 'react';
import { Popconfirm, type PopconfirmProps } from 'antd';

export type ActionConfirmPopconfirmProps = Omit<PopconfirmProps, 'onConfirm' | 'onCancel'> & {
  onConfirm: () => void | Promise<void>;
  onCancel?: PopconfirmProps['onCancel'];
  children: React.ReactElement;
};

/**
 * 行内 / 工具栏纯确认：气泡贴触发器，禁止 Modal.confirm 遮罩整页。
 * 字符串补充说明走 description（原 modal content 文本）。
 *
 * 默认挂到 document.body，避免 UniTable 操作列 overflow / 固定列裁切后「点了没反应」。
 */
export function ActionConfirmPopconfirm({
  onConfirm,
  onCancel,
  getPopupContainer,
  children,
  ...rest
}: ActionConfirmPopconfirmProps) {
  return (
    <Popconfirm
      {...rest}
      getPopupContainer={
        getPopupContainer ?? ((node) => node?.ownerDocument?.body ?? document.body)
      }
      onConfirm={(e) => {
        e?.stopPropagation();
        return onConfirm();
      }}
      onCancel={(e) => {
        e?.stopPropagation();
        onCancel?.(e);
      }}
    >
      {children}
    </Popconfirm>
  );
}

ActionConfirmPopconfirm.displayName = 'ActionConfirmPopconfirm';

export default ActionConfirmPopconfirm;
