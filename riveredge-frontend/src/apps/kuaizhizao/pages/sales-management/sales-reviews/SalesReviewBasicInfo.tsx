/**
 * 订单评审 — 基本信息 Descriptions（评审 Modal / 详情抽屉共用列定义与 3 列排版）
 */

import React, { useMemo } from 'react';
import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { DictionaryLabel } from '../../../../../components/dictionary-label';
import { formatBusinessDateOnly } from '../../../../../utils/format';
import type { SalesReview } from '../../../services/sales-review';
import {
  renderSalesReviewRiskMarkerTag,
  renderSalesReviewStatusTag,
  renderSalesReviewUrgencyMarkerTag,
} from '../../../utils/salesReviewPresentation';
import { alignDescriptionColumns } from '../shared/documentFieldAlignment';

export type SalesReviewBasicInfoVariant = 'modal' | 'drawer';

/**
 * 订单评审基本信息段位（3 列栅格按类型成块，勿用全局 rank 打散客户/商务/状态）。
 * 10 单据 | 20 客户联系 | 30 交期与结算 | 40 状态标识 | 50 关联单 | 80 备注
 */
export const SALES_REVIEW_BASIC_FIELD_RANK = {
  review_code: 10,
  review_date: 11,
  customer_name: 20,
  project_name: 21,
  customer_contact: 22,
  customer_phone: 23,
  salesman_name: 24,
  delivery_date: 30,
  settlement_method: 31,
  payment_cycle: 32,
  total_amount: 33,
  urgency: 40,
  risk_level: 41,
  status: 42,
  quotation_code: 50,
  sales_order_code: 51,
  remarks: 80,
} as const;

const dash = (value: unknown) => {
  if (value == null || value === '') return '—';
  return String(value);
};

const formatMoney = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : '—';
};

export function buildSalesReviewBasicColumns(
  t: TFunction,
  variant: SalesReviewBasicInfoVariant,
): ProDescriptionsItemProps<SalesReview>[] {
  const cols: ProDescriptionsItemProps<SalesReview>[] = [
    ...(variant === 'drawer'
      ? [
          { title: t('app.kuaizhizao.salesReview.colReviewCode'), dataIndex: 'review_code' as const, render: (_, row) => dash(row.review_code) },
          {
            title: t('app.kuaizhizao.salesReview.fieldReviewDate'),
            dataIndex: 'review_date' as const,
            render: (_: unknown, row: SalesReview) =>
              row.review_date ? formatBusinessDateOnly(row.review_date) : '—',
          },
        ]
      : []),
    { title: t('app.kuaizhizao.salesReview.colCustomer'), dataIndex: 'customer_name', render: (_, row) => dash(row.customer_name) },
    { title: t('app.kuaizhizao.salesReview.colProjectName'), dataIndex: 'project_name', render: (_, row) => dash(row.project_name) },
    { title: t('app.kuaizhizao.salesReview.fieldContact'), dataIndex: 'customer_contact', render: (_, row) => dash(row.customer_contact) },
    { title: t('app.kuaizhizao.salesReview.fieldPhone'), dataIndex: 'customer_phone', render: (_, row) => dash(row.customer_phone) },
    { title: t('app.kuaizhizao.salesReview.colSalesman'), dataIndex: 'salesman_name', render: (_, row) => dash(row.salesman_name) },
    {
      title: t('app.kuaizhizao.salesReview.fieldDeliveryDate'),
      dataIndex: 'delivery_date',
      render: (_, row) => (row.delivery_date ? formatBusinessDateOnly(row.delivery_date) : '—'),
    },
    {
      title: t('app.kuaizhizao.salesReview.fieldSettlement'),
      dataIndex: 'settlement_method',
      render: (_, row) => dash(row.settlement_method),
    },
    {
      title: t('app.kuaizhizao.salesReview.fieldPaymentCycle'),
      dataIndex: 'payment_cycle',
      render: (_, row) =>
        row.payment_cycle ? (
          <DictionaryLabel
            dictionaryCode="PAYMENT_TERMS"
            value={row.payment_cycle}
            notFoundPlaceholder={row.payment_cycle}
          />
        ) : (
          '—'
        ),
    },
    {
      title: t('app.kuaizhizao.salesReview.colTotalAmount'),
      dataIndex: 'total_amount',
      render: (_, row) => formatMoney(row.total_amount),
    },
    {
      title: t('app.kuaizhizao.salesReview.fieldUrgency'),
      dataIndex: 'urgency',
      render: (_, row) => renderSalesReviewUrgencyMarkerTag(t, row.urgency),
    },
    {
      title: t('app.kuaizhizao.salesReview.fieldRiskLevel'),
      dataIndex: 'risk_level',
      render: (_, row) => renderSalesReviewRiskMarkerTag(t, row.risk_level),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      render: (_, row) => renderSalesReviewStatusTag(t, row.status),
    },
    ...(variant === 'modal'
      ? [
          {
            key: 'quotation_code',
            title: t('app.kuaizhizao.salesReview.colQuotation'),
            dataIndex: 'quotation_code' as const,
            render: (_: unknown, row: SalesReview) => dash(row.quotation_code),
          },
        ]
      : [
          {
            title: t('app.kuaizhizao.salesReview.colSalesOrder'),
            dataIndex: 'sales_order_code' as const,
            render: (_: unknown, row: SalesReview) => dash(row.sales_order_code),
          },
        ]),
    {
      title: t('common.remark'),
      dataIndex: 'remarks',
      span: 3,
      render: (_, row) => dash(row.remarks),
    },
  ];

  return alignDescriptionColumns(cols, SALES_REVIEW_BASIC_FIELD_RANK) as ProDescriptionsItemProps<SalesReview>[];
}

export function salesReviewBasicDescriptionItems(
  columns: ProDescriptionsItemProps<SalesReview>[],
  review: SalesReview,
): NonNullable<DescriptionsProps['items']> {
  return columns.map((col, index) => {
    const dataIndex = col.dataIndex as keyof SalesReview | undefined;
    const raw = dataIndex ? review[dataIndex] : undefined;
    const children = col.render
      ? col.render(raw, review, index, undefined as never, col as never)
      : dash(raw);
    return {
      key: String(col.key ?? col.dataIndex ?? index),
      label: col.title,
      span: col.span,
      children,
    };
  });
}

export type SalesReviewBasicInfoProps = {
  review: SalesReview;
  variant?: SalesReviewBasicInfoVariant;
};

export const SalesReviewBasicInfo: React.FC<SalesReviewBasicInfoProps> = ({
  review,
  variant = 'modal',
}) => {
  const { t } = useTranslation();
  const items = useMemo(() => {
    const columns = buildSalesReviewBasicColumns(t, variant);
    return salesReviewBasicDescriptionItems(columns, review);
  }, [review, t, variant]);

  return <Descriptions size="small" column={3} items={items} />;
};
