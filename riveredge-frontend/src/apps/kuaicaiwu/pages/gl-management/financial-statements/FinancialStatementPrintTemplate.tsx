import { formatAmount } from '../../../../../utils/format';
/**
 * 三大报表法定打印版式（对标小企业准则 Excel 模板）
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import './FinancialStatementPrintTemplate.less';

export type StatementKind = 'balance-sheet' | 'income' | 'cash-flow';
export type StatementRow = Record<string, unknown>;

const NS = 'app.kuaicaiwu.gl.statements';

export function formatStatementMoney(value: unknown): string {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n === 0) return '—';
  return formatAmount(n);
}

function sideCell(row: StatementRow | undefined): StatementRow | undefined {
  if (!row) return undefined;
  return row;
}

function isHeaderCell(cell: StatementRow | undefined): boolean {
  return Boolean(cell?.is_header);
}

function isTotalCell(cell: StatementRow | undefined): boolean {
  return Boolean(cell?.is_total);
}

export interface FinancialStatementPrintTemplateProps {
  kind: StatementKind;
  title: string;
  year: number;
  month: number;
  companyName: string;
  preparedBy?: string;
  printTime?: string;
  rows: StatementRow[];
  summary?: StatementRow | null;
}

const FinancialStatementPrintTemplate: React.FC<FinancialStatementPrintTemplateProps> = ({
  kind,
  title,
  year,
  month,
  companyName,
  preparedBy,
  printTime,
  rows,
}) => {
  const { t } = useTranslation();
  const lastDay = new Date(year, month, 0).getDate();
  const periodLabel =
    kind === 'balance-sheet'
      ? t(`${NS}.print.asOf`, {
          defaultValue: '{{year}}年{{month}}月{{day}}日',
          year,
          month: String(month).padStart(2, '0'),
          day: String(lastDay).padStart(2, '0'),
        })
      : t(`${NS}.print.period`, {
          defaultValue: '{{year}}年{{month}}月',
          year,
          month: String(month).padStart(2, '0'),
        });

  return (
    <div className="fs-print-sheet">
      <h1 className="fs-print-title">{title}</h1>
      <div className="fs-print-meta">
        <span>
          {t(`${NS}.print.company`, { defaultValue: '编制单位' })}：{companyName || '—'}
        </span>
        <span>{periodLabel}</span>
        <span>{t(`${NS}.print.unit`, { defaultValue: '单位：元' })}</span>
      </div>

      {kind === 'balance-sheet' ? (
        <table className="fs-print-table fs-print-table-balance">
          <colgroup>
            <col className="col-item" />
            <col className="col-line" />
            <col className="col-amt" />
            <col className="col-amt" />
            <col className="col-item" />
            <col className="col-line" />
            <col className="col-amt" />
            <col className="col-amt" />
          </colgroup>
          <thead>
            <tr>
              <th className="col-item">{t(`${NS}.print.asset`, { defaultValue: '资产' })}</th>
              <th className="col-line">{t(`${NS}.print.lineNo`, { defaultValue: '行次' })}</th>
              <th className="col-amt">{t(`${NS}.col.amount`, { defaultValue: '期末余额' })}</th>
              <th className="col-amt">{t(`${NS}.col.openingAmount`, { defaultValue: '年初余额' })}</th>
              <th className="col-item">{t(`${NS}.print.liabEquity`, { defaultValue: '负债和所有者权益' })}</th>
              <th className="col-line">{t(`${NS}.print.lineNo`, { defaultValue: '行次' })}</th>
              <th className="col-amt">{t(`${NS}.col.amount`, { defaultValue: '期末余额' })}</th>
              <th className="col-amt">{t(`${NS}.col.openingAmount`, { defaultValue: '年初余额' })}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((pair, idx) => {
              const left = sideCell(pair.asset as StatementRow | undefined);
              const right = sideCell(pair.liability_equity as StatementRow | undefined);
              return (
                <tr key={String(pair.line_key ?? idx)}>
                  <td className={isTotalCell(left) ? 'is-total' : isHeaderCell(left) ? 'is-header' : left?.indent ? 'is-indent' : ''}>
                    {left?.label ? String(left.label) : ''}
                  </td>
                  <td className="col-line">{left?.line_no != null ? String(left.line_no) : ''}</td>
                  <td className={`col-amt${isTotalCell(left) ? ' is-total' : ''}`}>
                    {left && !isHeaderCell(left) ? formatStatementMoney(left.ending_amount) : ''}
                  </td>
                  <td className={`col-amt${isTotalCell(left) ? ' is-total' : ''}`}>
                    {left && !isHeaderCell(left) ? formatStatementMoney(left.opening_amount) : ''}
                  </td>
                  <td className={isTotalCell(right) ? 'is-total' : isHeaderCell(right) ? 'is-header' : right?.indent ? 'is-indent' : ''}>
                    {right?.label ? String(right.label) : ''}
                  </td>
                  <td className="col-line">{right?.line_no != null ? String(right.line_no) : ''}</td>
                  <td className={`col-amt${isTotalCell(right) ? ' is-total' : ''}`}>
                    {right && !isHeaderCell(right) ? formatStatementMoney(right.ending_amount) : ''}
                  </td>
                  <td className={`col-amt${isTotalCell(right) ? ' is-total' : ''}`}>
                    {right && !isHeaderCell(right) ? formatStatementMoney(right.opening_amount) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {kind === 'income' || kind === 'cash-flow' ? (
        <table className="fs-print-table">
          <thead>
            <tr>
              <th className="col-item">{t(`${NS}.col.label`, { defaultValue: '项目' })}</th>
              <th className="col-line">{t(`${NS}.print.lineNo`, { defaultValue: '行次' })}</th>
              <th className="col-amt">{t(`${NS}.col.yearAmount`, { defaultValue: '本年累计金额' })}</th>
              <th className="col-amt">{t(`${NS}.col.monthAmount`, { defaultValue: '本月金额' })}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={String(row.line_key ?? idx)}
                className={
                  row.is_header
                    ? 'is-header'
                    : isTotalCell(row)
                      ? 'is-total'
                      : row.indent
                        ? 'is-indent'
                        : ''
                }
              >
                <td>{row.indent ? `\u3000\u3000${String(row.label || '')}` : String(row.label || '')}</td>
                <td className="col-line">{row.line_no != null ? String(row.line_no) : ''}</td>
                <td className="col-amt">{row.is_header ? '' : formatStatementMoney(row.year_amount)}</td>
                <td className="col-amt">{row.is_header ? '' : formatStatementMoney(row.period_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div className="fs-print-sign">
        <span>{t(`${NS}.print.legal`, { defaultValue: '单位负责人' })}：________</span>
        <span>{t(`${NS}.print.accountant`, { defaultValue: '会计机构负责人' })}：________</span>
        <span>
          {t(`${NS}.print.preparedBy`, { defaultValue: '制表人' })}：{preparedBy || '________'}
        </span>
      </div>
      {printTime ? (
        <div className="fs-print-time">
          {t(`${NS}.print.printedAt`, { defaultValue: '打印时间' })}：{printTime}
        </div>
      ) : null}
    </div>
  );
};

export default FinancialStatementPrintTemplate;
