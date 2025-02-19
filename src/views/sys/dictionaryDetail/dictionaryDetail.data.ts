import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDateTime } from '/@/utils/dateUtil';
import { updateDictionaryDetail } from '/@/api/sys/dictionaryDetail';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { h } from 'vue';
import { getDictionaryList } from '/@/api/sys/dictionary';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('common.displayName'),
    dataIndex: 'title',
    width: 100,
  },
  {
    title: t('sys.dictionary.key'),
    dataIndex: 'key',
    width: 100,
  },
  {
    title: t('sys.dictionary.value'),
    dataIndex: 'value',
    width: 100,
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
          updateDictionaryDetail({ id: record.id, status: newStatus })
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
    field: 'key',
    label: t('sys.dictionary.key'),
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
    field: 'title',
    label: t('common.displayName'),
    component: 'Input',
  },
  {
    field: 'key',
    label: t('sys.dictionary.key'),
    component: 'Input',
  },
  {
    field: 'value',
    label: t('sys.dictionary.value'),
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
  {
    field: 'dictionaryId',
    label: t('sys.dictionary.name'),
    component: 'ApiSelect',
    required: true,
    // defaultValue: Number(unref(currentRoute).params),
    componentProps: {
      api: getDictionaryList,
      params: {
        page: 1,
        pageSize: 1000,
      },
      resultField: 'data.data',
      labelField: 'title',
      valueField: 'id',
    },
  },
];
