import HttpUtil from '@/providers/utils/http-util'
import {AuthQueryModel, MonitorLicenseModel, WarningMsgLicenseModel} from '@/providers/models/bs/auth-model'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'

function getMonitorLicensesPage(queryParam: PageQuery<AuthQueryModel>): Promise<PageResult<MonitorLicenseModel[]>> {
  return HttpUtil.post({
    api: 'monitorLicenses/page',
    body: queryParam
  })
}

function getWarningLicencesPage(queryParam: PageQuery<AuthQueryModel>): Promise<PageResult<WarningMsgLicenseModel[]>> {
  return HttpUtil.post({
    api: 'warningMsgLicense/warningMsgLicense/page',
    body: queryParam
  })
}

const AuthService = {getMonitorLicensesPage, getWarningLicencesPage}
export default AuthService