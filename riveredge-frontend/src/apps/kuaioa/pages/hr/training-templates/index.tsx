import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  createTrainingTemplate,
  deleteTrainingTemplate,
  getTrainingTemplate,
  listTrainingTemplates,
  updateTrainingTemplate,
} from '../../../services/training';

const TrainingTemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const kindOptions = useMemo(
    () => [
      { label: t('app.kuaioa.trainingTemplate.kind.examPaper'), value: 'exam_paper' },
      { label: t('app.kuaioa.trainingTemplate.kind.trainingRecord'), value: 'training_record' },
    ],
    [t],
  );

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.trainingTemplate.createButton"
      resource="kuaioa:training-template"
      codeField="template_code"
      nameField="template_name"
      autoGenerateCode
      statusPresentation="marker"
      detailVariant="master"
      getDetailFn={getTrainingTemplate}
      columnPersistenceId="apps.kuaioa.training-template.list-v1"
      fields={[
        { name: 'template_code', labelKey: 'app.kuaioa.trainingTemplate.code', width: 140 },
        { name: 'template_name', labelKey: 'app.kuaioa.trainingTemplate.name', required: true, width: 200 },
        {
          name: 'template_kind',
          labelKey: 'app.kuaioa.trainingTemplate.kind',
          required: true,
          width: 140,
          type: 'select',
          options: kindOptions,
        },
        {
          name: 'content_body',
          labelKey: 'app.kuaioa.trainingTemplate.content',
          hideInTable: true,
          type: 'textarea',
        },
        { name: 'is_active', labelKey: 'common.enabled', width: 90, type: 'switch' },
        { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' },
      ]}
      listFn={listTrainingTemplates}
      createFn={createTrainingTemplate}
      updateFn={updateTrainingTemplate}
      deleteFn={deleteTrainingTemplate}
    />
  );
};

export default TrainingTemplatesPage;
