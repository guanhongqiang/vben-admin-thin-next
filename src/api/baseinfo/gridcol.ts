import { BasicColumn } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GETDataSettingList = '/Base_Manage/Base_DataSetting/GetDataListByActionId',
}

/**
 * @description: Get sample list value
 */
export function DataSettingListApi(params: { ActionId: string }) {
  return defHttp.request<Array<BasicColumn>>({
    url: Api.GETDataSettingList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}
