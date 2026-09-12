import type { TFunction } from 'i18next';
import {
  buildFactoryImportTemplate,
  type FactoryImportFieldDef,
} from '../../../../../utils/spreadsheetImportTemplate';

const NS = 'app.kuaicaiwu.fixedAssets.assets.import';

export const FA_ASSET_STATUS_LABELS: Record<string, string> = {
  active: '在用',
  idle: '闲置',
  disposed: '已清理',
  scrapped: '已报废',
};

export const FA_DEPRECIATION_METHOD_LABELS: Record<string, string> = {
  straight_line: '年限平均法',
};

export function buildFaAssetImportTemplate(
  t: TFunction,
  categoryNames: string[],
) {
  const statusOptions = Object.values(FA_ASSET_STATUS_LABELS);
  const deprOptions = Object.values(FA_DEPRECIATION_METHOD_LABELS);
  const changeOptions = ['购入', '受捐', '盘盈', '自建', '导入', '其他'];

  const fields: FactoryImportFieldDef[] = [
    { field: 'asset_code', labelKey: `${NS}.assetCode`, aliases: ['资产编号'] },
    { field: 'asset_name', required: true, labelKey: `${NS}.assetName`, aliases: ['资产名称'] },
    {
      field: 'category_name',
      required: true,
      labelKey: `${NS}.category`,
      aliases: ['类别', '资产类别'],
      options: categoryNames,
    },
    {
      field: 'change_method',
      required: true,
      labelKey: `${NS}.changeMethod`,
      aliases: ['变动方式'],
      options: changeOptions,
    },
    { field: 'quantity', required: true, labelKey: `${NS}.quantity`, aliases: ['数量'] },
    { field: 'unit', labelKey: `${NS}.unit`, aliases: ['计量单位', '单位'] },
    {
      field: 'useful_life_months',
      labelKey: `${NS}.usefulLifeMonths`,
      aliases: ['预计使用期间数', '使用月数', '预计折旧期间数'],
    },
    {
      field: 'department_name',
      required: true,
      labelKey: `${NS}.department`,
      aliases: ['使用部门'],
    },
    { field: 'user_name', labelKey: `${NS}.user`, aliases: ['使用人'] },
    {
      field: 'status',
      labelKey: `${NS}.status`,
      aliases: ['使用状态', '状态'],
      options: statusOptions,
    },
    { field: 'location', labelKey: `${NS}.location`, aliases: ['存放地点'] },
    {
      field: 'start_use_date',
      required: true,
      labelKey: `${NS}.startUseDate`,
      aliases: ['开始使用日期'],
    },
    {
      field: 'entry_date',
      required: true,
      labelKey: `${NS}.entryDate`,
      aliases: ['入账日期'],
    },
    { field: 'specification', labelKey: `${NS}.specification`, aliases: ['规格型号'] },
    { field: 'notes', labelKey: `${NS}.notes`, aliases: ['备注'] },
    {
      field: 'depreciation_method',
      required: true,
      labelKey: `${NS}.depreciationMethod`,
      aliases: ['折旧方法'],
      options: deprOptions,
    },
    {
      field: 'original_value',
      required: true,
      labelKey: `${NS}.originalValue`,
      aliases: ['原值'],
    },
    { field: 'impairment_value', labelKey: `${NS}.impairmentValue`, aliases: ['减值准备'] },
    {
      field: 'depreciated_periods',
      labelKey: `${NS}.depreciatedPeriods`,
      aliases: ['已折旧期间数'],
    },
    {
      field: 'accumulated_depreciation',
      labelKey: `${NS}.accumulatedDepreciation`,
      aliases: ['累计折旧'],
    },
    {
      field: 'residual_rate',
      required: true,
      labelKey: `${NS}.residualRate`,
      aliases: ['净残值率', '残值率'],
    },
    {
      field: 'accumulated_depreciation_account_code',
      required: true,
      labelKey: `${NS}.accumDeprAccount`,
      aliases: ['累计折旧科目'],
    },
    {
      field: 'expense_account_code',
      required: true,
      labelKey: `${NS}.expenseAccount`,
      aliases: ['折旧费用科目'],
    },
    {
      field: 'asset_account_code',
      labelKey: `${NS}.assetAccount`,
      aliases: ['固定资产科目'],
    },
  ];

  const exampleValues = [
    '',
    t(`${NS}.exampleName`, { defaultValue: '示例办公电脑' }),
    categoryNames[0] || '办公设备',
    '购入',
    '1',
    '台',
    '60',
    t(`${NS}.exampleDept`, { defaultValue: '行政部' }),
    t(`${NS}.exampleUser`, { defaultValue: '张三' }),
    '在用',
    t(`${NS}.exampleLocation`, { defaultValue: '1楼仓库' }),
    '2026-09-01',
    '2026-09-01',
    'ThinkPad T14',
    '',
    '年限平均法',
    '10000',
    '0',
    '0',
    '0',
    '0.05',
    '1602',
    '6602',
    '1601',
  ];

  return buildFactoryImportTemplate(t, fields, exampleValues);
}

export function parseFaAssetStatusLabel(label: string): string | undefined {
  const trimmed = label.trim();
  if (!trimmed) return undefined;
  const entry = Object.entries(FA_ASSET_STATUS_LABELS).find(([, v]) => v === trimmed);
  if (entry) return entry[0];
  if (['active', 'idle', 'disposed', 'scrapped'].includes(trimmed)) return trimmed;
  return undefined;
}

export function parseFaDepreciationMethodLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed || trimmed === '年限平均法' || trimmed === '直线法') return 'straight_line';
  return trimmed;
}

export function parseFaResidualRate(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (trimmed.endsWith('%')) {
    const n = Number(trimmed.slice(0, -1));
    return Number.isFinite(n) ? n / 100 : undefined;
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return undefined;
  return n > 1 ? n / 100 : n;
}
