import React, { useEffect, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate } from '../../../../../components/layout-templates';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import { glService } from '../../../services/gl';

const NS = 'app.kuaicaiwu.gl.vouchers';

type Props = {
  open: boolean;
  enableVoucherWords: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ReorganizeVouchersModal: React.FC<Props> = ({
  open,
  enableVoucherWords,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (!open) return;
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      organize_date: dayjs(),
      voucher_word: '全部',
      method: 'shift_gaps',
    });
  }, [open]);

  const handleFinish = async (values: Record<string, unknown>) => {
    const organizeDate = values.organize_date as dayjs.Dayjs;
    try {
      const res = await glService.reorganizeVouchers({
        organize_date: organizeDate.format('YYYY-MM-DD'),
        voucher_word: values.voucher_word as string,
        method: values.method as 'shift_gaps' | 'by_date',
      });
      const count = Number(res.updated_count || 0);
      if (count > 0) {
        messageApi.success(
          t(`${NS}.reorganize.success`, {
            defaultValue: '已整理 {{count}} 张凭证号',
            count,
          }),
        );
      } else {
        messageApi.info(
          t(`${NS}.reorganize.noChange`, { defaultValue: '当前期间凭证号已连续，无需整理' }),
        );
      }
      onSuccess();
      onClose();
      return true;
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, t(`${NS}.reorganize.failed`, { defaultValue: '整理凭证失败' })),
      );
      return false;
    }
  };

  const wordOptions = enableVoucherWords
    ? [
        { label: t(`${NS}.reorganize.wordAll`, { defaultValue: '全部' }), value: '全部' },
        { label: '记', value: '记' },
        { label: '收', value: '收' },
        { label: '付', value: '付' },
        { label: '转', value: '转' },
      ]
    : [{ label: t(`${NS}.reorganize.wordAll`, { defaultValue: '全部' }), value: '全部' }];

  return (
    <FormModalTemplate
      title={t(`${NS}.reorganize.title`, { defaultValue: '整理凭证' })}
      open={open}
      onClose={onClose}
      formRef={formRef}
      initialValues={{
        organize_date: dayjs(),
        voucher_word: '全部',
        method: 'shift_gaps',
      }}
      onFinish={handleFinish}
    >
      <ProFormDatePicker
        name="organize_date"
        label={t(`${NS}.reorganize.field.date`, { defaultValue: '整理日期' })}
        rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormSelect
        name="voucher_word"
        label={t(`${NS}.field.voucherWord`, { defaultValue: '凭证字' })}
        options={wordOptions}
        rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
      />
      <ProFormRadio.Group
        name="method"
        label={t(`${NS}.reorganize.field.method`, { defaultValue: '整理方式' })}
        options={[
          {
            label: t(`${NS}.reorganize.method.shiftGaps`, {
              defaultValue: '按凭证号顺次前移补齐断号',
            }),
            value: 'shift_gaps',
          },
          {
            label: t(`${NS}.reorganize.method.byDate`, {
              defaultValue: '按凭证日期重新顺次编号',
            }),
            value: 'by_date',
          },
        ]}
        rules={[{ required: true, message: t('common.required', { defaultValue: '必填' }) }]}
      />
    </FormModalTemplate>
  );
};

export default ReorganizeVouchersModal;
