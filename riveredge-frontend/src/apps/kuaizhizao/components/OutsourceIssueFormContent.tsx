/**
 * 委外发料表单：BOM 待发明细 + 可选手动添加物料
 */
import React, { useMemo, useState } from 'react';
import { Alert, Button, Divider, Form, InputNumber, Space, Spin, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UniMaterialSelect } from '../../../components/uni-material-select';
import { useNumericPrecisionPlaces } from '../../../hooks/useNumericPrecision';
import { formatQuantity } from '../../../utils/format';
import { resolveMaterialScenarioUnit } from '../../../utils/materialScenarioUnit';
import type { Material } from '../../master-data/types/material';

export type OutsourceIssueLine = {
  key: number;
  materialId: number;
  materialCode: string;
  materialName: string;
  unit: string;
  requiredQuantity: number;
  issuedQuantity: number;
  pendingQuantity: number;
  availableQuantity: number;
  issueQuantity: number;
  isManual?: boolean;
};

export type OutsourceIssueWorkOrderBrief = {
  id?: number;
  code?: string;
  productName?: string;
  product_name?: string;
  quantity?: number;
};

interface OutsourceIssueFormContentProps {
  workOrder: OutsourceIssueWorkOrderBrief;
  lines: OutsourceIssueLine[];
  onLinesChange: (lines: OutsourceIssueLine[]) => void;
  loading?: boolean;
  previewMessage?: string | null;
  allowManualLines?: boolean;
}

