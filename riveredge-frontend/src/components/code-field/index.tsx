/**
 * 编号字段组件
 *
 * 支持自动生成编号和手动填写，根据编号规则配置自动处理。
 * 编辑态可通过 documentId 查询全站统一编号可编辑性（草稿或无下游可改）。
 */

import React, { useEffect, useState, useRef } from 'react';
import { ProFormText, type ProFormInstance } from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { getCodeRulePageConfig, generateCode, testGenerateCode, getDocumentCodeEditability } from '../../services/codeRule';
import type { CodeRulePageConfig } from '../../services/codeRule';

/** 编号重复校验时传给后端的实体类型（与 CodeGenerationService._check_code_exists 对齐） */
const ENTITY_TYPE_BY_PAGE_CODE: Record<string, string> = {
  'master-data-material': 'material',
  'master-data-process-route': 'process_route',
  'master-data-engineering-bom': 'bom',
  'master-data-factory-work-center': 'work_center',
  'kuaizhizao-sales-order': 'sales_order',
  'kuaizhizao-production-work-order': 'work_order',
  'kuaizhizao-equipment-management-equipment': 'equipment',
  'kuaizhizao-equipment-management-measuring-instruments': 'equipment',
  'kuaizhizao-equipment-management-mold': 'mold',
  'kuaizhizao-equipment-management-tool': 'tool',
};

interface CodeFieldProps {
  /** 页面代码（如：kuaizhizao-sales-order） */
  pageCode: string;
  /** 字段名称（如：order_code） */
  name: string;
  /** 字段标签（如：订单编号） */
  label?: string;
  /** 是否必填 */
  required?: boolean;
  /** 表单值变化回调 */
  onChange?: (value: string) => void;
  /** 表单字段值 */
  value?: string;
  /** 是否禁用（业务字段级禁用，与编号锁定叠加） */
  disabled?: boolean;
  /** 编辑中的单据 ID；设置后按全站规则查询编号是否可改 */
  documentId?: number | null;
  /** 详情 API 已返回的可编辑状态时优先使用，跳过重复查询 */
  codeEditable?: boolean;
  /** 详情 API 已返回的锁定原因 i18n key */
  lockedReason?: string | null;
  /** 上下文变量（用于编号规则中的字段引用） */
  context?: Record<string, any>;
  /** 是否在新建时自动生成 */
  autoGenerateOnCreate?: boolean;
  /** 是否显示生成按钮 */
  showGenerateButton?: boolean;
  /** 列属性（用于布局） */
  colProps?: { span?: number };
  /** 字段属性 */
  fieldProps?: Record<string, any>;
  /** 父级 FormModal 的 formRef；弹窗内自动生成时优先使用，避免 useFormInstance 尚未就绪写值失败 */
  formRef?: React.RefObject<ProFormInstance | undefined | null>;
  /** 新建会话令牌（每次打开新建弹窗递增），触发重新拉取规则并预览下一个编号 */
  generateSessionKey?: string | number;
}

