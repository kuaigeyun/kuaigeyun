import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Typography } from 'antd';
import { ListPageTemplate } from '../../../../components/layout-templates';

const { Paragraph } = Typography;

/** 电子制造行业包首页：说明已启用的替代/独立扩展。 */
export default function KuaiElectronicsHomePage() {
  const { t } = useTranslation();
  return (
    <ListPageTemplate>
      <Card title={t('app.kuaielectronics.name')}>
        <Paragraph>{t('app.kuaielectronics.home.intro')}</Paragraph>
        <Alert
          type="info"
          showIcon
          title={t('app.kuaielectronics.home.replaceTitle')}
          description={t('app.kuaielectronics.home.replaceHint')}
          style={{ marginBottom: 16 }}
        />
        <Alert
          type="success"
          showIcon
          title={t('app.kuaielectronics.home.standaloneTitle')}
          description={t('app.kuaielectronics.home.standaloneHint')}
        />
      </Card>
    </ListPageTemplate>
  );
}
