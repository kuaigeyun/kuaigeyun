import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert, Col, Divider, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { getDepartmentTree, type DepartmentTreeItem } from '../../../../../services/department';
import { glService, type GlAccount } from '../../../services/gl';
import { fixedAssetService, type FaAsset, type FaCategory } from '../../../services/fixed-assets';
import {
  FA_CHANGE_METHOD_OPTIONS,
  FA_UNIT_OPTIONS,
  computeExpectedResidual,
  computeMonthlyDepreciation,
  computeNetValue,
  computeRemainingPeriods,
  formatMoneyDisplay,
} from './faAssetFormUtils';
import { FA_ASSET_STATUS_LABELS, FA_DEPRECIATION_METHOD_LABELS } from './faAssetImportTemplate';

const NS = 'app.kuaicaiwu.fixedAssets.assets';

type DepartmentOption = { label: string; value: string };

function flattenDepartments(items: DepartmentTreeItem[], prefix = ''): DepartmentOption[] {
  const out: DepartmentOption[] = [];
  items.forEach((node) => {
    const name = String(node.name ?? '').trim();
    if (!name) return;
    const label = prefix ? `${prefix} / ${name}` : name;
    out.push({ label, value: name });
    if (Array.isArray(node.children) && node.children.length > 0) {
      out.push(...flattenDepartments(node.children, label));
    }
  });
  return out;
}

export interface FaAssetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: FaAsset | null;
  categories: FaCategory[];
  onSuccess: () => void;
}

