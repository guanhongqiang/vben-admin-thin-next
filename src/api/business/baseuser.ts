import { defHttp } from '/@/utils/http/axios';
enum Api {
  GETUserDataList = '​/Base_Manage​/Base_User​/GetDataList',
}

/**
 * @description: Get sample list value
 */

export function BaseUserListApi(params: { ActionId: string }) {
  return defHttp.request({
    url: Api.GETUserDataList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}
