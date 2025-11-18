/**
 * 仪表盘页面
 * 
 * 系统首页，展示系统概览信息
 */

import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, DatabaseOutlined, AppstoreOutlined } from '@ant-design/icons';

/**
 * 仪表盘页面组件
 */
export default function DashboardPage() {
  return (
    <PageContainer
      title="仪表盘"
      breadcrumb={{}}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总租户数"
              value={0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="数据总量"
              value={0}
              prefix={<DatabaseOutlined />}
              suffix="条"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已安装插件"
              value={0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

