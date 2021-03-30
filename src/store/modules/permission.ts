import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import store from '/@/store/index';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';

import { asyncRoutes } from '/@/router/routes';
import { filter } from '/@/utils/helper/treeHelper';
import { generator } from '/@/utils/http/axios/routerUtil';
import { toRaw } from 'vue';
import { getMenuListById } from '/@/api/sys/menu';

import { transformObjToRoute } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/constant';

const { createMessage } = useMessage();
const NAME = 'app-permission';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
  // Permission code list
  private permCodeListState: string[] = [];

  // Whether the route has been dynamically added
  private isDynamicAddedRouteState = false;

  // To trigger a menu update
  private lastBuildMenuTimeState = 0;

  // Backstage menu list
  private backMenuListState: Menu[] = [];

  get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getBackMenuListState() {
    return this.backMenuListState;
  }

  get getLastBuildMenuTimeState() {
    return this.lastBuildMenuTimeState;
  }

  get getIsDynamicAddedRouteState() {
    return this.isDynamicAddedRouteState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitBackMenuListState(list: Menu[]): void {
    this.backMenuListState = list;
  }

  @Mutation
  commitLastBuildMenuTimeState(): void {
    this.lastBuildMenuTimeState = new Date().getTime();
  }

  @Mutation
  commitDynamicAddedRouteState(added: boolean): void {
    this.isDynamicAddedRouteState = added;
  }

  @Mutation
  commitResetState(): void {
    this.isDynamicAddedRouteState = false;
    this.permCodeListState = [];
    this.backMenuListState = [];
    this.lastBuildMenuTimeState = 0;
  }

  @Action
  async buildRoutesAction(id?: number | string): Promise<AppRouteRecordRaw[]> {
    const { t } = useI18n();
    let routes: AppRouteRecordRaw[] = [];
    const roleList = toRaw(userStore.getRoleListState);

    const { permissionMode = PermissionModeEnum.ROLE } = appStore.getProjectConfig;

    // role permissions
    if (permissionMode === PermissionModeEnum.ROLE) {
      routes = filter(asyncRoutes, (route) => {
        const { meta } = route as AppRouteRecordRaw;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      });
      //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
    } else if (permissionMode === PermissionModeEnum.BACK) {
      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });
      // Here to get the background routing menu logic to modify by yourself
      const paramId = id || userStore.getUserInfoState.UserInfo.Id;
      if (!paramId) {
        throw new Error('paramId is undefined!');
      }
      const res = (await getMenuListById()) as AppRouteRecordRaw[];

      const resRouters = generator(res);

      // 开发模式额外路由
      //   let devRouter = [
      //     {
      //       title: '开发',
      //       icon: 'code',
      //       children: [
      //         {
      //           path: '/Base_Manage/Base_DbLink/List',
      //           title: '数据库连接',
      //         },
      //         {
      //           path: '/Base_Manage/BuildCode/List',
      //           title: '代码生成',
      //         },
      //         {
      //           path: '/Develop/IconSelectorView',
      //           title: '图标选择',
      //         },
      //         {
      //           path: '/Develop/UploadImg',
      //           title: '图片上传Demo',
      //         },
      //         {
      //           path: '/Develop/UploadFile',
      //           title: '文件上传Demo',
      //         },
      //         {
      //           path: '/Develop/Editor',
      //           title: '富文本Demo',
      //         },
      //         {
      //           path: '/Develop/SelectSearch',
      //           title: '下拉搜索Demo',
      //         },
      //       ],
      //     },
      //   ];

      //   if (!import.meta.env.PROD as boolean) {
      //     routeList.push(...devRouter);
      //   }
      let routeList = resRouters;
      //   //首页根路由
      //   let rootRouter = {
      //     // 路由地址 动态拼接生成如 /dashboard/workplace
      //     path: '/home',
      //     redirect: '',
      //     // 路由名称，建议唯一
      //     name: 'Home',
      //     // 该路由对应页面的 组件
      //     component: '/dashboard/welcome/index',
      //     // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      //     meta: { title: '首页', icon: 'bx:bx-home', aiffix: true },
      //     children: [],
      //   };
      // Dynamically introduce components
      routeList = transformObjToRoute(routeList);
      //  Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);

      this.commitBackMenuListState(backMenuList);

      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
    }
    routes.push(ERROR_LOG_ROUTE);
    return routes;
  }
}
export const permissionStore = getModule<Permission>(Permission);
