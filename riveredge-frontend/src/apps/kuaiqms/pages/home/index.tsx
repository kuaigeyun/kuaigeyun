import React from 'react';
import { Result } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ListPageTemplate } from '../../../../components/layout-templates';

export default function KuaiqmsHomePage() {
  const { t } = useTranslation();
  return (
    <ListPageTemplate>
      <Result
        icon={<ExperimentOutlined />}
        title={t('app.kuaiqms.name')}
        subTitle={t('app.kuaiqms.homeHint')}
      />
    </ListPageTemplate>
  );
}
