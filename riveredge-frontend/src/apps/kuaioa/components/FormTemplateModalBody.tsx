import React from 'react';
import { Col, Form, Input, Row, Select, Switch } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { GENERAL_SIGNOFF_BUSINESS_TYPES } from '../constants/generalSignoffBusinessTypes';

type Props = {
  form: FormInstance;
  editing: Record<string, unknown> | null;
};

const FormTemplateModalBody: React.FC<Props> = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Row gutter={16}>
      {!editing ? (
        <Col span={12}>
          <Form.Item
            name="template_code"
            label={t('app.kuaioa.formTemplate.code')}
            rules={[{ required: true, message: t('app.kuaioa.common.required') }]}
          >
            <Input />
          </Form.Item>
        </Col>
      ) : null}
      <Col span={12}>
        <Form.Item
          name="template_name"
          label={t('app.kuaioa.formTemplate.name')}
          rules={[{ required: true, message: t('app.kuaioa.common.required') }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="category" label={t('app.kuaioa.formTemplate.category')}>
          <Select
            options={[
              { label: t('app.kuaioa.formTemplate.category.general'), value: 'general' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="business_type"
          label={t('app.kuaioa.formTemplate.businessType')}
          tooltip={t('app.kuaioa.formTemplate.businessTypeHint')}
        >
          <Select
            allowClear
            placeholder={t('app.kuaioa.formTemplate.businessTypePlaceholder')}
            options={GENERAL_SIGNOFF_BUSINESS_TYPES.map((item) => ({
              value: item.code,
              label: t(item.labelKey),
            }))}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="is_active" label={t('common.enabled')} valuePropName="checked">
          <Switch />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="show_in_menu"
          label={t('app.kuaioa.formTemplate.showInMenu')}
          valuePropName="checked"
          tooltip={t('app.kuaioa.formTemplate.showInMenuHint')}
        >
          <Switch />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="description" label={t('common.remark')}>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FormTemplateModalBody;
