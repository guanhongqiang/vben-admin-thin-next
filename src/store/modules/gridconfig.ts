import store from '/@/store/index';
import { VuexModule, Module, getModule, Action } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { DataSettingListApi } from '../../api/baseinfo/gridcol';
import { BasicColumn } from '/@/components/Table';

const NAME = 'app-user';
hotModuleUnregisterModule(NAME);

@Module({ namespaced: true, name: NAME, dynamic: true, store })
class GridInfo extends VuexModule {
  // user info
  private gridInfoState: BasicColumn[] | null = null;

  /**
   * @description: login
   */
  @Action
  async gridInfo(params: { ActionId: string }): Promise<BasicColumn[]> {
    try {
      const data = await DataSettingListApi(params);
      return data;
    } catch (error) {
      return [];
    }
  }
}
export const gridStore = getModule<GridInfo>(GridInfo);
