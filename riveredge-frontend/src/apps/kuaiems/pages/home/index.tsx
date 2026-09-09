import React from 'react';
import { Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ListPageTemplate } from '../../../../components/layout-templates';

export default function KuaiemsHomePage() {
  const { t } = useTranslation();
  return (
    <ListPageTemplate>
      <Result
        icon={<ToolOutlined />}
        title={t('app.kuaiems.name')}
        subTitle={t('app.kuaiems.homeHint')}
      />
    </ListPageTemplate>
  );
}
