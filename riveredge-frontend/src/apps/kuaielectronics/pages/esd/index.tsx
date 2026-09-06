import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Result, Row, Space, Table, Typography, message } from 'antd';
import { ListPageTemplate } from '../../../../components/layout-templates';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { useRequest } from 'ahooks';
import { kuaielectronicsEsdApi } from '../../services/esd';

const { Paragraph, Title, Text } = Typography;

/** ESD 独立功能入口：项目清单预览 + 点检/看板。 */
export default function KuaiElectronicsEsdHubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const perms = useResourcePermissions('kuaielectronics:esd');

  const { data, loading, refresh } = useRequest(
    () => kuaielectronicsEsdApi.getCatalog(),
    { ready: !perms.enabled || perms.canRead },
  );

  if (perms.enabled && !perms.canRead) {
    return (
      <ListPageTemplate>
        <Result status="403" title={t('common.noPermission')} />
      </ListPageTemplate>
    );
  }

  const projects = data?.project_types || [];
  const scheme = data?.scheme;

  return (
    <ListPageTemplate>
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('app.kuaielectronics.menu.esd')}
          </Title>
          <Space wrap>
            {perms.canUpdate ? (
              <Button
                onClick={async () => {
                  await kuaielectronicsEsdApi.ensureCatalog();
                  message.success(t('app.kuaielectronics.esd.ensureOk'));
                  refresh();
                }}
              >
                {t('app.kuaielectronics.esd.ensureCatalog')}
              </Button>
            ) : null}
            <Button type="primary" onClick={() => navigate('/apps/kuaielectronics/esd/inspection')}>
              {t('app.kuaielectronics.menu.esdInspection')}
            </Button>
            <Button onClick={() => navigate('/apps/kuaielectronics/esd/dashboard')}>
              {t('app.kuaielectronics.menu.esdDashboard')}
            </Button>
          </Space>
        </div>

        <Alert
          type="info"
          showIcon
          title={t('app.kuaielectronics.esd.introTitle')}
          description={t('app.kuaielectronics.esd.introDesc')}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card title={t('app.kuaielectronics.esd.schemeCard')} loading={loading}>
              {scheme ? (
                <Space orientation="vertical" size={4}>
                  <Text>
                    {t('app.kuaielectronics.esd.schemeCode')}: {scheme.code}
                  </Text>
                  <Text>
                    {t('app.kuaielectronics.esd.schemeName')}: {scheme.name}
                  </Text>
                  <Text type="secondary">
                    {t('app.kuaielectronics.esd.captureMode')}: {scheme.capture_mode} /{' '}
                    {scheme.cycle_type}
                  </Text>
                  <Text type="secondary">
                    {t('app.kuaielectronics.esd.activeCount', { count: data?.active_count ?? 0 })}
                  </Text>
                </Space>
              ) : (
                <Paragraph type="secondary">{t('app.kuaielectronics.esd.schemeMissing')}</Paragraph>
              )}
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card title={t('app.kuaielectronics.esd.projectListTitle')} loading={loading}>
              <Table
                size="small"
                tableLayout="fixed"
                pagination={false}
                rowKey={(r) => r.code}
                dataSource={projects}
                columns={[
                  { title: t('app.kuaielectronics.esd.colCode'), dataIndex: 'code', width: 100 },
                  { title: t('app.kuaielectronics.esd.colLabel'), dataIndex: 'label', ellipsis: true },
                  {
                    title: t('common.status'),
                    dataIndex: 'active',
                    width: 80,
                    render: (v: boolean) =>
                      v === false
                        ? t('app.kuaielectronics.esd.inactive')
                        : t('app.kuaielectronics.esd.active'),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </ListPageTemplate>
  );
}
