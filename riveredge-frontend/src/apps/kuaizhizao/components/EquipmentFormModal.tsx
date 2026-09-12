/**
 * 设备新建弹窗（可复用，供工序表单等场景快速新增）
 */

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProFormInstance, ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import { App, Row, Col } from 'antd';
import { FormModalTemplate } from '../../../components/layout-templates';
import { MODAL_CONFIG } from '../../../components/layout-templates/constants';
import CodeField from '../../../components/code-field';
import { DictionarySelect } from '../../../components/dictionary-select';
import { equipmentApi } from '../services/equipment';
import { fetchEffectivePageCodeRule, testGenerateCode } from '../../../services/codeRule';

export interface EquipmentRecord {
  id?: number;
  uuid?: string;
  code?: string;
  name?: string;
  status?: string;
  is_active?: boolean;
}

export interface EquipmentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (equipment: EquipmentRecord) => void;
  zIndex?: number;
}

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  zIndex,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const formRef = useRef<ProFormInstance>();
  const [formLoading, setFormLoading] = useState(false);
  const [createCodeSessionKey, setCreateCodeSessionKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setCreateCodeSessionKey((key) => key + 1);
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({ is_active: true });
    let cancelled = false;
    void (async () => {
      try {
        const { ruleCode, autoGenerate } = await fetchEffectivePageCodeRule(
          'kuaizhizao-equipment-management-equipment',
        );
        if (cancelled || !autoGenerate) {
          return;
        }
        const preview = await testGenerateCode({
          rule_code: ruleCode,
          check_duplicate: true,
          entity_type: 'equipment',
        });
        if (cancelled) {
          return;
        }
        const code = (preview?.code ?? '').trim();
        if (!code) {
          messageApi.warning(t('app.master-data.codeRulePreviewHint'));
          return;
        }
        formRef.current?.setFieldsValue({ code, is_active: true });
      } catch (error: any) {
        if (cancelled) {
          return;
        }
        messageApi.error(error?.message || t('app.master-data.codeRuleAutoFailed'));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, messageApi, t]);

  const handleClose = () => {
    onClose();
    formRef.current?.resetFields();
  };

  const handleSubmit = async (values: Record<string, unknown>): Promise<void> => {
    try {
      setFormLoading(true);
      const payload = { ...values };
      if (!payload.code || !String(payload.code).trim()) {
        delete payload.code;
      }
      const created = await equipmentApi.create(payload);
      messageApi.success(t('app.kuaizhizao.equipment.createSuccess'));
      onSuccess(created);
      handleClose();
    } catch (error: any) {
      messageApi.error(error?.message || t('common.createFailed'));
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <FormModalTemplate
      title={t('app.kuaizhizao.equipment.create')}
      open={open}
      onClose={handleClose}
      onFinish={handleSubmit}
      isEdit={false}
      loading={formLoading}
      width={MODAL_CONFIG.STANDARD_WIDTH}
      formRef={formRef as React.RefObject<ProFormInstance>}
      initialValues={{ is_active: true }}
      grid={false}
      zIndex={zIndex}
    >
      <Row gutter={16}>
        <Col span={12}>
          <CodeField
            key={`equipment-quick-create-code-${createCodeSessionKey}`}
            pageCode="kuaizhizao-equipment-management-equipment"
            name="code"
            label={t('app.kuaizhizao.equipment.fieldCode')}
            required={false}
            autoGenerateOnCreate
            showGenerateButton={false}
            formRef={formRef}
            generateSessionKey={createCodeSessionKey}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="name"
            label={t('app.kuaizhizao.equipment.fieldName')}
            placeholder={t('app.kuaizhizao.equipment.phName')}
            rules={[{ required: true, message: t('app.kuaizhizao.equipment.ruleNameRequired') }]}
          />
        </Col>
        <Col span={12}>
          <DictionarySelect
            dictionaryCode="EQUIPMENT_STATUS"
            name="status"
            label={t('app.kuaizhizao.equipment.fieldStatus')}
            placeholder={t('app.kuaizhizao.equipment.phStatus')}
            required
            rules={[{ required: true, message: t('app.kuaizhizao.equipment.ruleStatusRequired') }]}
            formRef={formRef}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch name="is_active" label={t('app.kuaizhizao.equipment.fieldIsActive')} />
        </Col>
      </Row>
    </FormModalTemplate>
  );
};

export default EquipmentFormModal;
