import React from 'react';
import { Result } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ListPageTemplate } from '../../../../components/layout-templates';

export default function KuaipdHomePage() {
  const { t } = useTranslation();
  return (
    <ListPageTemplate>
      <Result
        icon={<CarOutlined />}
        title={t('app.kuaipd.name')}
        subTitle={t('app.kuaipd.homeHint')}
      />
    </ListPageTemplate>
  );
}
