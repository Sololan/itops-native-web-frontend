import {UserInfo} from '@/providers/models/uc/users-model'
import HttpUtil from '@/providers/utils/http-util'
import {Gateway, StorageKey} from '@/providers/models/enums'
import StorageUtil from '@/providers/utils/storage-util'
import {UserUrl} from '@/providers/models/url'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {UserQueryModel} from '@/providers/models/uc/user-query-model'

/**
 * 获取用户信息（服务器获取）
 */
function _getUserInfo(): Promise<UserInfo> {
  const username = StorageUtil.getItem(StorageKey.UserName)
  return HttpUtil.get<UserInfo>({
    api: `/users/username/${username}`,
    gateway: Gateway.Uc,
    disableLoading: true,
    disableBsErrorHandle: true
  })
  /*.then((userInfo) => {
    userInfo.menus[0].children[0].uri = '/main/home'
    return userInfo
  })*/
}

/**
 * 获取用户信息（优先缓存获取）
 * @param disableCache
 */
function getUserInfoFromCache(disableCache?: boolean): Promise<UserInfo> {
  if (!disableCache) {
    const userInfoCache: UserInfo = StorageUtil.getItem(StorageKey.UserInfo)
    if (userInfoCache) {
      return Promise.resolve(userInfoCache)
    }
  }
  return _getUserInfo().then((userInfo) => {
    StorageUtil.setItem(StorageKey.UserInfo, userInfo)
    return userInfo
  })
}

function queryUsers(queryBody: PageQuery<UserQueryModel>): Promise<PageResult<UserInfo[]>> {
  return HttpUtil.post({
    api: UserUrl.users,
    gateway: Gateway.Uc,
    body: queryBody
  })
}

function getByUsername(username: string): Promise<UserInfo> {
  return HttpUtil.get({
    api: UserUrl.getByUsername(username),
    gateway: Gateway.Uc,
    disableBsErrorHandle: true,
    disableHttpErrorHandle: true
  })
}

function addUser(user: any): Promise<any> {
  return HttpUtil.post({
    api: UserUrl.add,
    gateway: Gateway.Bs,
    body: user
  })
}

function updateUser(user: any): Promise<any> {
  return HttpUtil.post({
    api: UserUrl.update(user.id),
    gateway: Gateway.Bs,
    body: user
  });
}

function deleteUser(id: number): Promise<any>{
  return HttpUtil.post({
    api: UserUrl.deleteUser(id),
    gateway: Gateway.Bs
  });
}

function resetPwd(id: number): Promise<any>{
  return HttpUtil.post({
    api: UserUrl.resetPwd(id),
    gateway: Gateway.Bs
  });
}

function changePwd(pwd: any): Promise<any> {
  return HttpUtil.post({
    api: UserUrl.changePwd(pwd.id),
    gateway: Gateway.Uc,
    body: pwd
  });
}

function getUserInfoById(userId: number): Promise<any> {
  return HttpUtil.get<UserInfo>({
    api: `users/${userId}`,
    gateway: Gateway.Uc
  })
}

const UsersService = {
  getUserInfoFromCache,
  queryUsers,
  getByUsername,
  addUser,
  updateUser,
  deleteUser,
  resetPwd,
  changePwd,
  getUserInfoById
}
export default UsersService
