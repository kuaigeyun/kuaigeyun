/**
 * 购销订单付款/收款计划共用表单与详情只读展示
 */
import React from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormSelect,
  ProFormText,
  ProFormDatePicker,
  ProFormDigit,
} from '@ant-design/pro-components';
import { App, Button, Dropdown, Form as AntForm, Table, Typography, Select, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TFunction } from 'i18next';
import { buildFutureDateShortcutFieldProps } from '../../../../../utils/futureDatePickerShortcuts';
import { DOCUMENT_SUBLINE_TABLE_PROPS, DOCUMENT_SUBLINE_ADD_BUTTON_CLASS } from '../../../../../components/document-subline-table';
import { formatDateBySiteSetting } from '../../../../../utils/format';

export type OrderPaymentMilestoneVariant = 'sales' | 'purchase';

export type OrderPaymentMilestoneRow = {
  id?: number;
  milestone_name?: string;
  planned_date?: string;
  planned_amount?: number;
  planned_ratio?: number;
  billing_trigger?: string;
  is_prepayment?: boolean;
  auto_generate_receivable?: boolean;
  auto_generate_payable?: boolean;
  bank_account_id?: number | null;
  status?: string;
  receivable_code?: string;
  payable_code?: string;
  notes?: string;
};

export type OrderPaymentMilestonesFieldsProps = {
  variant: OrderPaymentMilestoneVariant;
  formRef: React.RefObject<ProFormInstance | undefined>;
  t: TFunction;
  amountDecimals: number;
  baseDateField?: string;
  bankAccountOptions?: Array<{ label: string; value: number }>;
};

function autoFieldName(variant: OrderPaymentMilestoneVariant): 'auto_generate_receivable' | 'auto_generate_payable' {
  return variant === 'sales' ? 'auto_generate_receivable' : 'auto_generate_payable';
}

function prepaymentLabelKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.milestoneTypePrepayment'
    : 'app.kuaizhizao.purchaseOrder.milestoneTypePrepayment';
}

function prepaymentDefaultNameKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.prepaymentNameDefault'
    : 'app.kuaizhizao.purchaseOrder.prepaymentNameDefault';
}

function prepaymentOnlyOneKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.prepaymentOnlyOne'
    : 'app.kuaizhizao.purchaseOrder.prepaymentOnlyOne';
}

function planTypeLabelKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.milestoneTypePlan'
    : 'app.kuaizhizao.purchaseOrder.milestoneTypePlan';
}

function addPlanKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.addPaymentMilestone'
    : 'app.kuaizhizao.purchaseOrder.addPaymentMilestone';
}

function addPrepayKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.addPrepaymentMilestone'
    : 'app.kuaizhizao.purchaseOrder.addPrepaymentMilestone';
}

function bankAccountLabelKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.prepaymentBankAccount'
    : 'app.kuaizhizao.purchaseOrder.form.prepaymentBankAccount';
}

function bankAccountPlaceholderKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.salesOrder.prepaymentBankAccountPlaceholder'
    : 'app.kuaizhizao.purchaseOrder.form.prepaymentBankAccountPlaceholder';
}

function autoGenerateLabelKey(variant: OrderPaymentMilestoneVariant): string {
  return variant === 'sales'
    ? 'app.kuaizhizao.orderMilestone.autoGenerateReceivable'
    : 'app.kuaizhizao.orderMilestone.autoGeneratePayable';
}