const OutsourceIssueFormContent: React.FC<OutsourceIssueFormContentProps> = ({
  workOrder,
  lines,
  onLinesChange,
  loading,
  previewMessage,
  allowManualLines = true,
}) => {
  const { t } = useTranslation();
  const quantityDecimals = useNumericPrecisionPlaces('quantity');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerForm] = Form.useForm();

  const updateLineQty = (materialId: number, issueQuantity: number) => {
    onLinesChange(
      lines.map((l) => (l.materialId === materialId ? { ...l, issueQuantity } : l)),
    );
  };

  const removeManualLine = (materialId: number) => {
    onLinesChange(lines.filter((l) => l.materialId !== materialId));
  };

  const addManualMaterial = (_val: number | undefined, material: Material | undefined) => {
    if (!material?.id) return;
    const materialId = Number(material.id);
    if (lines.some((l) => l.materialId === materialId)) {
      return;
    }
    onLinesChange([
      ...lines,
      {
        key: materialId,
        materialId,
        materialCode: String(material.mainCode ?? material.code ?? ''),
        materialName: String(material.name ?? ''),
        unit: resolveMaterialScenarioUnit(material, 'production') || material.baseUnit || '',
        requiredQuantity: 0,
        issuedQuantity: 0,
        pendingQuantity: 0,
        availableQuantity: 0,
        issueQuantity: 0,
        isManual: true,
      },
    ]);
    pickerForm.resetFields();
    setPickerOpen(false);
  };

  const columns: ColumnsType<OutsourceIssueLine> = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.salesOrder.materialCode'),
        dataIndex: 'materialCode',
        width: 120,
        ellipsis: true,
      },
      {
        title: t('app.kuaizhizao.salesOrder.materialName'),
        dataIndex: 'materialName',
        width: 160,
        ellipsis: true,
      },
      {
        title: t('common.unit'),
        dataIndex: 'unit',
        width: 56,
        align: 'center',
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.entry.requiredQty'),
        dataIndex: 'requiredQuantity',
        width: 96,
        align: 'right',
        render: (_, r) => (r.isManual ? '—' : formatQuantity(r.requiredQuantity)),
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.pull.colIssuedQty'),
        dataIndex: 'issuedQuantity',
        width: 80,
        align: 'right',
        render: (_, r) => (r.isManual ? '—' : formatQuantity(r.issuedQuantity)),
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.entry.pendingIssueQty'),
        dataIndex: 'pendingQuantity',
        width: 80,
        align: 'right',
        render: (_, r) =>
          r.isManual ? (
            '—'
          ) : (
            <Typography.Text type={r.pendingQuantity > 0 ? 'warning' : undefined}>
              {formatQuantity(r.pendingQuantity)}
            </Typography.Text>
          ),
      },
      {
        title: t('app.kuaizhizao.outsourceWorkOrder.issueAvailableStock'),
        dataIndex: 'availableQuantity',
        width: 96,
        align: 'right',
        render: (_, r) => (r.isManual ? '—' : formatQuantity(r.availableQuantity)),
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.entry.thisIssue'),
        dataIndex: 'issueQuantity',
        width: 120,
        align: 'right',
        fixed: 'right',
        render: (_, r) => {
          const manual = r.isManual === true;
          const disabled = !manual && r.pendingQuantity <= 0;
          return (
            <InputNumber
              min={0}
              max={manual ? undefined : r.pendingQuantity > 0 ? r.pendingQuantity : undefined}
              precision={quantityDecimals}
              value={r.issueQuantity}
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={(v) => updateLineQty(r.materialId, Number(v ?? 0))}
            />
          );
        },
      },
      ...(allowManualLines
        ? [
            {
              title: t('common.actions'),
              key: 'actions',
              width: 72,
              fixed: 'right' as const,
              render: (_: unknown, r: OutsourceIssueLine) =>
                r.isManual ? (
                  <Button type="link" danger size="small" onClick={() => removeManualLine(r.materialId)}>
                    {t('common.delete')}
                  </Button>
                ) : null,
            },
          ]
        : []),
    ],
    [allowManualLines, quantityDecimals, lines, onLinesChange, t],
  );

  const alertType = allowManualLines && previewMessage ? 'info' : 'warning';

  return (
    <>
      <Divider style={{ margin: '12px 0' }}>{t('app.kuaizhizao.outsourceWorkOrder.issueWorkOrderInfo')}</Divider>
      <div style={{ marginBottom: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
        <div>
          <strong>{t('app.kuaizhizao.warehouseOutbound.entry.outsourceCode')}：</strong>
          {workOrder.code ?? '-'}
        </div>
        <div>
          <strong>{t('app.kuaizhizao.warehouseOutbound.entry.product')}：</strong>
          {workOrder.productName || workOrder.product_name || '-'}
        </div>
        <div>
          <strong>{t('app.kuaizhizao.outsourceWorkOrder.outsourceQty')}：</strong>
          {workOrder.quantity != null ? formatQuantity(workOrder.quantity) : '-'}
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }}>{t('app.kuaizhizao.outsourceWorkOrder.issueLineSection')}</Divider>
      {previewMessage ? (
        <Alert type={alertType} showIcon title={previewMessage} style={{ marginBottom: 12 }} />
      ) : null}
      {allowManualLines ? (
        <Space style={{ marginBottom: 12 }} wrap>
          {pickerOpen ? (
            <Form form={pickerForm} style={{ minWidth: 320, flex: 1 }}>
              <UniMaterialSelect
                name="manual_material_id"
                label=""
                placeholder={t('app.kuaizhizao.outsourceWorkOrder.issuePickMaterial')}
                onChange={addManualMaterial}
                showQuickCreate
                showAdvancedSearch
              />
            </Form>
          ) : (
            <Button icon={<PlusOutlined />} onClick={() => setPickerOpen(true)}>
              {t('app.kuaizhizao.outsourceWorkOrder.issueAddManualLine')}
            </Button>
          )}
          {pickerOpen ? (
            <Button onClick={() => setPickerOpen(false)}>{t('common.cancel')}</Button>
          ) : null}
        </Space>
      ) : null}
      <Spin spinning={!!loading}>
        <Table<OutsourceIssueLine>
          size="small"
          rowKey="materialId"
          columns={columns}
          dataSource={lines}
          pagination={false}
          scroll={{ x: 980, y: 280 }}
          locale={{
            emptyText: loading
              ? t('common.loading')
              : t('app.kuaizhizao.outsourceWorkOrder.issueLineEmpty'),
          }}
        />
      </Spin>
    </>
  );
};

export default OutsourceIssueFormContent;
