<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, computed } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BaseUserListApi } from '../../../api/business/baseuser';
  import { gridStore } from '/@/store/modules/gridconfig';
  import { getFormConfig } from './tableData';
  import { BasicColumn } from '/@/components/Table';

  //    [
  //     {
  //       title: 'ID',
  //       dataIndex: 'id',
  //       width: 200,
  //     },
  //     {
  //       title: '姓名',
  //       dataIndex: 'name',
  //       width: 120,
  //       slots: { title: 'customTitle' },
  //     },
  //     {
  //       title: '地址',
  //       dataIndex: 'address',
  //       width: 120,
  //       slots: { title: 'customAddress' },
  //       sorter: true,
  //     },

  //     {
  //       title: '编号',
  //       dataIndex: 'no',
  //       width: 120,
  //       filters: [
  //         { text: 'Male', value: 'male', children: [] },
  //         { text: 'Female', value: 'female', children: [] },
  //       ],
  //     },
  //     {
  //       title: '开始时间',
  //       dataIndex: 'beginTime',
  //       width: 120,
  //     },
  //     {
  //       title: '结束时间',
  //       dataIndex: 'endTime',
  //       width: 120,
  //     },
  //   ];
  export default defineComponent({
    components: { BasicTable },

    setup() {
      const Data = reactive({
        columns: [] as BasicColumn[],
      });

      const [registerTable] = useTable({
        title: '开启搜索区域',
        api: BaseUserListApi,
        columns: computed(() => {
          return getColumnData({ ActionId: '1182652266117599232' });
        }),
        useSearchForm: true,
        formConfig: getFormConfig(),
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
      });

      function init() {}
      function getColumnData(params: { ActionId: string }): BasicColumn[] {
        gridStore.gridInfo(params).then((resJson) => {
          Data.columns = resJson;
        });
        return Data.columns;
      }

      onMounted(() => {
        init();
      });

      return {
        registerTable,
      };
    },
  });
</script>
