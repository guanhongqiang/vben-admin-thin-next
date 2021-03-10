import { defHttp } from '/@/utils/http/axios';
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from './model/menuModel';

enum Api {
  GetMenuListById = '/Base_Manage/Home/GetOperatorMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuListById = () => {
  return defHttp.get<getMenuListByIdParamsResultModel>({ url: Api.GetMenuListById });
};
