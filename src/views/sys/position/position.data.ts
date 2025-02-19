import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDateTime } from '/@/utils/dateUtil';
import { updatePosition } from '/@/api/sys/position';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { h } from 'vue';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('sys.position.name'),
    dataIndex: 'trans',
    width: 80,
  },
  {
    title: t('sys.position.code'),
    dataIndex: 'code',
    width: 40,
  },
  {
    title: t('common.remark'),
    dataIndex: 'remark',
    width: 80,
  },
  {
    title: t('common.sort'),
    dataIndex: 'sort',
    width: 20,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    width: 50,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: t('common.on'),
        unCheckedChildren: t('common.off'),
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          const { createMessage } = useMessage();
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 2;
          updatePosition({ id: record.id, status: newStatus })
            .then((data) => {
              record.status = newStatus;
              if (data.code == 0) createMessage.success(t('common.changeStatusSuccess'));
            })
            .catch(() => {
              createMessage.error(t('common.changeStatusFailed'));
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: t('common.createTime'),
    dataIndex: 'createdAt',
    width: 70,
    customRender: ({ record }) => {
      return formatToDateTime(record.createdAt);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('sys.position.name'),
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: t('sys.position.code'),
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'remark',
    label: t('common.remark'),
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },

  {
    field: 'sort',
    label: t('common.sort'),
    component: 'InputNumber',
  },
  {
    field: 'name',
    label: t('sys.position.name'),
    component: 'Input',
  },
  {
    field: 'code',
    label: t('sys.position.code'),
    component: 'Input',
  },
  {
    field: 'remark',
    label: t('common.remark'),
    component: 'Input',
  },
  {
    field: 'status',
    label: t('common.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('common.on'), value: 1 },
        { label: t('common.off'), value: 2 },
      ],
    },
  },
];
