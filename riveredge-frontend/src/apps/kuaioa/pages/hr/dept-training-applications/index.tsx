import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  createDeptTrainingApplication,
  deleteDeptTrainingApplication,
  getDeptTrainingApplication,
  listDeptTrainingApplications,
  updateDeptTrainingApplication,
} from '../../../services/training';
import { buildOaApprovalStatusEnum } from '../../../utils/oaFormEnums';

const DeptTrainingApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const statusEnum = useMemo(() => buildOaApprovalStatusEnum(t), [t]);

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.deptTrainingApplication.createButton"
      resource="kuaioa:dept-training-application"
      codeField="request_code"
      nameField="title"
      autoGenerateCode
      statusEnum={statusEnum}
      statusPresentation="lifecycle"
      detailVariant="approval"
      getDetailFn={getDeptTrainingApplication}
      columnPersistenceId="apps.kuaioa.dept-training-application.list-v1"
      auditWorkflow={{
        entityType: 'kuaioa_dept_training_application',
        resourcePrefix: 'kuaioa:dept-training-application',
        auditNodeKey: 'kuaioa_dept_training_application',
        entityNameKey: 'app.kuaioa.deptTrainingApplication.entityName',
      }}
      fields={[
        { name: 'request_code', labelKey: 'app.kuaioa.deptTrainingApplication.code', width: 150 },
        { name: 'title', labelKey: 'app.kuaioa.deptTrainingApplication.title', required: true, width: 200 },
        { name: 'plan_year', labelKey: 'app.kuaioa.trainingPlan.year', required: true, width: 100, type: 'number' },
        { name: 'department_name', labelKey: 'app.kuaioa.common.department', width: 120 },
        {
          name: 'training_content',
          labelKey: 'app.kuaioa.deptTrainingApplication.content',
          hideInTable: true,
          type: 'textarea',
        },
        { name: 'status', labelKey: 'common.status', width: 100 },
        { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' },
      ]}
      listFn={listDeptTrainingApplications}
      createFn={createDeptTrainingApplication}
      updateFn={updateDeptTrainingApplication}
      deleteFn={deleteDeptTrainingApplication}
    />
  );
};

export default DeptTrainingApplicationsPage;
