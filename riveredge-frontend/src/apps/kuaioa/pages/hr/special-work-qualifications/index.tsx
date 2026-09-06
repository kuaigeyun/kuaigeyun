import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  createSpecialWorkQualification,
  deleteSpecialWorkQualification,
  getSpecialWorkQualification,
  listSpecialWorkQualifications,
  updateSpecialWorkQualification,
} from '../../../services/training';
import { buildOaApprovalStatusEnum } from '../../../utils/oaFormEnums';

const SpecialWorkQualificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const statusEnum = useMemo(() => buildOaApprovalStatusEnum(t), [t]);

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.specialWorkQualification.createButton"
      resource="kuaioa:special-work-qualification"
      codeField="request_code"
      nameField="title"
      autoGenerateCode
      statusEnum={statusEnum}
      statusPresentation="lifecycle"
      detailVariant="approval"
      getDetailFn={getSpecialWorkQualification}
      columnPersistenceId="apps.kuaioa.special-work-qualification.list-v1"
      auditWorkflow={{
        entityType: 'kuaioa_special_work_qualification',
        resourcePrefix: 'kuaioa:special-work-qualification',
        auditNodeKey: 'kuaioa_special_work_qualification',
        entityNameKey: 'app.kuaioa.specialWorkQualification.entityName',
      }}
      fields={[
        { name: 'request_code', labelKey: 'app.kuaioa.specialWorkQualification.code', width: 150 },
        { name: 'title', labelKey: 'app.kuaioa.specialWorkQualification.title', required: true, width: 200 },
        {
          name: 'qualification_year',
          labelKey: 'app.kuaioa.specialWorkQualification.year',
          required: true,
          width: 100,
          type: 'number',
        },
        { name: 'holder_name', labelKey: 'app.kuaioa.specialWorkQualification.holder', width: 120 },
        { name: 'job_type', labelKey: 'app.kuaioa.specialWorkQualification.jobType', width: 140 },
        { name: 'department_name', labelKey: 'app.kuaioa.common.department', width: 120, hideInTable: true },
        {
          name: 'confirmation_content',
          labelKey: 'app.kuaioa.specialWorkQualification.content',
          hideInTable: true,
          type: 'textarea',
        },
        { name: 'status', labelKey: 'common.status', width: 100 },
        { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' },
      ]}
      listFn={listSpecialWorkQualifications}
      createFn={createSpecialWorkQualification}
      updateFn={updateSpecialWorkQualification}
      deleteFn={deleteSpecialWorkQualification}
    />
  );
};

export default SpecialWorkQualificationsPage;
