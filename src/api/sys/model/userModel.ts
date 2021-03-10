/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

export interface RoleInfo {
  RoleName: string;
  Value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoByUserIdModel {
  Permissions: string[];
  UserInfo: UserInfo;
}

export interface UserInfo {
  roles: RoleInfo[];
  // 用户id
  Id: string | number;
  // 用户名
  UserName: string;
  // 真实名字
  RealName: string;
  // 介绍
  Desc?: string;

  RoleNames: string;

  RoleIdList: string;

  RoleNameList: string;
}