export function OrderPaymentMilestonesFields({
  variant,
  formRef,
  t,
  amountDecimals,
  baseDateField = 'order_date',
  bankAccountOptions = [],
}: OrderPaymentMilestonesFieldsProps) {
  const { message } = App.useApp();
  const form = AntForm.useFormInstance();
  const autoField = autoFieldName(variant);
  const milestoneRows = (AntForm.useWatch('payment_milestones', form) as Array<{
    is_prepayment?: boolean;
    billing_trigger?: string;
  }> | undefined) ?? [];
  const hasPrepayment = milestoneRows.some((row) => Boolean(row?.is_prepayment));

  return (
    <AntForm.List name="payment_milestones">
      {(fields, { add, remove }) => {
        const addPlan = () => add({ billing_trigger: 'milestone', is_prepayment: false, [autoField]: false });
        const addPrepayment = () => {
          if (hasPrepayment) {
            message.warning(t(prepaymentOnlyOneKey(variant)));
            return;
          }
          add({
            milestone_name: t(prepaymentDefaultNameKey(variant)),
            billing_trigger: 'milestone',
            is_prepayment: true,
            [autoField]: false,
          });
        };

        const columns = [
          {
            title: t('app.kuaizhizao.salesOrder.milestoneType'),
            width: 120,
            render: (_: unknown, __: unknown, index: number) => (
              <AntForm.Item
                name={[index, 'is_prepayment']}
                style={{ margin: 0 }}
                getValueProps={(v) => ({ value: v ? 1 : 0 })}
                getValueFromEvent={(v) => Boolean(v)}
              >
                <Select
                  allowClear={false}
                  style={{ width: '100%' }}
                  options={[
                    { label: t(planTypeLabelKey(variant)), value: 0 },
                    { label: t(prepaymentLabelKey(variant)), value: 1 },
                  ]}
                  onChange={(val: number) => {
                    const asPrepay = Boolean(val);
                    if (asPrepay) {
                      const rows =
                        (form.getFieldValue('payment_milestones') as Array<{ is_prepayment?: boolean }>) ?? [];
                      const otherPrepay = rows.some(
                        (row, i) => i !== index && Boolean(row?.is_prepayment),
                      );
                      if (otherPrepay) {
                        message.warning(t(prepaymentOnlyOneKey(variant)));
                        queueMicrotask(() => {
                          form.setFieldValue(['payment_milestones', index, 'is_prepayment'], false);
                        });
                        return;
                      }
                      const name = form.getFieldValue(['payment_milestones', index, 'milestone_name']);
                      if (!name) {
                        form.setFieldValue(
                          ['payment_milestones', index, 'milestone_name'],
                          t(prepaymentDefaultNameKey(variant)),
                        );
                      }
                      form.setFieldValue(['payment_milestones', index, autoField], false);
                    } else {
                      form.setFieldValue(['payment_milestones', index, 'bank_account_id'], undefined);
                    }
                  }}
                />
              </AntForm.Item>
            ),
          },
          {
            title: t('app.kuaizhizao.salesContract.milestoneName'),
            width: 140,
            render: (_: unknown, __: unknown, index: number) => (
              <ProFormText
                name={[index, 'milestone_name']}
                placeholder={t('app.kuaizhizao.salesContract.milestoneNamePlaceholder')}
                formItemProps={{ style: { margin: 0 } }}
              />
            ),
          },
          {
            title: t('app.kuaizhizao.salesContract.plannedDate'),
            width: 140,
            render: (_: unknown, __: unknown, index: number) => (
              <ProFormDatePicker
                name={[index, 'planned_date']}
                fieldProps={buildFutureDateShortcutFieldProps({
                  getForm: () => formRef.current,
                  fieldName: 'planned_date',
                  baseFieldName: baseDateField,
                  t,
                  onApply: (date) =>
                    formRef.current?.setFieldValue?.(['payment_milestones', index, 'planned_date'], date),
                })}
                formItemProps={{ style: { margin: 0 } }}
              />
            ),
          },
          {
            title: t('app.kuaizhizao.salesContract.plannedAmount'),
            width: 120,
            render: (_: unknown, __: unknown, index: number) => (
              <ProFormDigit
                name={[index, 'planned_amount']}
                min={0}
                fieldProps={{ precision: amountDecimals, style: { width: '100%' } }}
                formItemProps={{ style: { margin: 0 } }}
              />
            ),
          },
          {
            title: t('app.kuaizhizao.salesContract.ratioPercent'),
            width: 100,
            render: (_: unknown, __: unknown, index: number) => (
              <ProFormDigit
                name={[index, 'planned_ratio']}
                min={0}
                max={100}
                fieldProps={{ style: { width: '100%' } }}
                formItemProps={{ style: { margin: 0 } }}
              />
            ),
          },
          {
            title: t(bankAccountLabelKey(variant)),
            width: 200,
            render: (_: unknown, __: unknown, index: number) => {
              const isPrepay = Boolean(milestoneRows[index]?.is_prepayment);
              if (!isPrepay) {
                return <Typography.Text type="secondary">—</Typography.Text>;
              }
              return (
                <ProFormSelect
                  name={[index, 'bank_account_id']}
                  options={bankAccountOptions}
                  showSearch
                  allowClear
                  placeholder={t(bankAccountPlaceholderKey(variant))}
                  formItemProps={{ style: { margin: 0 } }}
                />
              );
            },
          },
          {
            title: t('app.kuaizhizao.salesContract.billingTrigger'),
            width: 120,
            render: (_: unknown, __: unknown, index: number) => {
              const isPrepay = Boolean(milestoneRows[index]?.is_prepayment);
              if (isPrepay) {
                return (
                  <Typography.Text type="secondary">{t(prepaymentLabelKey(variant))}</Typography.Text>
                );
              }
              return (
                <ProFormSelect
                  name={[index, 'billing_trigger']}
                  options={[
                    {
                      label: t('app.kuaizhizao.salesContract.billingTriggerMilestone'),
                      value: 'milestone',
                    },
                    {
                      label: t('app.kuaizhizao.salesContract.billingTriggerDelivery'),
                      value: 'delivery',
                    },
                  ]}
                  formItemProps={{ style: { margin: 0 } }}
                />
              );
            },
          },
          {
            title: t(autoGenerateLabelKey(variant)),
            width: 120,
            align: 'center' as const,
            render: (_: unknown, __: unknown, index: number) => {
              const isPrepay = Boolean(milestoneRows[index]?.is_prepayment);
              if (isPrepay) {
                return <Typography.Text type="secondary">—</Typography.Text>;
              }
              return (
                <AntForm.Item
                  name={[index, autoField]}
                  style={{ margin: 0 }}
                  valuePropName="checked"
                >
                  <Switch size="small" />
                </AntForm.Item>
              );
            },
          },
          {
            title: t('common.action'),
            width: 48,
            align: 'center' as const,
            render: (_: unknown, __: unknown, index: number) => (
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => remove(index)}
              />
            ),
          },
        ];

        const addMenu = {
          items: [
            { key: 'plan', label: t(addPlanKey(variant)) },
            { key: 'prepayment', label: t(addPrepayKey(variant)), disabled: hasPrepayment },
          ],
          onClick: ({ key }: { key: string }) => {
            if (key === 'prepayment') addPrepayment();
            else addPlan();
          },
        };

        return (
          <>
            {fields.length > 0 ? (
              <Table
                {...DOCUMENT_SUBLINE_TABLE_PROPS}
                rowKey="key"
                dataSource={fields}
                columns={columns}
                scroll={{ x: 'max-content' }}
              />
            ) : null}
            <Dropdown menu={addMenu} trigger={['click']}>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                className={DOCUMENT_SUBLINE_ADD_BUTTON_CLASS}
                style={{ marginTop: fields.length > 0 ? 8 : 0 }}
              >
                {t(addPlanKey(variant))}
              </Button>
            </Dropdown>
          </>
        );
      }}
    </AntForm.List>
  );
}

