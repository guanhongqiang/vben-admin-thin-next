export const generator = (routerMap, _parent?) => {
  return routerMap.map((item) => {
    const hasChildren = item.children && item.children.length > 0;

    //   if (!hasParent) {
    //     component = '/dashboard/welcome/index';
    //   }
    //   if (hasChildren) {
    //     component = {};
    //   } else if (item.path) {
    //     component = () => import(`@/views${item.path}`);
    //   }
    const currentRouter = {
      path: item.path,
      // 路由名称，建议唯一
      name: item.title,
      // 该路由对应页面的 组件
      component: item.Url,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined },
      redirect: '',
      children: [],
    };
    //   //有子菜单
    //   if (hasChildren) {
    //   } else if (item.path) {
    //     //页面
    //     currentRouter.path = item.path;
    //     currentRouter.path = currentRouter.path.replace('//', '/');
    //   }

    //   // 重定向
    //   item.redirect && (currentRouter.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (hasChildren) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter);
    }
    return currentRouter;
  });
};