const CodeField: React.FC<CodeFieldProps> = ({
  pageCode,
  name,
  label,
  required = false,
  onChange,
  value,
  disabled = false,
  documentId,
  codeEditable,
  lockedReason,
  context = {},
  autoGenerateOnCreate = true,
  showGenerateButton = false,
  colProps,
  fieldProps = {},
  formRef: externalFormRef,
  generateSessionKey,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const form = Form.useFormInstance();
  const [pageConfig, setPageConfig] = useState<CodeRulePageConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchedEditability, setFetchedEditability] = useState<{
    editable: boolean;
    lockedReason: string | null;
  } | null>(null);
  const pendingCodeRef = useRef<string | null>(null);
  const contextRef = useRef(context);
  contextRef.current = context;

  const resolveFormInstance = React.useCallback((): ProFormInstance | undefined => {
    // 弹窗 destroyOnHidden 后父级 formRef 可能仍指向已销毁实例；ProForm 子树内优先用 useFormInstance
    if (form && typeof form.setFieldsValue === 'function') {
      return form as ProFormInstance;
    }
    const external = externalFormRef?.current;
    if (external && typeof external.setFieldsValue === 'function') {
      return external as ProFormInstance;
    }
    return undefined;
  }, [externalFormRef, form]);

  const updateFormValue = React.useCallback((code: string) => {
    if (onChange) {
      onChange(code);
      return;
    }
    const inst = resolveFormInstance();
    if (inst) {
      inst.setFieldsValue({ [name]: code });
      pendingCodeRef.current = null;
      return;
    }
    pendingCodeRef.current = code;
  }, [name, onChange, resolveFormInstance]);

  useEffect(() => {
    if (pendingCodeRef.current == null) {
      return;
    }
    const inst = resolveFormInstance();
    if (!inst) {
      return;
    }
    inst.setFieldsValue({ [name]: pendingCodeRef.current });
    pendingCodeRef.current = null;
  }, [form, name, pageConfig, generateSessionKey, resolveFormInstance]);

  useEffect(() => {
    if (!documentId) {
      setFetchedEditability(null);
      return;
    }
    if (codeEditable !== undefined) {
      setFetchedEditability({
        editable: codeEditable,
        lockedReason: lockedReason ?? null,
      });
      return;
    }
    let cancelled = false;
    getDocumentCodeEditability(pageCode, documentId)
      .then((res) => {
        if (cancelled) return;
        setFetchedEditability({
          editable: res.editable,
          lockedReason: res.locked_reason ?? null,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('查询编号可编辑性失败:', error);
        setFetchedEditability({ editable: false, lockedReason: null });
      });
    return () => {
      cancelled = true;
    };
  }, [pageCode, documentId, codeEditable, lockedReason]);

  const effectiveEditable = codeEditable ?? fetchedEditability?.editable ?? true;
  const effectiveLockedReason = lockedReason ?? fetchedEditability?.lockedReason ?? null;
  const codeEditLocked = documentId != null && !effectiveEditable;

  /**
   * 生成编号
   */
  const handleGenerateCode = React.useCallback(async (config: CodeRulePageConfig, isTest = false) => {
    if (!config?.ruleCode) {
      message.warning(t('components.codeField.ruleNotConfigured'));
      return;
    }

    try {
      setLoading(true);

      const entityType = ENTITY_TYPE_BY_PAGE_CODE[pageCode];

      const response = isTest
        ? await testGenerateCode({
            rule_code: config.ruleCode,
            context,
            check_duplicate: true,
            entity_type: entityType,
          })
        : await generateCode({
            rule_code: config.ruleCode,
            context,
          });
      
      if (response.code) {
        updateFormValue(response.code);
      }
    } catch (error: any) {
      console.error('生成编号失败:', error);
      message.error(error.message || t('components.codeField.generateFailed'));
    } finally {
      setLoading(false);
    }
  }, [context, message, pageCode, t, updateFormValue]);

  const generateCodeWithContext = React.useCallback(async (config: CodeRulePageConfig, currentContext: Record<string, any>) => {
    if (!config?.autoGenerate || !config?.ruleCode) {
      return;
    }

    const entityType = ENTITY_TYPE_BY_PAGE_CODE[pageCode];

    try {
      const inst = resolveFormInstance();
      if (inst && !value) {
        inst.setFieldsValue({ [name]: undefined });
      }
      const response = await testGenerateCode({
        rule_code: config.ruleCode,
        context: currentContext,
        check_duplicate: true,
        entity_type: entityType,
      });
      const code = (response.code ?? '').trim();
      if (code) {
        updateFormValue(code);
      } else {
        message.warning(t('components.codeField.ruleNotConfigured'));
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || String(error);
      console.error('自动生成编号失败:', errorMessage);
      message.error(errorMessage || t('components.codeField.generateFailed'));
    }
  }, [message, name, pageCode, resolveFormInstance, t, updateFormValue, value]);

  useEffect(() => {
    if (!autoGenerateOnCreate) {
      return;
    }

    let cancelled = false;

    const loadConfig = async () => {
      try {
        const config = await getCodeRulePageConfig(pageCode);
        if (cancelled) {
          return;
        }
        setPageConfig(config);

        if (!config?.autoGenerate || !config?.ruleCode || value) {
          return;
        }
        await generateCodeWithContext(config, contextRef.current);
      } catch (error) {
        if (cancelled) {
          return;
        }
        console.error('加载编号规则配置失败:', error);
      }
    };
    void loadConfig();

    return () => {
      cancelled = true;
    };
  }, [pageCode, autoGenerateOnCreate, generateSessionKey, value, generateCodeWithContext]);

  useEffect(() => {
    if (!autoGenerateOnCreate || !pageConfig?.autoGenerate || !pageConfig?.ruleCode) {
      return;
    }
    if (value) {
      return;
    }
    if (!context || Object.keys(context).length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      generateCodeWithContext(pageConfig, context);
    }, 300);
    return () => clearTimeout(timer);
  }, [context, pageConfig, autoGenerateOnCreate, value, generateCodeWithContext]);

  const fieldLabel = label || pageConfig?.codeFieldLabel || t('components.codeField.defaultLabel');
  const lockedExtra = codeEditLocked && effectiveLockedReason
    ? t(effectiveLockedReason)
    : undefined;
  const inputDisabled = disabled || codeEditLocked;

  if (!pageConfig || !pageConfig.autoGenerate) {
    return (
      <ProFormText
        name={name}
        label={fieldLabel}
        rules={required ? [{ required: true, message: t('components.codeField.required', { label: fieldLabel }) }] : []}
        placeholder={t('components.codeField.enterPlaceholder', { label: fieldLabel })}
        disabled={inputDisabled}
        colProps={colProps}
        extra={lockedExtra}
        fieldProps={{
          ...fieldProps,
          value: value,
          onChange: (e: any) => onChange?.(e.target.value),
        }}
      />
    );
  }

  const canEdit = pageConfig.allowManualEdit !== false;

  const mergedFieldProps = {
    ...fieldProps,
    ...(showGenerateButton ? {
      suffix: (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => handleGenerateCode(pageConfig, false)}
            disabled={inputDisabled}
          >
            {t('components.codeField.generate')}
          </Button>
        </Space>
      ),
    } : {}),
  };

  return (
    <ProFormText
      name={name}
      label={fieldLabel}
      rules={required ? [{ required: true, message: t('components.codeField.required', { label: fieldLabel }) }] : []}
      placeholder={t('components.codeField.enterPlaceholder', { label: fieldLabel })}
      disabled={inputDisabled || (!canEdit && !!value)}
      colProps={colProps}
      extra={lockedExtra}
      fieldProps={{
        ...mergedFieldProps,
        value: value,
        onChange: (e: any) => onChange?.(e.target.value),
      }}
    />
  );
};

export default CodeField;
