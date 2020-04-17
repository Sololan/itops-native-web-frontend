
import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'

function activeCode(code: string): Promise<string> {
    return HttpUtil.get({
        api: `/cloud/nativeAuthorize/${code}`,
        gateway: Gateway.Bs,
    })
}

const licenseService = {activeCode}
export default licenseService
