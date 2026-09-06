import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Result, Typography } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ListPageTemplate } from '../../../../components/layout-templates';
import { UniTable } from '../../../../components/uni-table';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { spotChecksApi } from '../../../kuaizhizao/services/equipmentOps';
import { StatusTag } from '../../../../constants/statusBadges';
import { kuaielectronicsEsdApi } from '../../services/esd';
import { useRequest } from 'ahooks';

const { Text } = Typography;

type SpotRow = {
  id?: number;
  uuid?: string;
  document_no?: string;
  equipment_code?: string;
  equipment_name?: string;
  check_date?: string;
  status?: string;
  has_abnormality?: boolean;
  inspector_name?: string;
};

/** ESD 点检列表：单据走通用点检 API，仅筛 domain=esd。 */
export default function KuaiElectronicsEsdInspectionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const perms = useResourcePermissions('kuaielectronics:esd');
  const spotPerms = useResourcePermissions('kuaizhizao:equipment-spot-check');

  const { data: catalog } = useRequest(() => kuaielectronicsEsdApi.getCatalog(), {
    ready: !perms.enabled || perms.canRead,
  });

  if (perms.enabled && !perms.canRead) {
    return (
      <ListPageTemplate>
        <Result status="403" title={t('common.noPermission')} />
      </ListPageTemplate>
    );
  }

  const columns: ProColumns<SpotRow>[] = [
    {
      title: t('app.kuaielectronics.esd.colDocumentNo'),
      dataIndex: 'document_no',
      copyable: true,
      render: (_, row) => (
        <a
          onClick={() =>
            navigate(`/apps/kuaizhizao/equipment-management/spot-checks?uuid=${row.uuid || ''}`)
          }
        >
          {row.document_no}
        </a>
      ),
    },
    {
      title: t('app.kuaielectronics.esd.colEquipment'),
      dataIndex: 'equipment_name',
      ellipsis: true,
      render: (_, row) => (
        <Text>
          {row.equipment_code ? `${row.equipment_code} ` : ''}
          {row.equipment_name || ''}
        </Text>
      ),
    },
    {
      title: t('app.kuaielectronics.esd.colCheckDate'),
      dataIndex: 'check_date',
      width: 120,
      search: false,
    },
    {
      title: t('app.kuaielectronics.esd.colInspector'),
      dataIndex: 'inspector_name',
      width: 100,
      search: false,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 100,
      render: (_, row) => (
        <StatusTag color={row.has_abnormality ? 'error' : 'processing'}>{row.status}</StatusTag>
      ),
    },
  ];

  return (
    <ListPageTemplate>
      <UniTable<SpotRow>
        actionRef={actionRef}
        headerTitle={t('app.kuaielectronics.menu.esdInspection')}
        columnPersistenceId="kuaielectronics-esd-inspection-v1"
        rowKey={(r) => String(r.id ?? r.uuid)}
        showCreateButton={spotPerms.canCreate}
        createButtonText={t('app.kuaielectronics.esd.createSpotCheck')}
        onCreate={() => {
          const schemeId = catalog?.scheme?.id;
          const q = new URLSearchParams({ domain: 'esd' });
          if (schemeId) q.set('scheme_id', String(schemeId));
          q.set('create', '1');
          navigate(`/apps/kuaizhizao/equipment-management/spot-checks?${q.toString()}`);
        }}
        toolBarRender={() => [
          <Button key="hub" onClick={() => navigate('/apps/kuaielectronics/esd')}>
            {t('app.kuaielectronics.esd.backHub')}
          </Button>,
          <Button key="board" onClick={() => navigate('/apps/kuaielectronics/esd/dashboard')}>
            {t('app.kuaielectronics.menu.esdDashboard')}
          </Button>,
          catalog?.scheme ? (
            <Text key="scheme" type="secondary">
              {t('app.kuaielectronics.esd.schemeHint', {
                code: catalog.scheme.code,
                name: catalog.scheme.name,
              })}
            </Text>
          ) : null,
        ]}
        columns={columns}
        request={async (params) => {
          const res = await spotChecksApi.list({
            skip: ((params.current || 1) - 1) * (params.pageSize || 20),
            limit: params.pageSize || 20,
            keyword: params.keyword,
            scheme_domain: 'esd',
            status: params.status,
          });
          const payload = res as { items?: SpotRow[]; total?: number };
          return {
            data: payload.items || [],
            success: true,
            total: payload.total || 0,
          };
        }}
      />
    </ListPageTemplate>
  );
}
