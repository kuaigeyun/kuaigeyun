/**
 * 工程变更（ECN）新建/编辑弹窗 — 供变更工作台共用
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Col, Form as AntForm, Input, InputNumber, Row, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FormModalTemplate } from '../../../components/layout-templates';
import { UniTableDetail } from '../../../components/uni-table-detail';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import Phase2ProjectSelect from './Phase2ProjectSelect';
import {
  engineeringChangeApi,
  type EcnChangeKind,
  type EcnMaterialLine,
  type EngineeringChange,
} from '../services/engineering-change';

const KIND_KEYS: EcnChangeKind[] = ['material', 'process', 'drawing', 'other'];
const DISPOSITION_KEYS = ['scrap', 'use_up', 'rework', 'return', 'other'];

export interface EcnChangeFormModalProps {
  open: boolean;
  editing?: EngineeringChange | null;
  projectId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EcnChangeFormModal: React.FC<EcnChangeFormModalProps> = ({
  open,
  editing,
  projectId,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const formRef = useRef<ProFormInstance | undefined>(undefined);

  const kindLabel = (s: string) => t(`app.kuaiplm.ecn.changeKind.${s}`, { defaultValue: s });

  useEffect(() => {
    if (!open) return;
    formRef.current?.resetFields();
  }, [open, editing?.uuid]);

  const lineColumns = useMemo<ColumnsType>(
    () => [
      {
        title: t('app.kuaiplm.ecn.fields.materialCode'),
        dataIndex: 'material_code',
        width: 130,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item
            name={[index, 'material_code']}
            rules={[{ required: true, message: t('common.required') }]}
            style={{ marginBottom: 0 }}
          >
            <Input size="small" />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.materialName'),
        dataIndex: 'material_name',
        width: 140,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item
            name={[index, 'material_name']}
            rules={[{ required: true, message: t('common.required') }]}
            style={{ marginBottom: 0 }}
          >
            <Input size="small" />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.beforeDesc'),
        dataIndex: 'before_desc',
        width: 120,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item name={[index, 'before_desc']} style={{ marginBottom: 0 }}>
            <Input size="small" />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.afterDesc'),
        dataIndex: 'after_desc',
        width: 120,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item name={[index, 'after_desc']} style={{ marginBottom: 0 }}>
            <Input size="small" />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.disposition'),
        dataIndex: 'disposition',
        width: 110,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item name={[index, 'disposition']} style={{ marginBottom: 0 }}>
            <Select
              allowClear
              size="small"
              style={{ width: '100%' }}
              options={DISPOSITION_KEYS.map((k) => ({
                value: k,
                label: t(`app.kuaiplm.ecn.disposition.${k}`),
              }))}
            />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.ownerUserId'),
        dataIndex: 'owner_user_id',
        width: 100,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item name={[index, 'owner_user_id']} style={{ marginBottom: 0 }}>
            <InputNumber size="small" style={{ width: '100%' }} />
          </AntForm.Item>
        ),
      },
      {
        title: t('app.kuaiplm.ecn.fields.ownerUserName'),
        dataIndex: 'owner_user_name',
        width: 110,
        render: (_: unknown, __: unknown, index: number) => (
          <AntForm.Item name={[index, 'owner_user_name']} style={{ marginBottom: 0 }}>
            <Input size="small" />
          </AntForm.Item>
        ),
      },
    ],
    [t],
  );

  return (
    <FormModalTemplate
      key={editing?.uuid ?? 'create-ecn'}
      title={editing ? t('common.edit') : t('app.kuaiplm.change.createEcnButton')}
      open={open}
      onClose={onClose}
      formRef={formRef}
      grid={false}
      width={980}
      initialValues={
        editing
          ? {
              project_id: editing.project_id,
              change_kind: editing.change_kind,
              title: editing.title,
              change_reason: editing.change_reason,
              remarks: editing.remarks,
              materials: editing.materials?.length
                ? editing.materials
                : [{ material_code: '', material_name: '' }],
            }
          : {
              project_id: projectId,
              change_kind: 'material',
              materials: [{ material_code: '', material_name: '' }],
            }
      }
      onFinish={async (values) => {
        try {
          const cleanMaterials = ((values.materials || []) as EcnMaterialLine[])
            .filter((m) => m?.material_code && m?.material_name)
            .map((m) => ({
              material_id: m.material_id ?? null,
              material_code: String(m.material_code).trim(),
              material_name: String(m.material_name).trim(),
              before_desc: m.before_desc || null,
              after_desc: m.after_desc || null,
              stock_qty: m.stock_qty ?? null,
              unit_price: m.unit_price ?? null,
              cost_amount: m.cost_amount ?? null,
              disposition: m.disposition || null,
              owner_user_id: m.owner_user_id ?? null,
              owner_user_name: m.owner_user_name || null,
              remarks: m.remarks || null,
            }));
          if (!cleanMaterials.length) {
            messageApi.error(t('app.kuaiplm.ecn.messages.materialRequired'));
            throw new Error('material required');
          }
          const payload = {
            project_id: values.project_id ? Number(values.project_id) : null,
            change_kind: values.change_kind,
            title: String(values.title || '').trim(),
            change_reason: values.change_reason || null,
            remarks: values.remarks || null,
            materials: cleanMaterials,
          };
          if (editing?.id) {
            await engineeringChangeApi.update(editing.id, payload);
          } else {
            await engineeringChangeApi.create(payload);
          }
          messageApi.success(t('common.saveSuccess'));
          onSuccess();
          onClose();
        } catch (e) {
          messageApi.error(getApiErrorMessage(e));
          throw e;
        }
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Phase2ProjectSelect
            name="project_id"
            label={t('app.kuaiplm.ecn.fields.project')}
            disabled={!!editing}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            name="change_kind"
            label={t('app.kuaiplm.ecn.fields.changeKind')}
            rules={[{ required: true }]}
            disabled={!!editing}
            options={KIND_KEYS.map((k) => ({ value: k, label: kindLabel(k) }))}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            name="title"
            label={t('app.kuaiplm.ecn.fields.title')}
            rules={[{ required: true }]}
          />
        </Col>
        <Col span={24}>
          <ProFormTextArea name="change_reason" label={t('app.kuaiplm.ecn.fields.changeReason')} />
        </Col>
        <Col span={24}>
          <ProFormTextArea name="remarks" label={t('common.remark')} />
        </Col>
      </Row>
      <UniTableDetail
        name="materials"
        title={t('app.kuaiplm.ecn.fields.materials')}
        required
        requiredMessage={t('app.kuaiplm.ecn.messages.materialRequired')}
        columns={lineColumns}
        initialValue={{ material_code: '', material_name: '' }}
        minRows={1}
      />
    </FormModalTemplate>
  );
};

export default EcnChangeFormModal;