const FaAssetFormModal: React.FC<FaAssetFormModalProps> = ({
  open,
  onOpenChange,
  editing,
  categories,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ProFormInstance>();
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [accounts, setAccounts] = useState<GlAccount[]>([]);
  useEffect(() => {
    if (!open) return;
    void getDepartmentTree({ is_active: true })
      .then((res) => setDepartments(flattenDepartments(res?.items ?? [])))
      .catch(() => setDepartments([]));
    void glService
      .listAccounts({ is_active: true })
      .then(setAccounts)
      .catch(() => setAccounts([]));
  }, [open]);

  const accountOptions = useMemo(
    () =>
      accounts
        .filter((a) => a.is_leaf)
        .map((a) => ({
          label: `${a.account_code} ${a.account_name}`,
          value: a.account_code,
        })),
    [accounts],
  );

  const statusOptions = useMemo(
    () => Object.entries(FA_ASSET_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const deprMethodOptions = useMemo(
    () => Object.entries(FA_DEPRECIATION_METHOD_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const initialValues = useMemo(() => {
    if (editing) {
      return {
        ...editing,
        use_system_code: false,
        entry_date: editing.entry_date ? dayjs(editing.entry_date) : undefined,
        start_use_date: editing.start_use_date ? dayjs(editing.start_use_date) : undefined,
        quantity: editing.quantity ?? 1,
        change_method: editing.change_method || '购入',
        depreciation_method: editing.depreciation_method || 'straight_line',
      };
    }
    return {
      status: 'active',
      quantity: 1,
      change_method: '购入',
      depreciation_method: 'straight_line',
      useful_life_months: 60,
      residual_rate: 0.05,
      depreciated_periods: 0,
      accumulated_depreciation: 0,
      impairment_value: 0,
      original_value: 0,
      use_system_code: true,
      asset_account_code: '1601',
      accumulated_depreciation_account_code: '1602',
      expense_account_code: '6602',
    };
  }, [editing]);

  return (
    <FormModalTemplate
      key={editing?.id ?? 'create'}
      title={editing ? t(`${NS}.editTitle`) : t(`${NS}.createTitle`)}
      open={open}
      onOpenChange={onOpenChange}
      grid={false}
      formRef={formRef}
      width={MODAL_CONFIG.LARGE_WIDTH}
      modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
      initialValues={initialValues}
      onFinish={async (values) => {
        const { use_system_code: useSystemCode, ...rest } = values;
        const body = {
          ...rest,
          asset_code: useSystemCode && !editing ? undefined : rest.asset_code,
          entry_date: rest.entry_date ? dayjs(rest.entry_date).format('YYYY-MM-DD') : undefined,
          start_use_date: rest.start_use_date
            ? dayjs(rest.start_use_date).format('YYYY-MM-DD')
            : undefined,
        };
        if (editing) {
          await fixedAssetService.updateAsset(editing.id, body);
        } else {
          await fixedAssetService.createAsset(body);
        }
        onSuccess();
      }}
    >
      <Divider orientation="left">{t(`${NS}.form.sectionBasic`)}</Divider>
      <Row gutter={16}>
        {!editing ? (
          <ProFormDependency name={['use_system_code']}>
            {({ use_system_code }) => (
              <>
                <Col span={12}>
                  <ProFormText
                    name="asset_code"
                    label={t(`${NS}.col.code`)}
                    placeholder={t('common.autoCodePlaceholder')}
                    fieldProps={{ disabled: Boolean(use_system_code) }}
                  />
                </Col>
                <Col span={12} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}>
                  <ProFormCheckbox name="use_system_code">{t(`${NS}.form.useSystemCode`)}</ProFormCheckbox>
                </Col>
              </>
            )}
          </ProFormDependency>
        ) : (
          <Col span={12}>
            <ProFormText name="asset_code" label={t(`${NS}.col.code`)} disabled />
          </Col>
        )}
        <Col span={12}>
          <ProFormText
            name="asset_name"
            label={t(`${NS}.col.name`)}
            rules={[{ required: true }]}
            fieldProps={{ maxLength: 80 }}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="category_id"
            label={t(`${NS}.col.category`)}
            rules={[{ required: true }]}
            options={categories.map((c) => ({ label: c.category_name, value: c.id }))}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="change_method"
            label={t(`${NS}.form.changeMethod`)}
            rules={[{ required: true }]}
            options={FA_CHANGE_METHOD_OPTIONS.map((v) => ({ label: v, value: v }))}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="quantity"
            label={t(`${NS}.form.quantity`)}
            min={0.0001}
            rules={[{ required: true }]}
            fieldProps={{ precision: 4 }}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="unit"
            label={t(`${NS}.form.unit`)}
            options={FA_UNIT_OPTIONS.map((v) => ({ label: v, value: v }))}
            showSearch
            allowClear
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="department_name"
            label={t(`${NS}.col.department`)}
            rules={[{ required: true }]}
            options={departments}
            showSearch
            allowClear
          />
        </Col>
        <Col span={12}>
          <ProFormText name="user_name" label={t(`${NS}.col.user`)} fieldProps={{ maxLength: 80 }} />
        </Col>
        <Col span={12}>
          <ProFormSelect name="status" label={t(`${NS}.form.usageStatus`)} options={statusOptions} />
        </Col>
        <Col span={12}>
          <ProFormText name="location" label={t(`${NS}.col.location`)} fieldProps={{ maxLength: 200 }} />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="start_use_date"
            label={t(`${NS}.col.startUseDate`)}
            rules={[{ required: true }]}
            fieldProps={{ style: { width: '100%' } }}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="entry_date"
            label={t(`${NS}.col.entryDate`)}
            rules={[{ required: true }]}
            fieldProps={{ style: { width: '100%' } }}
          />
        </Col>
        <Col span={12}>
          <ProFormText name="specification" label={t(`${NS}.form.specification`)} fieldProps={{ maxLength: 80 }} />
        </Col>
        <Col span={12}>
          <ProFormDependency name={['entry_date']}>
            {({ entry_date }) => (
              <Form.Item label={t(`${NS}.form.entryPeriod`)}>
                <Input
                  readOnly
                  value={entry_date ? dayjs(entry_date).format('YYYY-MM') : ''}
                />
              </Form.Item>
            )}
          </ProFormDependency>
        </Col>
      </Row>

      <Divider orientation="left">{t(`${NS}.form.sectionDepreciation`)}</Divider>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Alert type="info" showIcon title={t(`${NS}.form.depreciationPerAssetHint`)} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormSelect
            name="depreciation_method"
            label={t(`${NS}.form.depreciationMethod`)}
            rules={[{ required: true }]}
            options={deprMethodOptions}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="useful_life_months"
            label={t(`${NS}.form.usefulLifePeriods`)}
            min={1}
            rules={[{ required: true }]}
          />
        </Col>
        <Col span={12}>
          <ProFormMoney
            name="original_value"
            label={t(`${NS}.col.originalValue`)}
            rules={[{ required: true }]}
            min={0}
          />
        </Col>
        <Col span={12}>
          <ProFormMoney name="impairment_value" label={t(`${NS}.form.impairmentValue`)} min={0} />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="depreciated_periods"
            label={t(`${NS}.form.depreciatedPeriods`)}
            min={0}
            tooltip={t(`${NS}.form.depreciatedPeriodsHint`)}
          />
        </Col>
        <ProFormDependency
          name={['useful_life_months', 'depreciated_periods']}
        >
          {({ useful_life_months, depreciated_periods }) => (
            <Col span={12}>
              <Form.Item label={t(`${NS}.form.remainingPeriods`)}>
                <Input
                  readOnly
                  value={String(computeRemainingPeriods(useful_life_months, depreciated_periods))}
                />
              </Form.Item>
            </Col>
          )}
        </ProFormDependency>
        <Col span={12}>
          <ProFormMoney
            name="accumulated_depreciation"
            label={t(`${NS}.col.accumDepr`)}
            min={0}
            tooltip={t(`${NS}.form.accumDeprHint`)}
          />
        </Col>
        <ProFormDependency
          name={['original_value', 'accumulated_depreciation', 'impairment_value']}
        >
          {({ original_value, accumulated_depreciation, impairment_value }) => (
            <Col span={12}>
              <Form.Item label={t(`${NS}.col.netValue`)}>
                <Input
                  readOnly
                  value={formatMoneyDisplay(
                    computeNetValue(original_value, accumulated_depreciation, impairment_value),
                  )}
                />
              </Form.Item>
            </Col>
          )}
        </ProFormDependency>
        <Col span={12}>
          <ProFormDigit
            name="residual_rate"
            label={t(`${NS}.col.residualRate`)}
            min={0}
            max={1}
            rules={[{ required: true }]}
            fieldProps={{ step: 0.01 }}
            tooltip={t(`${NS}.form.residualRateHint`)}
          />
        </Col>
        <ProFormDependency name={['original_value', 'residual_rate']}>
          {({ original_value, residual_rate }) => (
            <Col span={12}>
              <Form.Item label={t(`${NS}.form.expectedResidual`)}>
                <Input
                  readOnly
                  value={formatMoneyDisplay(computeExpectedResidual(original_value, residual_rate))}
                />
              </Form.Item>
            </Col>
          )}
        </ProFormDependency>
        <ProFormDependency
          name={['original_value', 'residual_rate', 'useful_life_months']}
        >
          {({ original_value, residual_rate, useful_life_months }) => (
            <Col span={12}>
              <Form.Item label={t(`${NS}.form.monthlyDepreciation`)}>
                <Input
                  readOnly
                  value={formatMoneyDisplay(
                    computeMonthlyDepreciation(original_value, residual_rate, useful_life_months),
                  )}
                />
              </Form.Item>
            </Col>
          )}
        </ProFormDependency>
      </Row>

      <Divider orientation="left">{t(`${NS}.form.sectionAccounts`)}</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormSelect
            name="accumulated_depreciation_account_code"
            label={t(`${NS}.form.accumDeprAccount`)}
            rules={[{ required: true }]}
            options={accountOptions}
            showSearch
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="expense_account_code"
            label={t(`${NS}.form.expenseAccount`)}
            rules={[{ required: true }]}
            options={accountOptions}
            showSearch
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="asset_account_code"
            label={t(`${NS}.form.assetAccount`)}
            options={accountOptions}
            showSearch
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <ProFormTextArea name="notes" label={t('common.notes')} fieldProps={{ maxLength: 200, rows: 2 }} />
        </Col>
      </Row>
    </FormModalTemplate>
  );
};

export default FaAssetFormModal;
