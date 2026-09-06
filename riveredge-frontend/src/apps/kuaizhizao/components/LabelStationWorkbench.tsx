/**
 * 快制造标签工位作业/配置台（R-16 通用引擎）。
 * OEM document 替代页可复用本组件并注入额外 Tab。
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { InputRef } from 'antd/es/input';
import type { TabsProps } from 'antd';
import {
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  FormModalTemplate,
  MODAL_CONFIG,
  MultiTabListPageTemplate,
} from '../../../components/layout-templates';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import {
  labelStationApi,
  type LabelModelConfig,
  type LabelStation,
  type LabelStationSnapshot,
} from '../services/label-station';

const { Text, Paragraph } = Typography;

export type LabelStationWorkbenchProps = {
  /** 追加到作业/配置之后的 Tab（如 OEM 签样包） */
  extraTabItems?: TabsProps['items'];
};

export function LabelStationWorkbench({ extraTabItems }: LabelStationWorkbenchProps) {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const stationPerms = useResourcePermissions('kuaizhizao:label-station');
  const bindPerms = useResourcePermissions('kuaizhizao:packing-bind');
  const canOpenSession = Boolean(stationPerms.canAction?.('execute'));
  const canScan = Boolean(bindPerms.canAction?.('execute'));

  const [activeTabKey, setActiveTabKey] = useState('work');
  const [stations, setStations] = useState<LabelStation[]>([]);
  const [models, setModels] = useState<LabelModelConfig[]>([]);
  const [stationId, setStationId] = useState<number>();
  const [modelId, setModelId] = useState<number>();
  const [mode, setMode] = useState('work');
  const [snapshot, setSnapshot] = useState<LabelStationSnapshot | null>(null);
  const [barcode, setBarcode] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanInputRef = useRef<InputRef>(null);

  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LabelModelConfig | null>(null);
  const [editingStation, setEditingStation] = useState<LabelStation | null>(null);
  const [modelForm] = Form.useForm();
  const [stationForm] = Form.useForm();

  const sessionId = snapshot?.session?.id ? Number(snapshot.session.id) : undefined;
  const locked = snapshot?.session?.status === 'locked';
  const box = snapshot?.current_box;
  const qtyCurrent = Number(box?.qty_current || 0);
  const qtyTarget = Number(box?.qty_target || 0);

  const reloadConfigs = async () => {
    try {
      const [st, md] = await Promise.all([
        labelStationApi.listStations({ active_only: true }),
        labelStationApi.listModels({ active_only: true }),
      ]);
      setStations(st.items);
      setModels(md.items);
      if (!stationId && st.items[0]) setStationId(st.items[0].id);
      if (!modelId && md.items[0]) setModelId(md.items[0].id);
    } catch (error) {
      message.error(getApiErrorMessage(error, t('common.loadFailed')));
    }
  };

  useEffect(() => {
    void reloadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅首次加载配置
  }, []);

  useEffect(() => {
    if (!locked && !manualMode) {
      scanInputRef.current?.focus?.();
    }
  }, [locked, manualMode, snapshot]);

  const openSession = async () => {
    if (!stationId) {
      message.error(t('app.kuaizhizao.labelStation.selectStation'));
      return;
    }
    try {
      const snap = await labelStationApi.openSession({
        station_id: stationId,
        mode,
        model_config_id: modelId,
      });
      setSnapshot(snap);
      message.success(t('common.operationSuccess'));
    } catch (error) {
      message.error(getApiErrorMessage(error, t('common.failed')));
    }
  };

  const refreshSession = async () => {
    if (!sessionId) return;
    try {
      setSnapshot(await labelStationApi.getSession(sessionId));
    } catch (error) {
      message.error(getApiErrorMessage(error, t('common.loadFailed')));
    }
  };

  const doScan = async () => {
    if (!sessionId || !barcode.trim()) return;
    setScanning(true);
    try {
      const snap = await labelStationApi.scan({
        session_id: sessionId,
        barcode: barcode.trim(),
        manual: manualMode,
      });
      setSnapshot(snap);
      setBarcode('');
      if (snap.print_job) {
        message.success(t('app.kuaizhizao.labelStation.boxFullPrinted'));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, t('common.failed')));
      await refreshSession();
    } finally {
      setScanning(false);
    }
  };

  const unlock = () => {
    if (!sessionId) return;
    let password = '';
    modal.confirm({
      title: t('app.kuaizhizao.labelStation.unlock'),
      content: (
        <Input.Password
          placeholder={t('app.kuaizhizao.labelStation.unlockPassword')}
          onChange={(e) => {
            password = e.target.value;
          }}
        />
      ),
      onOk: async () => {
        try {
          const snap = await labelStationApi.unlock({
            session_id: sessionId,
            confirm_password: password || undefined,
          });
          setSnapshot(snap);
          message.success(t('common.operationSuccess'));
        } catch (error) {
          message.error(getApiErrorMessage(error, t('common.failed')));
          return Promise.reject();
        }
      },
    });
  };

  const modeOptions = useMemo(
    () => [
      { value: 'work', label: t('app.kuaizhizao.labelStation.mode.work') },
      { value: 'reprint', label: t('app.kuaizhizao.labelStation.mode.reprint') },
      { value: 'admin', label: t('app.kuaizhizao.labelStation.mode.admin') },
    ],
    [t],
  );

  const modelSelectOptions = models.map((m) => ({
    value: m.id,
    label: `${m.model_code} ${m.model_name}`,
  }));

  const tabItems: TabsProps['items'] = [
    {
      key: 'work',
      label: t('app.kuaizhizao.labelStation.tabWork'),
      children: (
        <Space orientation="vertical" style={{ width: '100%' }} size="medium">
          {!sessionId ? (
            <Row gutter={16}>
              <Col span={8}>
                <Text>{t('app.kuaizhizao.labelStation.station')}</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  value={stationId}
                  options={stations.map((s) => ({
                    value: s.id,
                    label: `${s.station_code} ${s.station_name}`,
                  }))}
                  onChange={setStationId}
                />
              </Col>
              <Col span={8}>
                <Text>{t('app.kuaizhizao.labelStation.model')}</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  value={modelId}
                  options={modelSelectOptions}
                  onChange={setModelId}
                />
              </Col>
              <Col span={8}>
                <Text>{t('app.kuaizhizao.labelStation.modeLabel')}</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  value={mode}
                  options={modeOptions}
                  onChange={setMode}
                />
              </Col>
              <Col span={24} style={{ marginTop: 16 }}>
                <Button type="primary" disabled={!canOpenSession} onClick={() => void openSession()}>
                  {t('app.kuaizhizao.labelStation.openSession')}
                </Button>
              </Col>
            </Row>
          ) : (
            <>
              {locked ? (
                <Alert
                  type="error"
                  showIcon
                  title={t('app.kuaizhizao.labelStation.locked')}
                  description={String(snapshot?.session?.locked_reason || '')}
                  action={
                    stationPerms.canUpdate ? (
                      <Button danger onClick={unlock}>
                        {t('app.kuaizhizao.labelStation.unlock')}
                      </Button>
                    ) : null
                  }
                />
              ) : null}
              <Row gutter={16}>
                <Col span={12}>
                  <Paragraph>
                    {t('app.kuaizhizao.labelStation.station')}：
                    {String(snapshot?.station?.station_name || '')}（
                    {String(snapshot?.station?.station_code || '')}）
                  </Paragraph>
                  <Paragraph>
                    {t('app.kuaizhizao.labelStation.model')}：
                    {String(snapshot?.model?.model_name || snapshot?.session?.model_code || '—')}
                  </Paragraph>
                  <Paragraph>
                    {t('app.kuaizhizao.labelStation.boxNo')}：
                    {String(box?.box_no || t('app.kuaizhizao.labelStation.waitingBox'))}
                  </Paragraph>
                  {qtyTarget > 0 ? (
                    <Progress
                      percent={Math.min(100, Math.round((qtyCurrent / qtyTarget) * 100))}
                      format={() => `${qtyCurrent}/${qtyTarget}`}
                    />
                  ) : null}
                </Col>
                <Col span={12}>
                  <Space style={{ marginBottom: 8 }}>
                    <Text>{t('app.kuaizhizao.labelStation.manualInput')}</Text>
                    <Switch checked={manualMode} onChange={setManualMode} />
                  </Space>
                  <Input
                    ref={scanInputRef}
                    value={barcode}
                    disabled={locked || !canScan || mode !== 'work'}
                    placeholder={t('app.kuaizhizao.labelStation.scanPlaceholder')}
                    onChange={(e) => setBarcode(e.target.value)}
                    onPressEnter={() => void doScan()}
                    allowClear
                  />
                  <Space style={{ marginTop: 12 }} wrap>
                    <Button
                      type="primary"
                      loading={scanning}
                      disabled={locked || !canScan || mode !== 'work'}
                      onClick={() => void doScan()}
                    >
                      {t('app.kuaizhizao.labelStation.confirmScan')}
                    </Button>
                    {box?.id && stationPerms.canPrint ? (
                      <Button
                        onClick={async () => {
                          try {
                            await labelStationApi.reprint({ box_id: Number(box.id) });
                            message.success(t('common.operationSuccess'));
                          } catch (error) {
                            message.error(getApiErrorMessage(error, t('common.failed')));
                          }
                        }}
                      >
                        {t('app.kuaizhizao.labelStation.reprint')}
                      </Button>
                    ) : null}
                    <Button
                      onClick={async () => {
                        if (!sessionId) return;
                        try {
                          await labelStationApi.closeSession(sessionId);
                          setSnapshot(null);
                          message.success(t('common.operationSuccess'));
                        } catch (error) {
                          message.error(getApiErrorMessage(error, t('common.failed')));
                        }
                      }}
                    >
                      {t('app.kuaizhizao.labelStation.closeSession')}
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Table
                size="small"
                rowKey="id"
                pagination={false}
                dataSource={snapshot?.items || []}
                columns={[
                  { title: t('app.kuaizhizao.labelStation.barcode'), dataIndex: 'barcode' },
                  {
                    title: t('common.status'),
                    dataIndex: 'status',
                    render: (v) => <Tag variant="filled">{String(v)}</Tag>,
                  },
                  {
                    title: t('app.kuaizhizao.labelStation.scannedAt'),
                    dataIndex: 'scanned_at',
                  },
                  {
                    title: t('common.action'),
                    render: (_, row) =>
                      bindPerms.canUpdate && box?.id ? (
                        <Button
                          type="link"
                          size="small"
                          danger
                          onClick={async () => {
                            try {
                              await labelStationApi.unbind({
                                box_id: Number(box.id),
                                barcode: String(row.barcode),
                              });
                              await refreshSession();
                              message.success(t('common.operationSuccess'));
                            } catch (error) {
                              message.error(getApiErrorMessage(error, t('common.failed')));
                            }
                          }}
                        >
                          {t('app.kuaizhizao.labelStation.unbind')}
                        </Button>
                      ) : null,
                  },
                ]}
              />
            </>
          )}
        </Space>
      ),
    },
    {
      key: 'config',
      label: t('app.kuaizhizao.labelStation.tabConfig'),
      children: (
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <Card
            size="small"
            title={t('app.kuaizhizao.labelStation.models')}
            extra={
              stationPerms.canCreate ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setEditingModel(null);
                    modelForm.resetFields();
                    modelForm.setFieldsValue({
                      qty_per_box: 1,
                      print_copies: 1,
                      is_active: true,
                    });
                    setModelModalOpen(true);
                  }}
                >
                  {t('app.kuaizhizao.labelStation.createModel')}
                </Button>
              ) : null
            }
          >
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={models}
              columns={[
                { title: t('app.kuaizhizao.labelStation.modelCode'), dataIndex: 'model_code' },
                { title: t('app.kuaizhizao.labelStation.modelName'), dataIndex: 'model_name' },
                {
                  title: t('app.kuaizhizao.labelStation.qtyPerBox'),
                  dataIndex: 'qty_per_box',
                  width: 100,
                },
                {
                  title: t('common.action'),
                  render: (_, row) =>
                    stationPerms.canUpdate ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          setEditingModel(row);
                          modelForm.setFieldsValue(row);
                          setModelModalOpen(true);
                        }}
                      >
                        {t('common.edit')}
                      </Button>
                    ) : null,
                },
              ]}
            />
          </Card>
          <Card
            size="small"
            title={t('app.kuaizhizao.labelStation.stations')}
            extra={
              stationPerms.canCreate ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setEditingStation(null);
                    stationForm.resetFields();
                    stationForm.setFieldsValue({
                      default_mode: 'work',
                      is_active: true,
                      unlock_requires_password: false,
                    });
                    setStationModalOpen(true);
                  }}
                >
                  {t('app.kuaizhizao.labelStation.createStation')}
                </Button>
              ) : null
            }
          >
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={stations}
              columns={[
                {
                  title: t('app.kuaizhizao.labelStation.stationCode'),
                  dataIndex: 'station_code',
                },
                {
                  title: t('app.kuaizhizao.labelStation.stationName'),
                  dataIndex: 'station_name',
                },
                {
                  title: t('common.action'),
                  render: (_, row) =>
                    stationPerms.canUpdate ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          setEditingStation(row);
                          stationForm.setFieldsValue(row);
                          setStationModalOpen(true);
                        }}
                      >
                        {t('common.edit')}
                      </Button>
                    ) : null,
                },
              ]}
            />
          </Card>
        </Space>
      ),
    },
    ...(extraTabItems || []),
  ];

  return (
    <>
      <MultiTabListPageTemplate
        activeTabKey={activeTabKey}
        onTabChange={setActiveTabKey}
        tabs={(tabItems || []).map((item) => ({
          key: String(item.key),
          label: item.label,
          children: item.children,
        }))}
      />

      <FormModalTemplate
        open={modelModalOpen}
        title={
          editingModel
            ? t('app.kuaizhizao.labelStation.editModel')
            : t('app.kuaizhizao.labelStation.createModel')
        }
        width={MODAL_CONFIG.STANDARD_WIDTH}
        grid={false}
        form={modelForm}
        onOpenChange={setModelModalOpen}
        onFinish={async (values) => {
          try {
            if (editingModel) {
              await labelStationApi.updateModel(editingModel.id, values);
            } else {
              await labelStationApi.createModel(values);
            }
            message.success(t('common.saveSuccess'));
            setModelModalOpen(false);
            await reloadConfigs();
            return true;
          } catch (error) {
            message.error(getApiErrorMessage(error, t('common.saveFailed')));
            return false;
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="model_code"
              label={t('app.kuaizhizao.labelStation.modelCode')}
              disabled={!!editingModel}
              placeholder={t('common.autoCodePlaceholder')}
              hidden={!!editingModel}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="model_name"
              label={t('app.kuaizhizao.labelStation.modelName')}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="template_uuid"
              label={t('app.kuaizhizao.labelStation.templateUuid')}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="qty_per_box"
              label={t('app.kuaizhizao.labelStation.qtyPerBox')}
              min={1}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit name="print_copies" label={t('app.kuaizhizao.labelStation.printCopies')} min={1} />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name={['policy_config', 'box_no_unique_days']}
              label={t('app.kuaizhizao.labelStation.boxNoUniqueDays')}
              min={1}
              fieldProps={{ precision: 0 }}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="remarks" label={t('common.remark')} />
          </Col>
          <Col span={12}>
            <ProFormSwitch name="is_active" label={t('common.enabled')} />
          </Col>
        </Row>
      </FormModalTemplate>

      <FormModalTemplate
        open={stationModalOpen}
        title={
          editingStation
            ? t('app.kuaizhizao.labelStation.editStation')
            : t('app.kuaizhizao.labelStation.createStation')
        }
        width={MODAL_CONFIG.STANDARD_WIDTH}
        grid={false}
        form={stationForm}
        onOpenChange={setStationModalOpen}
        onFinish={async (values) => {
          try {
            if (editingStation) {
              await labelStationApi.updateStation(editingStation.id, values);
            } else {
              await labelStationApi.createStation(values);
            }
            message.success(t('common.saveSuccess'));
            setStationModalOpen(false);
            await reloadConfigs();
            return true;
          } catch (error) {
            message.error(getApiErrorMessage(error, t('common.saveFailed')));
            return false;
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="station_code"
              label={t('app.kuaizhizao.labelStation.stationCode')}
              disabled={!!editingStation}
              placeholder={t('common.autoCodePlaceholder')}
              hidden={!!editingStation}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="station_name"
              label={t('app.kuaizhizao.labelStation.stationName')}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="model_config_id"
              label={t('app.kuaizhizao.labelStation.defaultModel')}
              options={modelSelectOptions}
              allowClear
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="default_mode"
              label={t('app.kuaizhizao.labelStation.modeLabel')}
              options={modeOptions}
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch
              name="unlock_requires_password"
              label={t('app.kuaizhizao.labelStation.unlockRequiresPassword')}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="remarks" label={t('common.remark')} />
          </Col>
          <Col span={12}>
            <ProFormSwitch name="is_active" label={t('common.enabled')} />
          </Col>
        </Row>
      </FormModalTemplate>
    </>
  );
}

export default LabelStationWorkbench;