export type OrderPaymentMilestonesReadOnlyProps = {
  variant: OrderPaymentMilestoneVariant;
  milestones?: OrderPaymentMilestoneRow[];
  t: TFunction;
  amountDecimals?: number;
};

export function OrderPaymentMilestonesReadOnly({
  variant,
  milestones = [],
  t,
  amountDecimals = 2,
}: OrderPaymentMilestonesReadOnlyProps) {
  if (!milestones.length) return null;
  const autoField = autoFieldName(variant);
  const financeCodeField = variant === 'sales' ? 'receivable_code' : 'payable_code';

  return (
    <Table
      size="small"
      pagination={false}
      rowKey={(row, i) => String(row.id ?? i)}
      dataSource={milestones}
      scroll={{ x: 'max-content' }}
      columns={[
        {
          title: t('app.kuaizhizao.salesOrder.milestoneType'),
          dataIndex: 'is_prepayment',
          width: 100,
          render: (v: boolean) =>
            v ? t(prepaymentLabelKey(variant)) : t(planTypeLabelKey(variant)),
        },
        { title: t('app.kuaizhizao.salesContract.milestoneName'), dataIndex: 'milestone_name', width: 140 },
        {
          title: t('app.kuaizhizao.salesContract.plannedDate'),
          dataIndex: 'planned_date',
          width: 120,
          render: (v: string) => (v ? formatDateBySiteSetting(v) : '—'),
        },
        {
          title: t('app.kuaizhizao.salesContract.plannedAmount'),
          dataIndex: 'planned_amount',
          width: 120,
          align: 'right' as const,
          render: (v: number) => (v != null ? Number(v).toFixed(amountDecimals) : '—'),
        },
        {
          title: t(autoGenerateLabelKey(variant)),
          dataIndex: autoField,
          width: 110,
          align: 'center' as const,
          render: (v: boolean, row: OrderPaymentMilestoneRow) => {
            if (row.is_prepayment) return '—';
            return v ? t('common.yes') : t('common.no');
          },
        },
        {
          title: t('app.kuaizhizao.orderMilestone.financeDoc'),
          dataIndex: financeCodeField,
          width: 140,
          render: (v: string) => v || '—',
        },
      ]}
    />
  );
}
