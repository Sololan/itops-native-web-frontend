import {DictGroupKey, Gateway} from '@/providers/models/enums'
import HttpUtil from '@/providers/utils/http-util'
import {DictInfo} from '@/providers/models/uc/dicts-model'

/**
 * 根据字典组key获取字典项集合
 * @param dictGroupKey
 * @param disableLoading
 */
function getDictList(dictGroupKey: DictGroupKey, disableLoading?: boolean): Promise<DictInfo[]> {
  return HttpUtil.get({api: `dicts/groups/keys/${dictGroupKey}/items`, gateway: Gateway.Uc, disableLoading})
}

/**
 * 根据父字典项ID获取字典项集合
 * @param pid
 * @param disableLoading
 */
function getDictListByPid(pid: number, disableLoading?: boolean): Promise<DictInfo[]> {
  return HttpUtil.get({api: `dicts/groups/${pid}/items`, gateway: Gateway.Uc, query:{name: ``}, disableLoading})
}

/**
 * 根据字典组ID和父字典项ID获取字典项集合
 * @param pid
 * @param disableLoading
 */
function getDictListByGidAndPid(id:number, pid: number, disableLoading?: boolean): Promise<DictInfo[]> {
  return HttpUtil.get({api: `dicts/groups/${id}/pid/${pid}/items`, gateway: Gateway.Uc, disableLoading})
}

function getItemsByGroupKey(key: string): Promise<any> {
  return HttpUtil.get({
    api: `dicts/groups/keys/${key}/items`,
    gateway: Gateway.Uc,
    query: {
      name
    }
  })
}
/**
 Author: liuzt
 Time: 2020/2/29 10:56
 Description: get dict group by dict key
 */
function getDictGroups(): Promise<any> {
  return HttpUtil.get({
    api: 'dicts/groups',
    gateway: Gateway.Uc,
    query: {
      orgId: 1,
      groupName: ''
    }
  })
}
/**
 Author: liuzt
 Time: 2020/2/29 11:11
 Description: get dict item tree by dict group's id and dict item's pid
 */
function getDictItemTree(id: number) {
  return HttpUtil.post({
    api: `dicts/groups/${id}/items/tree`,
    gateway: Gateway.Uc,
  })
}

const DictService = {getDictList, getDictListByPid, getDictListByGidAndPid,getItemsByGroupKey,getDictGroups,getDictItemTree}
export default DictService
