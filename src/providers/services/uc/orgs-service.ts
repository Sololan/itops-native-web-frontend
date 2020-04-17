import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'

/**
 * 获取组织总数
 */
function getOrgTotal(): Promise<number> {
  return HttpUtil.get({api: 'orgs/total', gateway: Gateway.Uc})
}

const OrgService = {getOrgTotal}
export default OrgService