import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  confirmTrainingRecordHr,
  createTrainingRecord,
  deleteTrainingRecord,
  getTrainingRecord,
  listTrainingPlans,
  listTrainingRecords,
  updateTrainingRecord,
} from '../../../services/training';

const TrainingRecordsPage: React.FC = () => {
  const { t } = useTranslation();
  const [planOptions, setPlanOptions] = useState<Array<{ label: string; value: number }>>([]);

  useEffect(() => {
    void (async () => {
      const res = await listTrainingPlans();
      setPlanOptions(
        res.items.map((plan) => ({
          label: `${plan.plan_code} ${plan.plan_name}`,
          value: plan.id,
        })),
      );
    })();
  }, []);

  const kindOptions = useMemo(
    () => [
      { label: t('app.kuaioa.trainingRecord.kind.content'), value: 'content' },
      { label: t('app.kuaioa.trainingRecord.kind.production'), value: 'production' },
      { label: t('app.kuaioa.trainingRecord.kind.qc'), value: 'qc' },
    ],
    [t],
  );

  const fields = useMemo(
    () => [
      { name: 'record_code', labelKey: 'app.kuaioa.trainingRecord.code', width: 140 },
      { name: 'training_name', labelKey: 'app.kuaioa.trainingRecord.name', required: true, width: 200 },
      {
        name: 'record_kind',
        labelKey: 'app.kuaioa.trainingRecord.kind',
        width: 110,
        type: 'select' as const,
        options: kindOptions,
      },
      {
        name: 'plan_id',
        labelKey: 'app.kuaioa.trainingRecord.plan',
        hideInTable: true,
        type: 'select' as const,
        options: planOptions,
      },
      { name: 'trainee_name', labelKey: 'app.kuaioa.trainingRecord.trainee', width: 120 },
      { name: 'trainer_name', labelKey: 'app.kuaioa.trainingRecord.trainer', hideInTable: true },
      { name: 'training_date', labelKey: 'app.kuaioa.trainingRecord.date', width: 120, type: 'date' as const },
      { name: 'due_date', labelKey: 'app.kuaioa.trainingPlan.dueDate', width: 120, type: 'date' as const },
      {
        name: 'theory_score',
        labelKey: 'app.kuaioa.trainingRecord.theoryScore',
        hideInTable: true,
        type: 'number' as const,
      },
      {
        name: 'practice_score',
        labelKey: 'app.kuaioa.trainingRecord.practiceScore',
        hideInTable: true,
        type: 'number' as const,
      },
      { name: 'is_passed', labelKey: 'app.kuaioa.trainingRecord.passed', type: 'switch' as const, width: 80 },
      {
        name: 'content_summary',
        labelKey: 'app.kuaioa.trainingRecord.contentSummary',
        hideInTable: true,
        type: 'textarea' as const,
      },
      {
        name: 'attachment_file_uuid',
        labelKey: 'app.kuaioa.trainingRecord.attachment',
        hideInTable: true,
        type: 'file' as const,
      },
      { name: 'status', labelKey: 'common.status', width: 100 },
      { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' as const },
    ],
    [kindOptions, planOptions],
  );

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.trainingRecord.createButton"
      resource="kuaioa:training-record"
      codeField="record_code"
      nameField="training_name"
      autoGenerateCode
      statusPresentation="marker"
      detailVariant="master"
      getDetailFn={getTrainingRecord}
      columnPersistenceId="apps.kuaioa.training-record.list-v6"
      fields={fields}
      listFn={listTrainingRecords}
      createFn={createTrainingRecord}
      updateFn={updateTrainingRecord}
      deleteFn={deleteTrainingRecord}
      extraActions={[
        {
          key: 'confirm-hr',
          labelKey: 'app.kuaioa.trainingRecord.confirmHr',
          requireUpdate: true,
          visible: (record) => !record.hr_confirmed_at,
          onClick: async (record) => {
            await confirmTrainingRecordHr(Number(record.id));
          },
        },
      ]}
    />
  );
};

export default TrainingRecordsPage;
