/**
 * 总账科目表（树形多级科目，编码规则默认 4-2-2-2）
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Button, Modal, Popconfirm, Radio, Space, Spin, Typography } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { rowActionKind } from '../../../../../components/uni-action';
import { UniTable } from '../../../../../components/uni-table';
import {
  FormModalTemplate,
  ListPageTemplate,
  MODAL_CONFIG,
} from '../../../../../components/layout-templates';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../../utils/uniTableLayoutColumns';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import { glService, type GlAccount, type GlCoaSeedTemplate } from '../../../services/gl';
import { buildListPageHelpViewConfig } from '../../../../../components/page-help-wiki';
import { alignProColumns, GLOBAL_DOC_LIST_FIELD_RANK } from '../../../../kuaizhizao/pages/sales-management/shared/documentFieldAlignment';

const NS = 'app.kuaicaiwu.gl.chartOfAccounts';

const asList = <T,>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];
  const obj = res as { data?: T[]; items?: T[] } | null;
  return obj?.data ?? obj?.items ?? [];
};

type GlAccountTree = GlAccount & { children?: GlAccountTree[] };

const codeLengthsFromRule = (rule: string): number[] => {
  const parts = String(rule || '4-2-2-2')
    .split('-')
    .map((x) => parseInt(x, 10))
    .filter((n) => !Number.isNaN(n));
  if (!parts.length) {
    return [4, 6, 8, 10];
  }
  let acc = 0;
  return parts.map((p) => {
    acc += p;
    return acc;
  });
};

const maxAccountLevel = (rule: string): number => codeLengthsFromRule(rule).length;

const expectedCodeLength = (rule: string, level: number): number => {
  const lengths = codeLengthsFromRule(rule);
  return lengths[level - 1] ?? lengths[lengths.length - 1] ?? 4;
};

const buildGlAccountTree = (flat: GlAccount[]): GlAccountTree[] => {
  const byId = new Map<number, GlAccountTree>();
  flat.forEach((row) => byId.set(row.id, { ...row, children: [] }));
  const roots: GlAccountTree[] = [];
  flat.forEach((row) => {
    const node = byId.get(row.id);
    if (!node) return;
    const parentId = row.parent_id;
    if (parentId != null && byId.has(parentId)) {
      byId.get(parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  const prune = (nodes: GlAccountTree[]) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        prune(node.children);
      } else {
        delete node.children;
      }
    });
  };
  prune(roots);
  return roots;
};

const collectTreeKeys = (nodes: GlAccountTree[]): React.Key[] => {
  const keys: React.Key[] = [];
  const walk = (items: GlAccountTree[]) => {
    items.forEach((item) => {
      keys.push(item.id);
      if (item.children?.length) {
        walk(item.children);
      }
    });
  };
  walk(nodes);
  return keys;
};

const ChartOfAccountsPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const treeDataRef = useRef<GlAccountTree[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GlAccount | null>(null);
  const [parentAccount, setParentAccount] = useState<GlAccount | null>(null);
  const [accountTypeTab, setAccountTypeTab] = useState<string>('');
  const [accountCodeRule, setAccountCodeRule] = useState('4-2-2-2');
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [accountNameById, setAccountNameById] = useState<Record<number, string>>({});
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [seedTemplatesLoading, setSeedTemplatesLoading] = useState(false);
  const [seedTemplates, setSeedTemplates] = useState<GlCoaSeedTemplate[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('cas_manufacturing');

  const accountTypeOptions = useMemo(
    () => [
      { label: t(`${NS}.type.asset`, { defaultValue: '资产' }), value: 'asset' },
      { label: t(`${NS}.type.liability`, { defaultValue: '负债' }), value: 'liability' },
      { label: t(`${NS}.type.equity`, { defaultValue: '权益' }), value: 'equity' },
      { label: t(`${NS}.type.cost`, { defaultValue: '成本' }), value: 'cost' },
      { label: t(`${NS}.type.profitLoss`, { defaultValue: '损益' }), value: 'profit_loss' },
    ],
    [t],
  );

  const balanceDirectionOptions = useMemo(
    () => [
      { label: t(`${NS}.direction.debit`, { defaultValue: '借' }), value: 'debit' },
      { label: t(`${NS}.direction.credit`, { defaultValue: '贷' }), value: 'credit' },
    ],
    [t],
  );

  const typeLabel = (type: string) =>
    accountTypeOptions.find((o) => o.value === type)?.label || type;

  useEffect(() => {
    void glService.getSettings().then((res) => {
      const rule = String((res as { account_code_rule?: string })?.account_code_rule || '4-2-2-2');
      setAccountCodeRule(rule);
    });
  }, []);

  const openCreateModal = useCallback(
    (parent?: GlAccount | null, presetType?: string) => {
      setEditing(null);
      setParentAccount(parent ?? null);
      setModalOpen(true);
      window.setTimeout(() => {
        formRef.current?.setFieldsValue({
          account_code: '',
          account_name: '',
          account_type: parent?.account_type || presetType || accountTypeTab || 'asset',
          balance_direction: parent?.balance_direction || 'debit',
          aux_customer: false,
          aux_supplier: false,
          aux_department: false,
          aux_employee: false,
          aux_project: false,
          is_cash_journal: false,
          is_bank_journal: false,
          is_controlled: false,
          notes: undefined,
        });
      }, 0);
    },
    [accountTypeTab],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    setParentAccount(null);
  }, []);

  const createLevel = parentAccount ? (parentAccount.level || 1) + 1 : 1;
  const createCodeLength = expectedCodeLength(accountCodeRule, createLevel);
  const canAddChild = (record: GlAccount) => (record.level || 1) < maxAccountLevel(accountCodeRule);

  const handleBatchDelete = async (keys: React.Key[]) => {
    for (const id of keys) {
      await glService.deleteAccount(Number(id));
    }
    messageApi.success(t('common.batchDeleteSuccess', { count: keys.length }));
    actionRef.current?.reload();
  };

  const columns: ProColumns<GlAccount>[] = useMemo(
    () =>
      alignProColumns(
        [
          {
            // 稀疏：编码 KeepWidth；名称唯一 RemainderFlex；不叠列
            title: t(`${NS}.col.accountCode`),
            dataIndex: 'account_code',
            width: 140,
            minWidth: 140,
            uniTableKeepWidth: true,
            resizable: false,
            fixed: 'left',
            fieldProps: { allowClear: true },
            copyable: true,
            ellipsis: true,
          },
          {
            title: t(`${NS}.field.accountName`),
            dataIndex: 'account_name',
            minWidth: 160,
            uniTableRemainderFlex: true,
            uniTablePrimaryFlex: true,
            resizable: false,
            hideInSearch: true,
            ellipsis: true,
          },
          {
            title: t(`${NS}.col.parentAccount`, { defaultValue: '上级科目' }),
            dataIndex: 'parent_id',
            width: 160,
            minWidth: 160,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            ellipsis: true,
            render: (_, r) => {
              if (!r.parent_id) return '-';
              return accountNameById[r.parent_id] || `#${r.parent_id}`;
            },
          },
          {
            title: t(`${NS}.col.accountType`),
            dataIndex: 'account_type',
            ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
            valueType: 'select',
            fieldProps: { options: accountTypeOptions, allowClear: true },
            render: (_, r) => <MarkerTag>{typeLabel(r.account_type)}</MarkerTag>,
          },
          {
            title: t(`${NS}.col.balanceDirection`),
            dataIndex: 'balance_direction',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) =>
              r.balance_direction === 'credit'
                ? t(`${NS}.direction.credit`)
                : t(`${NS}.direction.debit`),
          },
          {
            title: t(`${NS}.col.level`),
            key: 'account_level',
            dataIndex: 'level',
            width: 88,
            minWidth: 88,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
          },
          {
            title: t(`${NS}.col.aux`),
            key: 'aux',
            width: 180,
            minWidth: 180,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            ellipsis: true,
            render: (_, r) => {
              const tags: string[] = [];
              if (r.aux_customer) tags.push(t(`${NS}.aux.customer`));
              if (r.aux_supplier) tags.push(t(`${NS}.aux.supplier`));
              if (r.aux_department) tags.push(t(`${NS}.aux.department`));
              return tags.length ? tags.join(' ') : '-';
            },
          },
          {
            title: t(`${NS}.col.flags`),
            key: 'flags',
            width: 200,
            minWidth: 200,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) => {
              const tags: React.ReactNode[] = [];
              if (r.is_cash_journal) {
                tags.push(
                  <MarkerTag key="cash" color="warning">
                    {t(`${NS}.flag.cash`)}
                  </MarkerTag>,
                );
              }
              if (r.is_bank_journal) {
                tags.push(
                  <MarkerTag key="bank" color="processing">
                    {t(`${NS}.flag.bank`)}
                  </MarkerTag>,
                );
              }
              if (r.is_controlled) {
                tags.push(
                  <MarkerTag key="ctrl" color="error">
                    {t(`${NS}.flag.controlled`)}
                  </MarkerTag>,
                );
              }
              return tags.length ? <Space size={4}>{tags}</Space> : '-';
            },
          },
          {
            title: t('common.enabled'),
            dataIndex: 'is_active',
            ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
            hideInSearch: true,
            render: (_, r) =>
              r.is_active ? (
                <MarkerTag color="success">{t('common.enabled')}</MarkerTag>
              ) : (
                <MarkerTag color="default">{t('common.disabled')}</MarkerTag>
              ),
          },
          {
            title: t('common.actions'),
            key: 'action',
            fixed: 'right',
            hideInSearch: true,
            render: (_, record) => [
              canAddChild(record) ? (
                <Button
                  key="add-child"
                  {...rowActionKind('create')}
                  onClick={() => openCreateModal(record)}
                >
                  {t(`${NS}.addChild`, { defaultValue: '新增' })}
                </Button>
              ) : null,
              <Button
                key="edit"
                {...rowActionKind('update')}
                onClick={() => {
                  setParentAccount(null);
                  setEditing(record);
                  setModalOpen(true);
                }}
              />,
              <Popconfirm
                key="del"
                title={t(`${NS}.confirmDelete`)}
                onConfirm={async () => {
                  try {
                    await glService.deleteAccount(record.id);
                    messageApi.success(t('common.deleteSuccess'));
    actionRef.current?.reload();
                  } catch (error) {
                    messageApi.error(getApiErrorMessage(error, t('common.deleteFailed')));
                  }
                }}
              >
                <Button {...rowActionKind('delete')} />
              </Popconfirm>,
            ],
          },
        ],
        GLOBAL_DOC_LIST_FIELD_RANK,
      ),
    [accountNameById, accountTypeOptions, messageApi, openCreateModal, t],
  );


  const openSeedModal = async () => {
    setSeedModalOpen(true);
    setSeedTemplatesLoading(true);
    try {
      const res = await glService.listAccountSeedTemplates();
      const items = asList<GlCoaSeedTemplate>(res);
      setSeedTemplates(items);
      const recommended = items.find((x) => x.recommended) ?? items[0];
      if (recommended?.key) {
        setSelectedTemplateKey(recommended.key);
      }
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, t(`${NS}.seedTemplatesFailed`, { defaultValue: '加载科目模板失败' })),
      );
      setSeedModalOpen(false);
    } finally {
      setSeedTemplatesLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!selectedTemplateKey) {
      messageApi.warning(t(`${NS}.seedSelectRequired`, { defaultValue: '请选择科目模板' }));
      return;
    }
    setSeedLoading(true);
    try {
      const result = await glService.seedAccounts(selectedTemplateKey);
      const created = Number(result?.created ?? 0);
      const skipped = Number(result?.skipped ?? 0);
      const templateName = String(result?.template_name || selectedTemplateKey);
      messageApi.success(
        t(`${NS}.seedSuccess`, {
          defaultValue: '已导入「{{templateName}}」：新增 {{created}}，已存在跳过 {{skipped}}',
          templateName,
          created,
          skipped,
        }),
      );
      setSeedModalOpen(false);
      actionRef.current?.reload();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, t(`${NS}.seedFailed`, { defaultValue: '导入失败' })));
    } finally {
      setSeedLoading(false);
    }
  };

  const handleSave = async (values: Record<string, unknown>) => {
    const payload: Partial<GlAccount> = {
      account_code: String(values.account_code || '').trim(),
      account_name: String(values.account_name || '').trim(),
      account_type: String(values.account_type || ''),
      balance_direction: String(values.balance_direction || 'debit'),
      aux_customer: Boolean(values.aux_customer),
      aux_supplier: Boolean(values.aux_supplier),
      aux_department: Boolean(values.aux_department),
      aux_employee: Boolean(values.aux_employee),
      aux_project: Boolean(values.aux_project),
      is_cash_journal: Boolean(values.is_cash_journal),
      is_bank_journal: Boolean(values.is_bank_journal),
      is_controlled: Boolean(values.is_controlled),
      notes: values.notes ? String(values.notes) : null,
      is_active: true,
      is_leaf: true,
    };
    if (parentAccount?.id) {
      payload.parent_id = parentAccount.id;
      payload.account_type = parentAccount.account_type;
      payload.balance_direction = parentAccount.balance_direction || payload.balance_direction;
    }
    try {
      if (editing?.id) {
        await glService.updateAccount(editing.id, payload);
        messageApi.success(t('common.updateSuccess', { defaultValue: '更新成功' }));
      } else {
        await glService.createAccount(payload);
        messageApi.success(t('common.createSuccess', { defaultValue: '创建成功' }));
        if (parentAccount?.id) {
          setExpandedRowKeys((prev) =>
            prev.includes(parentAccount.id) ? prev : [...prev, parentAccount.id],
          );
        }
      }
      closeModal();
      actionRef.current?.reload();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, t('common.saveFailed', { defaultValue: '保存失败' })));
    }
  };

  return (
    <ListPageTemplate>
      <UniTable<GlAccountTree>
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.pages.gl-management.chart-of-accounts.list-v4"
        viewTypes={['table', 'help']}
        helpViewConfig={buildListPageHelpViewConfig('kuaicaiwu.chartOfAccounts')}
        columns={columns}
        showAdvancedSearch
        skipFuzzyPinyinClientFilter
        pagination={false}
        request={async (params) => {
          try {
            const typeFilter =
              accountTypeTab || (params.account_type ? String(params.account_type) : undefined);
            const res = await glService.listAccounts({
              account_type: typeFilter || undefined,
            });
            let flat = asList<GlAccount>(res);
            const nameMap: Record<number, string> = {};
            flat.forEach((row) => {
              nameMap[row.id] = `${row.account_code} ${row.account_name}`.trim();
            });
            setAccountNameById(nameMap);
            const codeKw = String(params.account_code || '').trim();
            if (codeKw) {
              flat = flat.filter(
                (r) => r.account_code?.includes(codeKw) || r.account_name?.includes(codeKw),
              );
            }
            const tree = buildGlAccountTree(flat);
            treeDataRef.current = tree;
            return { data: tree, success: true, total: flat.length };
          } catch (error) {
            messageApi.error(
              getApiErrorMessage(error, t('common.loadFailed', { defaultValue: '加载失败' })),
            );
            return { data: [], success: false, total: 0 };
          }
        }}
        params={{ accountTypeTab }}
        showCreateButton
        createButtonText={t(`${NS}.create`, { defaultValue: '新建科目' })}
        onCreate={() => openCreateModal(null, accountTypeTab || undefined)}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as React.Key[]),
        }}
        enableRowSelection
        showDeleteButton
        deleteConfirmTitle={t('common.batchDeleteTitle')}
        deleteConfirmDescription={(count) => t('common.batchDeleteContent', { count })}
        onDelete={handleBatchDelete}
        showImportButton={false}
        showExportButton={false}
        rightToolBarActionsBeforeExport={[
          <Radio.Group
            key="type-tabs"
            value={accountTypeTab}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              setAccountTypeTab(String(e.target.value));
              actionRef.current?.reload();
            }}
            options={[
              { label: t(`${NS}.type.all`, { defaultValue: '全部' }), value: '' },
              ...accountTypeOptions,
            ]}
          />,
          <Button
            key="expand"
            {...rowActionKind('skip')}
            onClick={() => {
              if (expandedRowKeys.length > 0) {
                setExpandedRowKeys([]);
              } else if (treeDataRef.current.length) {
                setExpandedRowKeys(collectTreeKeys(treeDataRef.current));
              }
            }}
          >
            {expandedRowKeys.length > 0
              ? t(`${NS}.collapseAll`, { defaultValue: '全部收起' })
              : t(`${NS}.expandAll`, { defaultValue: '全部展开' })}
          </Button>,
          <Button
            key="seed"
            icon={<ImportOutlined />}
            onClick={() => void openSeedModal()}
          >
            {t(`${NS}.seed`, { defaultValue: '导入标准科目模板' })}
          </Button>,
        ]}
      />

      <FormModalTemplate
        title={
          editing
            ? t(`${NS}.editTitle`, { defaultValue: '编辑科目' })
            : parentAccount
              ? t(`${NS}.createChildTitle`, {
                  defaultValue: '新建下级科目',
                })
              : t(`${NS}.createTitle`, { defaultValue: '新建科目' })
        }
        open={modalOpen}
        onClose={closeModal}
        isEdit={Boolean(editing)}
        width={MODAL_CONFIG.STANDARD_WIDTH}
        formRef={formRef}
        initialValues={
          editing
            ? {
                account_code: editing.account_code,
                account_name: editing.account_name,
                account_type: editing.account_type,
                balance_direction: editing.balance_direction || 'debit',
                aux_customer: editing.aux_customer,
                aux_supplier: editing.aux_supplier,
                aux_department: editing.aux_department,
                aux_employee: editing.aux_employee,
                aux_project: editing.aux_project,
                is_cash_journal: editing.is_cash_journal,
                is_bank_journal: editing.is_bank_journal,
                is_controlled: editing.is_controlled,
                notes: editing.notes,
              }
            : {
                balance_direction: parentAccount?.balance_direction || 'debit',
                account_type: parentAccount?.account_type || accountTypeTab || 'asset',
              }
        }
        onFinish={handleSave}
        grid
      >
        {parentAccount ? (
          <ProFormText
            label={t(`${NS}.col.parentAccount`, { defaultValue: '上级科目' })}
            colProps={{ span: 24 }}
            disabled
            fieldProps={{
              value: `${parentAccount.account_code} ${parentAccount.account_name}`,
            }}
          />
        ) : null}
        <ProFormText
          name="account_code"
          label={t(`${NS}.field.accountCode`, { defaultValue: '科目编码' })}
          rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
          colProps={{ span: 12 }}
          disabled={Boolean(editing)}
          extra={
            editing
              ? undefined
              : t(`${NS}.field.accountCodeHint`, {
                  defaultValue: '规则 {{rule}}，第 {{level}} 级须 {{length}} 位{{prefix}}',
                  rule: accountCodeRule,
                  level: createLevel,
                  length: createCodeLength,
                  prefix: parentAccount
                    ? t(`${NS}.field.accountCodePrefix`, {
                        defaultValue: '，以 {{code}} 开头',
                        code: parentAccount.account_code,
                      })
                    : '',
                })
          }
          fieldProps={{
            placeholder: parentAccount
              ? `${parentAccount.account_code}${'0'.repeat(Math.max(0, createCodeLength - parentAccount.account_code.length))}`
              : `${'0'.repeat(createCodeLength)}`,
          }}
        />
        <ProFormText
          name="account_name"
          label={t(`${NS}.field.accountName`, { defaultValue: '科目名称' })}
          rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
          colProps={{ span: 12 }}
        />
        <ProFormSelect
          name="account_type"
          label={t(`${NS}.field.accountType`, { defaultValue: '科目类型' })}
          options={accountTypeOptions}
          rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
          colProps={{ span: 12 }}
          disabled={Boolean(editing || parentAccount)}
        />
        <ProFormSelect
          name="balance_direction"
          label={t(`${NS}.field.balanceDirection`, { defaultValue: '余额方向' })}
          options={balanceDirectionOptions}
          rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
          colProps={{ span: 12 }}
          disabled={Boolean(parentAccount)}
        />
        <ProFormCheckbox name="aux_customer" colProps={{ span: 8 }}>
          {t(`${NS}.aux.customer`, { defaultValue: '客户辅助' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="aux_supplier" colProps={{ span: 8 }}>
          {t(`${NS}.aux.supplier`, { defaultValue: '供应商辅助' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="aux_department" colProps={{ span: 8 }}>
          {t(`${NS}.aux.department`, { defaultValue: '部门辅助' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="aux_employee" colProps={{ span: 8 }}>
          {t(`${NS}.aux.employee`, { defaultValue: '职员辅助' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="aux_project" colProps={{ span: 8 }}>
          {t(`${NS}.aux.project`, { defaultValue: '项目辅助' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="is_cash_journal" colProps={{ span: 8 }}>
          {t(`${NS}.flag.cashJournal`, { defaultValue: '现金科目' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="is_bank_journal" colProps={{ span: 8 }}>
          {t(`${NS}.flag.bankJournal`, { defaultValue: '银行科目' })}
        </ProFormCheckbox>
        <ProFormCheckbox name="is_controlled" colProps={{ span: 8 }}>
          {t(`${NS}.flag.controlled`, { defaultValue: '受控科目' })}
        </ProFormCheckbox>
        <ProFormTextArea
          name="notes"
          label={t('common.remark', { defaultValue: '备注' })}
          colProps={{ span: 24 }}
          fieldProps={{ rows: 3 }}
        />
      </FormModalTemplate>

      <Modal
        title={t(`${NS}.seedModalTitle`, { defaultValue: '导入标准科目模板' })}
        open={seedModalOpen}
        onCancel={() => setSeedModalOpen(false)}
        onOk={() => void handleSeed()}
        confirmLoading={seedLoading}
        okText={t('common.import', { defaultValue: '导入' })}
        cancelText={t('common.cancel', { defaultValue: '取消' })}
        width={MODAL_CONFIG.STANDARD_WIDTH}
        destroyOnHidden
        mask={{ closable: !seedLoading }}
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {t(`${NS}.seedModalHint`, {
            defaultValue: '请按适用的会计准则与行业选择一套模板。已存在编码会跳过，不会覆盖已修改科目。',
          })}
        </Typography.Paragraph>
        {seedTemplatesLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin description={t('common.loading', { defaultValue: '加载中' })} />
          </div>
        ) : (
          <Radio.Group
            value={selectedTemplateKey}
            onChange={(e) => setSelectedTemplateKey(String(e.target.value))}
            style={{ width: '100%' }}
          >
            <Space orientation="vertical" style={{ width: '100%' }} size="medium">
              {seedTemplates.map((tpl) => (
                <Radio key={tpl.key} value={tpl.key} style={{ width: '100%', alignItems: 'flex-start' }}>
                  <div>
                    <Space size={8} wrap>
                      <span>{tpl.name}</span>
                      {tpl.recommended ? (
                        <MarkerTag>{t(`${NS}.seedRecommended`, { defaultValue: '推荐' })}</MarkerTag>
                      ) : null}
                      <Typography.Text type="secondary">
                        {t(`${NS}.seedAccountCount`, {
                          defaultValue: '{{count}} 个一级科目',
                          count: tpl.account_count,
                        })}
                      </Typography.Text>
                    </Space>
                    <div>
                      <Typography.Text type="secondary">{tpl.description}</Typography.Text>
                    </div>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Modal>
    </ListPageTemplate>
  );
};

export default ChartOfAccountsPage;
