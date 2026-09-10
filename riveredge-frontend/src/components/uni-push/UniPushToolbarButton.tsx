/**
 * uni-push 列表工具栏「下推」主按钮：
 * - 紧跟「新建 / uni-pull」之后
 * - type="primary"、size="medium"、ArrowDownOutlined
 * - 选中态不合法时整钮禁用；选中单条后应展示全部下推项，不可操作项置灰（disabled + title）
 * - 下推菜单项不使用 icon，以完整文案区分目标单据
 * - 传入 sourceDocument + pushTargets 时：打开菜单拉取下游关联；
 *   已下推单据以右侧级联子菜单展示编号，可点击打开详情
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Tag, Tooltip } from 'antd';
import type { ButtonProps, MenuProps } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getDocumentRelations } from '../../apps/kuaizhizao/services/document-relation';
import { useOptionalLinkedDocumentDetail } from '../linked-document-detail/LinkedDocumentDetailContext';
import { canOpenLinkedDocumentDetail } from '../../apps/kuaizhizao/utils/linkedDocumentDetail';
import type { UniPushLinkedDocument, UniPushSourceDocument } from './index';

export type UniPushMenuItem = NonNullable<MenuProps['items']>[number];

export interface UniPushToolbarButtonProps {
  menuItems: UniPushMenuItem[];
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  buttonText?: React.ReactNode;
  size?: ButtonProps['size'];
  /**
   * 当前选中源单据；与 pushTargets 一起启用「已下推单据编号」展示。
   */
  sourceDocument?: UniPushSourceDocument | null;
  /**
   * 菜单 key → 下游单据类型（或类型列表）。
   * 打开菜单时按类型匹配 document-relations 下游并展示编号。
   */
  pushTargets?: Record<string, string | string[]>;
}

function normalizeTargetTypes(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((t) => String(t || '').trim()).filter(Boolean);
}

