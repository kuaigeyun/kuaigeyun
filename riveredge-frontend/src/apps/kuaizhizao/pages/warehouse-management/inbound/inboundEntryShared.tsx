/**
 * 入库取单录入页 — 共享表单项与入库人选择
 *
 * 入库人/出库人选择以用户数字 ID 为真源（与后端 receiver_id 一致），
 * 始终提供可搜索下拉，禁止因缺少 uuid 退化成只读文案。
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Button, Form, Input, Select, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useDebounceFn } from 'ahooks';
import { uploadMultipleFiles } from '../../../../../services/file';
import { getUserList, searchUserDisplay, type User, type UserDisplayItem } from '../../../../../services/user';
import {
  canPickUsersForDisplay,
  canReadUserDirectory,
  formatUserDisplayLabel,
} from '../../../../../utils/userDisplay';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser';

export const readOnlyFieldProps = {
  readOnly: true,
  variant: 'borderless' as const,
  tabIndex: -1,
};

export function ReadOnlyFormValue({ value }: { value?: React.ReactNode }) {
  const text = value == null || value === '' ? '—' : value;
  return <Input {...readOnlyFieldProps} value={String(text)} />;
}

export type WarehouseSelectOption = { label: string; value: number; name: string };

export function mapWarehouseSelectOptions(whRes: unknown): WarehouseSelectOption[] {
  const whList = Array.isArray(whRes) ? whRes : (whRes as { items?: unknown[] })?.items ?? [];
  return (Array.isArray(whList) ? whList : []).map((w) => {
    const row = w as { id: number; name?: string };
    return {
      label: String(row.name || '').trim() || String(row.id),
      value: row.id,
      name: row.name || '',
    };
  });
}

function displayItemToUser(item: UserDisplayItem): User {
  return {
    id: item.id,
    uuid: item.uuid,
    username: item.username,
    full_name: item.full_name ?? undefined,
    is_active: true,
    is_tenant_admin: false,
    tenant_id: 0,
    created_at: '',
    updated_at: '',
    department_uuid: item.department_uuid ?? undefined,
  };
}

type InboundReceiverOption = {
  label: string;
  /** 用户数字 ID（Select value / 提交 receiver_id） */
  value: number;
  name: string;
  uuid?: string;
};

function userOptionFromUser(user: User): InboundReceiverOption | null {
  const id = Number(user.id);
  if (!Number.isFinite(id) || id <= 0) return null;
  const name = String(user.full_name || user.username || '').trim();
  return {
    label: formatUserDisplayLabel(user),
    value: id,
    name: name || String(id),
    uuid: user.uuid || undefined,
  };
}

