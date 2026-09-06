/**
 * 设备换线绑定（R-10 WP-10.7）：选定目标产线 → 纳入设备 → 完成换线并强制初检
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { App, Button, Col, Input, Row, Space } from 'antd';
import { ListPageTemplate, FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { rowActionKind } from '../../../../../components/uni-action';
import { ActionConfirmPopconfirm } from '../../../../../components/action-confirm';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import { useNewShortcut } from '../../../../../hooks/useNewShortcut';
import { withSingleNewShortcutHint } from '../../../../../utils/globalNewShortcut';
import { renderDocumentStatusTag } from '../../../../../utils/documentLifecycleStatusTag';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../../utils/uniTableLayoutColumns';
import { alignProColumns, SALES_DOC_LIST_FIELD_RANK } from '../../sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../shared/documentAuditColumns';
import {
  buildDetailDrawerEditExtra,
  EquipmentMasterDetailDrawer,
  MasterDataLinesTable,
  useEquipmentDetailDrawer,
} from '../shared/equipmentMasterDataDetail';
import { equipmentLineRebindApi } from '../../../services/equipmentLineRebind';
import { equipmentApi } from '../../../services/equipment';
import { productionLineApi, factoryListItems } from '../../../../master-data/services/factory';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import { ROUTES } from '../../../constants/routes';
import { normalizeEquipmentListResponse } from '../../../utils/equipmentListCore';

const P = 'app.kuaizhizao.equipmentLineRebind';
const RESOURCE = 'kuaizhizao:equipment-line-rebind';

interface RebindItem {
  id?: number;
  equipment_id?: number;
  equipment_code?: string;
  equipment_name?: string;
  from_production_line_name?: string;
  force_spot_cleared_at?: string;
}

interface LineRebindRow {
  id?: number;
  document_no?: string;
  production_line_id?: number;
  production_line_code?: string;
  production_line_name?: string;
  force_spot_overdue_hours?: number;
  status?: string;
  completed_at?: string;
  completed_by_name?: string;
  remark?: string;
  item_count?: number;
  items?: RebindItem[];
  updated_at?: string;
}

const EquipmentLineRebindsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lineOptions, setLineOptions] = useState<{ label: string; value: number }[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<{ label: string; value: number }[]>([]);
  const [scanCode, setScanCode] = useState('');
  const [activeHeader, setActiveHeader] = useState<LineRebindRow | null>(null);
  const [workingItems, setWorkingItems] = useState<RebindItem[]>([]);
  const { open: detailVisible, loading: detailLoading, detail, openDetail, closeDetail } =
    useEquipmentDetailDrawer<LineRebindRow>();

  const loadOptions = async () => {
    const [linesRes, eqRes] = await Promise.all([
      productionLineApi.list({ limit: 1000, is_active: true }),
      equipmentApi.list({ limit: 1000, is_active: true }),
    ]);
    setLineOptions(
      factoryListItems(linesRes).map((line: { id: number; code: string; name: string }) => ({
        label: `${line.code} - ${line.name}`,
        value: line.id,
      })),
    );
    const { data } = normalizeEquipmentListResponse(eqRes);
    setEquipmentOptions(
      (data as { id: number; code: string; name: string }[]).map((row) => ({
        label: `${row.code} - ${row.name}`,
        value: row.id,
      })),
    );
  };

  const refreshActive = async (id: number) => {
    const loaded = (await equipmentLineRebindApi.get(id)) as LineRebindRow;
    setActiveHeader(loaded);
    setWorkingItems(loaded.items ?? []);
    return loaded;
  };

  const handleCreate = () => {
    setActiveHeader(null);
    setWorkingItems([]);
    setScanCode('');
    setModalVisible(true);
    void loadOptions();
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({ force_spot_overdue_hours: 4 });
  };
  useNewShortcut(handleCreate);

  const handleDetail = useCallback(
    (record: LineRebindRow) => {
      if (!record.id) return;
      void openDetail(() => equipmentLineRebindApi.get(record.id!) as Promise<LineRebindRow>);
    },
    [openDetail],
  );

  const handleContinue = async (record: LineRebindRow) => {
    if (!record.id || record.status !== '进行中') return;
    const loaded = await refreshActive(record.id);
    setModalVisible(true);
    await loadOptions();
    formRef.current?.setFieldsValue({
      production_line_id: loaded.production_line_id,
      force_spot_overdue_hours: loaded.force_spot_overdue_hours ?? 4,
      remark: loaded.remark,
    });
  };

  const handleCreateSubmit = async (values: Record<string, unknown>) => {
    if (activeHeader?.id) {
      messageApi.success(t('common.updateSuccess'));
      setModalVisible(false);
      actionRef.current?.reload();
      return;
    }
    const created = (await equipmentLineRebindApi.create({
      production_line_id: values.production_line_id,
      force_spot_overdue_hours: Number(values.force_spot_overdue_hours ?? 4),
      remark: values.remark,
      equipment_ids: (values.equipment_ids as number[]) || [],
    })) as LineRebindRow;
    messageApi.success(t('common.createSuccess'));
    await refreshActive(created.id!);
    actionRef.current?.reload();
  };

  const handleScan = async () => {
    if (!activeHeader?.id || !scanCode.trim()) return;
    try {
      await equipmentLineRebindApi.scan(activeHeader.id, { scan_code: scanCode.trim() });
      setScanCode('');
      await refreshActive(activeHeader.id);
      messageApi.success(t(`${P}.scanOk`));
    } catch (error: unknown) {
      messageApi.error(getApiErrorMessage(error, t(`${P}.scanFailed`)));
    }
  };

  const handleAddEquipment = async (equipmentId: number) => {
    if (!activeHeader?.id) return;
    try {
      await equipmentLineRebindApi.addItem(activeHeader.id, { equipment_id: equipmentId });
      await refreshActive(activeHeader.id);
    } catch (error: unknown) {
      messageApi.error(getApiErrorMessage(error, t(`${P}.addFailed`)));
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!activeHeader?.id) return;
    await equipmentLineRebindApi.removeItem(activeHeader.id, itemId);
    await refreshActive(activeHeader.id);
  };

  const handleComplete = async (record: LineRebindRow) => {
    if (!record.id) return;
    try {
      await equipmentLineRebindApi.complete(record.id);
      messageApi.success(t(`${P}.completeSuccess`));
      setModalVisible(false);
      setActiveHeader(null);
      actionRef.current?.reload();
    } catch (error: unknown) {
      messageApi.error(getApiErrorMessage(error, t(`${P}.completeFailed`)));
    }
  };

  const handleCancel = async (record: LineRebindRow) => {
    if (!record.id) return;
    await equipmentLineRebindApi.cancel(record.id);
    messageApi.success(t(`${P}.cancelSuccess`));
    actionRef.current?.reload();
  };

  const handleDelete = async (keys: React.Key[]) => {
    for (const id of keys) {
      await equipmentLineRebindApi.delete(Number(id));
    }
    messageApi.success(t('common.batchDeleteSuccess', { count: keys.length }));
    actionRef.current?.reload();
  };

  const statusEnum = useMemo(
    () => ({
      进行中: { text: t(`${P}.status.inProgress`) },
      已完成: { text: t(`${P}.status.completed`) },
      已取消: { text: t(`${P}.status.cancelled`) },
    }),
    [t],
  );

  const detailBasicColumns = useMemo<ProDescriptionsItemProps<LineRebindRow>[]>(
    () => [
      { title: t(`${P}.col.documentNo`), dataIndex: 'document_no' },
      { title: t(`${P}.col.productionLine`), dataIndex: 'production_line_name' },
      { title: t(`${P}.col.overdueHours`), dataIndex: 'force_spot_overdue_hours' },
      {
        title: t('common.status'),
        dataIndex: 'status',
        render: (_, r) => renderDocumentStatusTag(r.status ?? '-', r.status),
      },
      { title: t(`${P}.col.completedBy`), dataIndex: 'completed_by_name' },
      { title: t(`${P}.col.completedAt`), dataIndex: 'completed_at', valueType: 'dateTime' },
      { title: t('common.remark'), dataIndex: 'remark', span: 2 },
    ],
    [t],
  );

  const detailLineColumns = useMemo<ColumnsType<RebindItem>>(
    () => [
      {
        title: t(`${P}.col.equipment`),
        key: 'eq',
        render: (_, row) => `${row.equipment_code ?? '-'} ${row.equipment_name ?? ''}`.trim(),
      },
      { title: t(`${P}.col.fromLine`), dataIndex: 'from_production_line_name' },
      {
        title: t(`${P}.col.forceCleared`),
        dataIndex: 'force_spot_cleared_at',
        render: (v) =>
          v ? (
            <MarkerTag color="success">{t(`${P}.cleared`)}</MarkerTag>
          ) : (
            <MarkerTag color="warning">{t(`${P}.pendingSpot`)}</MarkerTag>
          ),
      },
    ],
    [t],
  );

  const columns: ProColumns<LineRebindRow>[] = useMemo(
    () =>
      alignProColumns<LineRebindRow>(
        [
          {
            title: t('common.status'),
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: statusEnum,
            hideInTable: true,
            search: { order: 10 } as ProColumns['search'],
          },
          {
            title: t(`${P}.col.documentNo`),
            dataIndex: 'document_no',
            width: 160,
            minWidth: 160,
            uniTableKeepWidth: true,
            resizable: false,
            fixed: 'left',
            ellipsis: true,
            search: { order: 20 } as ProColumns['search'],
          },
          {
            title: t(`${P}.col.productionLine`),
            dataIndex: 'production_line_name',
            minWidth: 160,
            uniTablePrimaryFlex: true,
            uniTableRemainderFlex: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
          },
          {
            title: t(`${P}.col.itemCount`),
            dataIndex: 'item_count',
            width: 90,
            minWidth: 90,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) => r.item_count ?? r.items?.length ?? 0,
          },
          {
            title: t(`${P}.col.overdueHours`),
            dataIndex: 'force_spot_overdue_hours',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
          },
          ...buildDocumentAuditColumns<LineRebindRow>(t),
          {
            title: t('common.status'),
            key: 'lifecycle',
            dataIndex: 'status',
            hideInSearch: true,
            fixed: 'right',
            ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
            render: (_, r) => renderDocumentStatusTag(r.status ?? '-', r.status),
          },
          {
            title: t('common.actions'),
            key: 'option',
            fixed: 'right',
            hideInSearch: true,
            render: (_, record) => (
              <>
                {perms.canRead ? (
                  <Button
                    {...rowActionKind('read')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetail(record);
                    }}
                  >
                    {t('common.detail')}
                  </Button>
                ) : null}
                {perms.canUpdate && record.status === '进行中' ? (
                  <Button
                    {...rowActionKind('update')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleContinue(record);
                    }}
                  >
                    {t(`${P}.action.continue`)}
                  </Button>
                ) : null}
                {perms.canAction?.('submit') && record.status === '进行中' ? (
                  <Button
                    {...rowActionKind('submit')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleComplete(record);
                    }}
                  >
                    {t(`${P}.action.complete`)}
                  </Button>
                ) : null}
                {perms.canUpdate && record.status === '进行中' ? (
                  <Button
                    {...rowActionKind('update')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleCancel(record);
                    }}
                  >
                    {t(`${P}.action.cancel`)}
                  </Button>
                ) : null}
                {perms.canDelete && (record.status === '进行中' || record.status === '已取消') ? (
                  <ActionConfirmPopconfirm
                    title={t('common.deleteTitle')}
                    onConfirm={() => record.id && void handleDelete([record.id])}
                  >
                    <Button {...rowActionKind('delete')} danger onClick={(e) => e.stopPropagation()}>
                      {t('common.delete')}
                    </Button>
                  </ActionConfirmPopconfirm>
                ) : null}
              </>
            ),
          },
        ],
        SALES_DOC_LIST_FIELD_RANK,
      ),
    [t, perms, statusEnum, handleDetail],
  );

  return (
    <>
      <ListPageTemplate>
        <UniTable<LineRebindRow>
          headerTitle={t(`${P}.title`)}
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.equipment-line-rebinds-r10-v1"
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          showAdvancedSearch
          pinnedTabsField="status"
          skipFuzzyPinyinClientFilter
          onRow={(record) => ({
            onClick: () => perms.canRead && handleDetail(record),
            style: { cursor: perms.canRead ? 'pointer' : undefined },
          })}
          request={async (params) => {
            try {
              const res = await equipmentLineRebindApi.list({
                skip: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
                limit: params.pageSize,
                status: params.status,
                keyword: params.document_no,
              });
              const { data, total } = normalizeEquipmentListResponse(res);
              return { data: data as LineRebindRow[], success: true, total };
            } catch {
              messageApi.error(t(`${P}.listFailed`));
              return { data: [], success: false, total: 0 };
            }
          }}
          showCreateButton={perms.canCreate}
          createButtonText={withSingleNewShortcutHint(t(`${P}.create`))}
          onCreate={handleCreate}
          showDeleteButton={perms.canDelete}
          deleteConfirmTitle={t('common.batchDeleteTitle')}
          deleteConfirmDescription={(count) => t('common.batchDeleteContent', { count })}
          onDelete={handleDelete}
          enableRowSelection={perms.canDelete}
        />
      </ListPageTemplate>

      <EquipmentMasterDetailDrawer
        open={detailVisible}
        loading={detailLoading}
        detail={detail}
        title={`${t(`${P}.detailTitle`)}${detail?.document_no ? ` - ${detail.document_no}` : ''}`}
        onClose={closeDetail}
        basicColumns={detailBasicColumns}
        linesTitle={t(`${P}.form.items`)}
        lines={
          <MasterDataLinesTable
            rows={detail?.items ?? []}
            columns={detailLineColumns}
            rowKey={(row) => String(row.id ?? row.equipment_id ?? '')}
            emptyDescription={t('common.noData')}
          />
        }
        extra={buildDetailDrawerEditExtra(
          t,
          Boolean(detail && perms.canUpdate && detail.status === '进行中'),
          () => {
            if (!detail) return;
            closeDetail();
            void handleContinue(detail);
          },
        )}
      />

      <FormModalTemplate
        title={
          activeHeader?.id
            ? t(`${P}.continueModal`, { no: activeHeader.document_no })
            : t(`${P}.createModal`)
        }
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setActiveHeader(null);
          setWorkingItems([]);
        }}
        onFinish={handleCreateSubmit}
        isEdit={Boolean(activeHeader?.id)}
        width={MODAL_CONFIG.LARGE_WIDTH}
        formRef={formRef}
        grid={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormSelect
              name="production_line_id"
              label={t(`${P}.form.productionLine`)}
              options={lineOptions}
              rules={[{ required: true }]}
              showSearch
              disabled={Boolean(activeHeader?.id)}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="force_spot_overdue_hours"
              label={t(`${P}.col.overdueHours`)}
              min={1}
              max={720}
              rules={[{ required: true }]}
              disabled={Boolean(activeHeader?.id)}
              fieldProps={{ precision: 0, style: { width: '100%' } }}
            />
          </Col>
          {!activeHeader?.id ? (
            <Col span={24}>
              <ProFormSelect
                name="equipment_ids"
                label={t(`${P}.form.equipmentIds`)}
                options={equipmentOptions}
                mode="multiple"
                showSearch
                fieldProps={{ maxTagCount: 'responsive' }}
              />
            </Col>
          ) : null}
          <Col span={24}>
            <ProFormTextArea
              name="remark"
              label={t('common.remark')}
              fieldProps={{ rows: 2 }}
              disabled={Boolean(activeHeader?.id)}
            />
          </Col>
        </Row>

        {activeHeader?.id ? (
          <div style={{ marginTop: 16 }}>
            <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
              <Input
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                placeholder={t(`${P}.scanPlaceholder`)}
                onPressEnter={() => void handleScan()}
              />
              <Button type="primary" onClick={() => void handleScan()}>
                {t(`${P}.action.scan`)}
              </Button>
            </Space.Compact>
            <ProFormSelect
              name="_add_equipment"
              label={t(`${P}.form.addEquipment`)}
              options={equipmentOptions}
              showSearch
              fieldProps={{
                onChange: (val: number) => {
                  if (val) void handleAddEquipment(val);
                },
                value: undefined,
              }}
            />
            <MasterDataLinesTable
              rows={workingItems}
              columns={[
                ...detailLineColumns,
                {
                  title: t('common.actions'),
                  key: 'op',
                  width: 80,
                  render: (_, row) =>
                    row.id ? (
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => void handleRemoveItem(row.id!)}
                      >
                        {t('common.remove')}
                      </Button>
                    ) : null,
                },
              ]}
              rowKey={(row) => String(row.id ?? row.equipment_id ?? '')}
              emptyDescription={t(`${P}.noItems`)}
            />
            <Space style={{ marginTop: 12 }}>
              {perms.canAction?.('submit') ? (
                <Button type="primary" onClick={() => void handleComplete(activeHeader)}>
                  {t(`${P}.action.complete`)}
                </Button>
              ) : null}
              <Button type="link" onClick={() => navigate(ROUTES.EQUIPMENT_SPOT_CHECKS)}>
                {t(`${P}.gotoSpotChecks`)}
              </Button>
            </Space>
          </div>
        ) : null}
      </FormModalTemplate>
    </>
  );
};

export default EquipmentLineRebindsPage;