export const UniPushToolbarButton: React.FC<UniPushToolbarButtonProps> = ({
  menuItems,
  disabled = false,
  disabledReason,
  buttonText,
  size = 'medium',
  sourceDocument = null,
  pushTargets,
}) => {
  const { t } = useTranslation();
  const linkedCtx = useOptionalLinkedDocumentDetail();
  const label = buttonText ?? t('components.uniPush.push');
  const [open, setOpen] = useState(false);
  const [downstreamByType, setDownstreamByType] = useState<Record<string, UniPushLinkedDocument[]>>({});
  const fetchSeqRef = useRef(0);

  const hasTargetMeta = useMemo(() => {
    if (pushTargets && Object.keys(pushTargets).length > 0) return true;
    return (menuItems || []).some((item) => {
      if (!item || typeof item !== 'object') return false;
      if ((item as { type?: string }).type === 'divider') return false;
      const raw = (item as { targetDocumentType?: string | string[] }).targetDocumentType;
      return normalizeTargetTypes(raw).length > 0;
    });
  }, [menuItems, pushTargets]);

  const enrichEnabled = Boolean(sourceDocument?.type && sourceDocument?.id && hasTargetMeta);

  useEffect(() => {
    if (!open || !enrichEnabled || !sourceDocument) {
      return;
    }
    const seq = ++fetchSeqRef.current;
    getDocumentRelations(sourceDocument.type, sourceDocument.id)
      .then((data) => {
        if (seq !== fetchSeqRef.current) return;
        const map: Record<string, UniPushLinkedDocument[]> = {};
        for (const rel of data.downstream_documents || []) {
          const docType = String(rel.document_type || '').trim();
          const docId = Number(rel.document_id);
          if (!docType || !Number.isFinite(docId) || docId <= 0) continue;
          const list = map[docType] || (map[docType] = []);
          if (list.some((d) => d.documentId === docId)) continue;
          list.push({
            documentType: docType,
            documentId: docId,
            documentCode: String(rel.document_code || '').trim() || undefined,
            isDeleted: Boolean(rel.is_deleted),
          });
        }
        setDownstreamByType(map);
      })
      .catch(() => {
        if (seq !== fetchSeqRef.current) return;
        setDownstreamByType({});
      });
  }, [enrichEnabled, open, sourceDocument?.id, sourceDocument?.type]);

  useEffect(() => {
    setDownstreamByType({});
  }, [sourceDocument?.id, sourceDocument?.type]);

  const openPushedDoc = useCallback(
    (doc: UniPushLinkedDocument) => {
      linkedCtx?.openLinkedDocumentDetail(doc.documentType, doc.documentId);
      setOpen(false);
    },
    [linkedCtx],
  );

  const enrichedMenuItems = useMemo(() => {
    if (!enrichEnabled) return menuItems;
    return (menuItems || []).map((item) => {
      if (!item || typeof item !== 'object') return item;
      if ((item as { type?: string }).type === 'divider') return item;
      const key = String((item as { key?: React.Key }).key ?? '');
      const fromItem = (item as { targetDocumentType?: string | string[] }).targetDocumentType;
      const targetTypes = normalizeTargetTypes(pushTargets?.[key] ?? fromItem);
      if (targetTypes.length === 0) return item;

      const docs: UniPushLinkedDocument[] = [];
      for (const tt of targetTypes) {
        for (const d of downstreamByType[tt] || []) {
          if (!docs.some((x) => x.documentId === d.documentId && x.documentType === d.documentType)) {
            docs.push(d);
          }
        }
      }
      if (docs.length === 0) return item;

      const originalLabel = (item as { label?: React.ReactNode }).label;
      const wasDisabled = Boolean((item as { disabled?: boolean }).disabled);
      const originalOnClick = (item as { onClick?: MenuProps['onClick'] }).onClick;
      const originalTitle = (item as { title?: React.ReactNode }).title;

      const children: NonNullable<MenuProps['items']> = [];

      if (!wasDisabled && originalOnClick) {
        children.push({
          key: `${key}__do-push`,
          label: t('components.uniPush.doPush'),
          onClick: originalOnClick,
        });
        children.push({ type: 'divider' });
      }

      children.push({
        type: 'group',
        label: t('components.uniPush.alreadyPushed'),
        children: docs.map((doc) => {
          const code = doc.documentCode || `#${doc.documentId}`;
          const deleted = Boolean(doc.isDeleted);
          const canOpen = !deleted && canOpenLinkedDocumentDetail(doc.documentType);
          return {
            key: `${key}__doc-${doc.documentType}-${doc.documentId}`,
            label: (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  maxWidth: 280,
                }}
              >
                <span
                  style={{
                    textDecoration: deleted ? 'line-through' : undefined,
                    opacity: deleted ? 0.65 : 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {code}
                </span>
                {deleted ? (
                  <Tag color="error" style={{ margin: 0, lineHeight: '16px', fontSize: 11 }}>
                    {t('components.uniPush.pushedDocDeleted')}
                  </Tag>
                ) : null}
              </span>
            ),
            title: deleted
              ? t('components.uniPush.pushedDocDeletedHint')
              : canOpen
                ? t('components.uniPush.openPushedDetail')
                : code,
            disabled: !canOpen,
            onClick: canOpen
              ? () => {
                  openPushedDoc(doc);
                }
              : undefined,
          };
        }),
      });

      return {
        ...item,
        // 有子菜单时父项不可 disabled，否则无法展开右侧
        disabled: false,
        title: wasDisabled ? originalTitle : undefined,
        label: wasDisabled ? (
          <span style={{ opacity: 0.55, color: 'var(--ant-color-text-disabled)' }}>{originalLabel}</span>
        ) : (
          originalLabel
        ),
        // 父项点击只展开子菜单，不再直接执行下推
        onClick: undefined,
        children,
        popupClassName: 'uni-push-submenu-popup',
      };
    });
  }, [downstreamByType, enrichEnabled, menuItems, openPushedDoc, pushTargets, t]);

  const resolvedDisabledReason = useMemo(() => {
    if (!disabled) return undefined;
    if (disabledReason) return disabledReason;
    const actionItems = (menuItems || []).filter(
      (item): item is Exclude<UniPushMenuItem, null> =>
        !!item && typeof item === 'object' && (item as { type?: string }).type !== 'divider',
    ) as Array<{ disabled?: boolean; title?: React.ReactNode }>;
    if (actionItems.length === 0) {
      return t('components.uniPush.disabled.noActions', { defaultValue: '当前无可用下推操作' });
    }
    const hasEnabled = actionItems.some((item) => item.disabled !== true);
    if (hasEnabled) {
      return t('components.uniPush.disabled.selection', { defaultValue: '请先选择一条可下推单据' });
    }
    const firstTitle = actionItems.find((item) => item.disabled && item.title != null)?.title;
    if (typeof firstTitle === 'string' && firstTitle.trim()) return firstTitle;
    return t('components.uniPush.disabled.unavailable', { defaultValue: '当前状态不可下推' });
  }, [disabled, disabledReason, menuItems, t]);

  const button = (
    <Button type="primary" icon={<ArrowDownOutlined />} size={size} disabled={disabled}>
      {label}
    </Button>
  );

  return (
    <Dropdown
      trigger={['click']}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
      menu={{
        items: enrichedMenuItems,
        // 悬停展开右侧子菜单，贴近三级菜单操作习惯
        triggerSubMenuAction: 'hover',
      }}
    >
      {disabled && resolvedDisabledReason ? <Tooltip title={resolvedDisabledReason}>{button}</Tooltip> : button}
    </Dropdown>
  );
};

export default UniPushToolbarButton;
