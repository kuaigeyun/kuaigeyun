import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, App, Button, Result, Space, Table, Tag } from 'antd';
import { ListPageTemplate } from '../../../../components/layout-templates';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { getApiErrorMessage } from '../../../../utils/errorHandler';
import { LabelStationWorkbench } from '../../../kuaizhizao/components/LabelStationWorkbench';
import { labelOemApi, type LabelOemPackItem } from '../../services/label-oem';

/**
 * OEM 标签签样替代页（PACK-LABEL-OEM）。
 * 复用通用工位引擎，并提供抽象签样包种子落地；元数据不含客户公司名。
 */
export default function KuaiElectronicsLabelOemPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const perms = useResourcePermissions('kuaielectronics:label-oem');
  const [packs, setPacks] = useState<LabelOemPackItem[]>([]);
  const [placeholderUuid, setPlaceholderUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [ensuring, setEnsuring] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await labelOemApi.listPacks();
      setPacks(res.items || []);
      setPlaceholderUuid(res.placeholder_template_uuid || '');
    } catch (error) {
      message.error(getApiErrorMessage(error, t('common.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [message, t]);

  useEffect(() => {
    if (perms.enabled && !perms.canRead) return;
    void reload();
  }, [perms.canRead, perms.enabled, reload]);

  const packTab = useMemo(
    () => ({
      key: 'oem-packs',
      label: t('app.kuaielectronics.labelOem.tabPacks'),
      children: (
        <Space orientation="vertical" style={{ width: '100%' }} size="medium">
          <Alert
            type="info"
            showIcon
            title={t('app.kuaielectronics.labelOem.packHintTitle')}
            description={t('app.kuaielectronics.labelOem.packHintBody')}
          />
          {placeholderUuid ? (
            <Alert
              type="warning"
              showIcon
              title={t('app.kuaielectronics.labelOem.placeholderTitle')}
              description={t('app.kuaielectronics.labelOem.placeholderBody', {
                uuid: placeholderUuid,
              })}
            />
          ) : null}
          <Button
            type="primary"
            loading={ensuring}
            disabled={!perms.canUpdate}
            onClick={async () => {
              setEnsuring(true);
              try {
                const res = await labelOemApi.ensurePacks();
                setPacks(res.items || []);
                setPlaceholderUuid(res.placeholder_template_uuid || '');
                message.success(
                  t('app.kuaielectronics.labelOem.ensureSuccess', {
                    created: res.created ?? 0,
                    skipped: res.skipped ?? 0,
                  }),
                );
              } catch (error) {
                message.error(getApiErrorMessage(error, t('common.failed')));
              } finally {
                setEnsuring(false);
              }
            }}
          >
            {t('app.kuaielectronics.labelOem.ensureAll')}
          </Button>
          <Table
            size="small"
            rowKey="pack_code"
            loading={loading}
            pagination={false}
            dataSource={packs}
            columns={[
              {
                title: t('app.kuaielectronics.labelOem.packCode'),
                dataIndex: 'pack_code',
              },
              {
                title: t('app.kuaielectronics.labelOem.packName'),
                dataIndex: 'pack_name',
              },
              {
                title: t('app.kuaielectronics.labelOem.barcodeKind'),
                dataIndex: 'barcode_kind',
                width: 100,
              },
              {
                title: t('app.kuaizhizao.labelStation.qtyPerBox'),
                dataIndex: 'qty_per_box',
                width: 90,
              },
              {
                title: t('app.kuaizhizao.labelStation.printCopies'),
                dataIndex: 'print_copies',
                width: 90,
              },
              {
                title: t('app.kuaielectronics.labelOem.applied'),
                dataIndex: 'applied',
                width: 90,
                render: (v: boolean) => (
                  <Tag variant="filled">
                    {v
                      ? t('app.kuaielectronics.labelOem.appliedYes')
                      : t('app.kuaielectronics.labelOem.appliedNo')}
                  </Tag>
                ),
              },
              {
                title: t('app.kuaielectronics.labelOem.templateBound'),
                dataIndex: 'template_bound',
                width: 110,
                render: (v: boolean) => (
                  <Tag variant="filled" color={v ? 'success' : 'warning'}>
                    {v
                      ? t('app.kuaielectronics.labelOem.templateBoundYes')
                      : t('app.kuaielectronics.labelOem.templateBoundNo')}
                  </Tag>
                ),
              },
            ]}
          />
        </Space>
      ),
    }),
    [ensuring, loading, message, packs, perms.canUpdate, placeholderUuid, t],
  );

  if (perms.enabled && !perms.canRead) {
    return (
      <ListPageTemplate>
        <Result status="403" title={t('common.noPermission')} />
      </ListPageTemplate>
    );
  }

  return (
    <LabelStationWorkbench
      title={t('app.kuaielectronics.menu.labelOem')}
      extraTabItems={[packTab]}
    />
  );
}
