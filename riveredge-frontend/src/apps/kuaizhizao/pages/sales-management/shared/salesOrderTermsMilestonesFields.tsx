/**
 * 销售订单：收款计划 / 合同条款（分模块；条款目录与框架合同共用）
 */
import React from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-components';
import { Button, Col, Dropdown, Form as AntForm, Row, Card, Typography, Input, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TFunction } from 'i18next';
import { DOCUMENT_SUBLINE_ADD_BUTTON_CLASS } from '../../../../../components/document-subline-table';
import { ContractTermPreviewContent } from '../sales-contracts/ContractTermPreviewContent';
import { formatContractTermHeading } from '../sales-contracts/contract-term-placeholders';
import type { SalesContractTermSnapshot } from '../../../services/sales-contract-term';
import {
  OrderPaymentMilestonesFields,
  type OrderPaymentMilestonesFieldsProps,
} from './orderPaymentMilestonesFields';

export type SalesOrderPaymentMilestonesFieldsProps = Omit<OrderPaymentMilestonesFieldsProps, 'variant'>;

export function SalesOrderPaymentMilestonesFields(props: SalesOrderPaymentMilestonesFieldsProps) {
  return <OrderPaymentMilestonesFields variant="sales" {...props} />;
}

export type SalesOrderContractTermsFieldsProps = {
  termGroupOptions: Array<{ label: string; value: number }>;
  termsPreview: SalesContractTermSnapshot[];
  onTermGroupChange: (groupId?: number) => void;
  t: TFunction;
  termPlaceholderKeys?: string[];
  termPlaceholderValues?: Record<string, string>;
  onTermPlaceholderChange?: (key: string, value: string) => void;
};

/** 合同条款（条款组 + 占位填写 + 预览）；无数据时虚线「添加」与收款计划一致 */
export function SalesOrderContractTermsFields({
  termGroupOptions,
  termsPreview,
  onTermGroupChange,
  t,
  termPlaceholderKeys = [],
  termPlaceholderValues = {},
  onTermPlaceholderChange,
}: SalesOrderContractTermsFieldsProps) {
  const form = AntForm.useFormInstance();
  const termGroupId = AntForm.useWatch('term_group_id', form) as number | undefined;
  const selectedLabel = termGroupOptions.find((o) => o.value === termGroupId)?.label;
  const hasTermGroups = termGroupOptions.length > 0;

  const applyTermGroup = (groupId?: number) => {
    form.setFieldValue('term_group_id', groupId);
    onTermGroupChange(groupId);
  };

  const termGroupMenu = {
    items: termGroupOptions.map((opt) => ({
      key: String(opt.value),
      label: opt.label,
    })),
    onClick: ({ key }: { key: string }) => {
      applyTermGroup(Number(key));
    },
  };

  return (
    <>
      <ProFormSelect name="term_group_id" hidden options={termGroupOptions} />

      {!termGroupId ? (
        <Dropdown menu={termGroupMenu} trigger={['click']} disabled={!hasTermGroups}>
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            className={DOCUMENT_SUBLINE_ADD_BUTTON_CLASS}
            disabled={!hasTermGroups}
            title={!hasTermGroups ? t('app.kuaizhizao.salesOrder.terms.noTermGroup') : undefined}
          >
            {t('app.kuaizhizao.salesOrder.terms.addTerms')}
          </Button>
        </Dropdown>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Typography.Text strong>{selectedLabel}</Typography.Text>
            <Space>
              <Dropdown menu={termGroupMenu} trigger={['click']}>
                <Button type="link" size="small">
                  {t('app.kuaizhizao.salesOrder.terms.changeTerms')}
                </Button>
              </Dropdown>
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => applyTermGroup(undefined)}
              />
            </Space>
          </div>

          {termPlaceholderKeys.length > 0 ? (
            <Card
              size="small"
              title={t('app.kuaizhizao.salesContract.terms.placeholderFillTitle')}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 12]}>
                {termPlaceholderKeys.map((key) => (
                  <Col key={key} span={6}>
                    <div style={{ marginBottom: 4 }}>
                      <Typography.Text>{key}</Typography.Text>
                    </div>
                    <Input
                      value={termPlaceholderValues[key] ?? ''}
                      placeholder={t('app.kuaizhizao.salesContract.terms.placeholderInputHint', {
                        name: key,
                      })}
                      onChange={(e) => onTermPlaceholderChange?.(key, e.target.value)}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          ) : null}

          {termsPreview.length > 0 ? (
            <Card size="small" title={t('app.kuaizhizao.salesOrder.terms.previewTitle')}>
              {termsPreview.map((term, idx) => (
                <div key={`${term.term_item_id ?? idx}-${term.term_name}`} style={{ marginBottom: 12 }}>
                  <Typography.Text strong>
                    {formatContractTermHeading(idx, term.term_name)}
                  </Typography.Text>
                  <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                    <ContractTermPreviewContent
                      content={term.content ?? ''}
                      template={term.template_content}
                      values={term.placeholder_values}
                    />
                  </Typography.Paragraph>
                </div>
              ))}
            </Card>
          ) : null}
        </>
      )}
    </>
  );
}