function parseUidToken(token: string | undefined): number | undefined {
  if (!token) return undefined;
  if (token.startsWith('__uid:')) {
    const n = Number(token.slice(6));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
  return undefined;
}

export function buildInboundConfirmReceiverPayload(hook: {
  receiverId?: number;
  receiverName: string;
}): { receiver_id?: number; receiver_name?: string } {
  const name = String(hook.receiverName ?? '').trim();
  const id = hook.receiverId;
  if (id != null && id > 0) {
    return { receiver_id: id, receiver_name: name || undefined };
  }
  return name ? { receiver_name: name } : {};
}

export function resolveInboundConfirmReceiverFromDetail(detail: Record<string, unknown> | null | undefined): {
  id?: number;
  name?: string;
} {
  if (!detail) return {};
  const rawId = detail.receiver_id ?? detail.returner_id ?? detail.received_by;
  const rawName = detail.receiver_name ?? detail.returner_name ?? detail.received_by_name;
  const id = rawId != null && Number(rawId) > 0 ? Number(rawId) : undefined;
  const name = String(rawName ?? '').trim() || undefined;
  return { id, name };
}

export function useInboundReceiverSelect() {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const currentUser = useCurrentUser();
  const canPick = canPickUsersForDisplay(currentUser);
  const useFullUserList = canReadUserDirectory(currentUser);

  const [receiverId, setReceiverId] = useState<number | undefined>();
  const [receiverName, setReceiverName] = useState('');
  const [receiverUuid, setReceiverUuid] = useState<string | undefined>();
  const [receiverOptions, setReceiverOptions] = useState<InboundReceiverOption[]>([]);
  const [receiverLoading, setReceiverLoading] = useState(false);

  const applyUser = useCallback((id: number | undefined, name: string, uuid?: string) => {
    setReceiverId(id);
    setReceiverName(name);
    if (uuid) {
      setReceiverUuid(uuid);
    } else if (id != null && id > 0) {
      setReceiverUuid(`__uid:${id}`);
    } else {
      setReceiverUuid(undefined);
    }
  }, []);

  const applyCurrentUserAsReceiver = useCallback(() => {
    if (!currentUser) {
      applyUser(undefined, '');
      return;
    }
    const id = currentUser.id != null && currentUser.id > 0 ? currentUser.id : undefined;
    const name = String(currentUser.full_name || currentUser.username || '').trim();
    applyUser(id, name, currentUser.uuid);
  }, [applyUser, currentUser]);

  const loadReceiverOptions = useCallback(
    async (keyword = '') => {
      if (!canPick) return;
      setReceiverLoading(true);
      try {
        let users: User[] = [];
        if (useFullUserList) {
          const response = await getUserList({
            page: 1,
            page_size: 50,
            keyword,
            is_active: true,
          });
          users = response.items || [];
        } else {
          const response = await searchUserDisplay({
            page: 1,
            page_size: 50,
            keyword: keyword || undefined,
            is_active: true,
          });
          users = (response.items || []).map(displayItemToUser);
        }
        setReceiverOptions(
          users.map(userOptionFromUser).filter((opt): opt is InboundReceiverOption => opt != null),
        );
      } catch {
        messageApi.error(t('app.kuaizhizao.warehouseInbound.msg.loadUsersFailed'));
      } finally {
        setReceiverLoading(false);
      }
    },
    [canPick, messageApi, t, useFullUserList],
  );

  const { run: debounceLoadReceiverOptions } = useDebounceFn(
    (keyword: string) => {
      void loadReceiverOptions(keyword);
    },
    { wait: 300 },
  );

  const receiverSelectOptions = useMemo(() => {
    if (
      receiverId != null &&
      receiverId > 0 &&
      !receiverOptions.some((opt) => opt.value === receiverId)
    ) {
      const label = receiverName || String(receiverId);
      return [
        {
          label,
          value: receiverId,
          name: label,
          uuid: receiverUuid?.startsWith('__uid:') ? undefined : receiverUuid,
        },
        ...receiverOptions,
      ];
    }
    return receiverOptions;
  }, [receiverId, receiverName, receiverOptions, receiverUuid]);

  useEffect(() => {
    if (!currentUser || receiverId != null || receiverUuid) return;
    applyCurrentUserAsReceiver();
  }, [applyCurrentUserAsReceiver, currentUser, receiverId, receiverUuid]);

  useEffect(() => {
    if (receiverId != null || !receiverUuid) return;
    const fromToken = parseUidToken(receiverUuid);
    if (fromToken != null) {
      setReceiverId(fromToken);
      return;
    }
    const match = receiverOptions.find((o) => o.uuid === receiverUuid);
    if (match) {
      setReceiverId(match.value);
      if (!receiverName) setReceiverName(match.name);
    }
  }, [receiverId, receiverName, receiverOptions, receiverUuid]);

  useEffect(() => {
    if (!canPick) return;
    void loadReceiverOptions();
  }, [canPick, loadReceiverOptions]);

  const handleReceiverChange = useCallback(
    (id: number) => {
      const picked = receiverSelectOptions.find((opt) => opt.value === id);
      applyUser(id, picked?.name || String(id), picked?.uuid);
    },
    [applyUser, receiverSelectOptions],
  );

  /**
   * 兼容：
   * - restoreReceiver({ id, name, uuid })
   * - restoreReceiver(uuid, name) 出库草稿旧调用
   * - restoreReceiver({}) / restoreReceiver() 重置为当前登录人
   */
  const restoreReceiver = useCallback(
    (
      optsOrUuid?: { uuid?: string; id?: number; name?: string } | string | null,
      nameArg?: string,
    ) => {
      if (optsOrUuid == null || optsOrUuid === '') {
        applyCurrentUserAsReceiver();
        return;
      }
      if (typeof optsOrUuid === 'string') {
        const fromToken = parseUidToken(optsOrUuid);
        const name = nameArg !== undefined ? nameArg : receiverName;
        if (fromToken != null) {
          applyUser(fromToken, name || String(fromToken), optsOrUuid);
          return;
        }
        setReceiverUuid(optsOrUuid);
        if (nameArg !== undefined) setReceiverName(nameArg);
        return;
      }
      const hasId = optsOrUuid.id != null && optsOrUuid.id > 0;
      const hasUuid = Boolean(optsOrUuid.uuid);
      const hasName = optsOrUuid.name !== undefined;
      if (!hasId && !hasUuid && !hasName) {
        applyCurrentUserAsReceiver();
        return;
      }
      const id =
        hasId
          ? Number(optsOrUuid.id)
          : parseUidToken(optsOrUuid.uuid) ?? receiverId;
      const name = hasName ? String(optsOrUuid.name ?? '').trim() : receiverName;
      applyUser(
        id != null && id > 0 ? id : undefined,
        name,
        optsOrUuid.uuid || (id != null && id > 0 ? `__uid:${id}` : undefined),
      );
    },
    [applyCurrentUserAsReceiver, applyUser, receiverId, receiverName],
  );

  return {
    currentUser,
    canPickUsers: canPick,
    receiverUuid,
    receiverId,
    receiverName,
    receiverLoading,
    receiverSelectOptions,
    debounceLoadReceiverOptions,
    handleReceiverChange,
    restoreReceiver,
  };
}

type InboundEntryReceiverFieldProps = {
  label?: string;
  hook: ReturnType<typeof useInboundReceiverSelect>;
};

export function InboundEntryReceiverField({ label, hook }: InboundEntryReceiverFieldProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('app.kuaizhizao.warehouseInbound.field.receiver');
  const {
    canPickUsers,
    receiverId,
    receiverName,
    receiverLoading,
    receiverSelectOptions,
    debounceLoadReceiverOptions,
    handleReceiverChange,
  } = hook;

  return (
    <Form.Item label={resolvedLabel} required>
      {canPickUsers ? (
        <Select
          style={{ width: '100%' }}
          placeholder={t('app.kuaizhizao.warehouseInbound.field.selectReceiver', {
            label: resolvedLabel,
          })}
          showSearch
          allowClear={false}
          filterOption={false}
          loading={receiverLoading}
          value={receiverId}
          options={receiverSelectOptions}
          optionFilterProp="label"
          onSearch={debounceLoadReceiverOptions}
          onChange={handleReceiverChange}
        />
      ) : (
        <ReadOnlyFormValue value={receiverName} />
      )}
    </Form.Item>
  );
}

type InboundEntryAttachmentsSectionProps = {
  category: string;
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
};

export function InboundEntryAttachmentsSection({
  category,
  fileList,
  onChange,
}: InboundEntryAttachmentsSectionProps) {
  const { t } = useTranslation();
  return (
    <Form.Item label={t('app.kuaizhizao.warehouseInbound.field.attachments')}>
      <Upload
        fileList={fileList}
        onChange={({ fileList: next }) => onChange(next)}
        customRequest={async (options) => {
          try {
            const res = await uploadMultipleFiles([options.file as File], { category });
            options.onSuccess?.(res[0], options.file as File);
          } catch (err) {
            options.onError?.(err as Error);
          }
        }}
        multiple
      >
        <Button>{t('app.kuaizhizao.warehouseInbound.action.uploadAttachments')}</Button>
      </Upload>
    </Form.Item>
  );
}

type InboundEntryRemarksSectionProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export function InboundEntryRemarksSection({
  value,
  onChange,
  label,
  placeholder,
}: InboundEntryRemarksSectionProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('app.kuaizhizao.warehouseInbound.field.inboundRemarks');
  const resolvedPlaceholder =
    placeholder ?? t('app.kuaizhizao.warehouseInbound.field.inboundRemarksPlaceholder');
  return (
    <Form.Item label={resolvedLabel}>
      <Input.TextArea
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={500}
        showCount
      />
    </Form.Item>
  );
}
