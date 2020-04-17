import {PageQuery} from '@/providers/models/common/http-model';
import {WarningQueryParam} from '@/providers/models/bs/warning-query-model';
import {TodayWarningModel, WarningParam} from '@/providers/models/bs/warning-model'
import HttpUtil from '@/providers/utils/http-util';
import {Gateway} from '@/providers/models/enums';


/**
 * 获取告警信息分页
 * @param pageQuery
 */
function getWarningPage(pageQuery: PageQuery<WarningQueryParam>){
    return HttpUtil.post({
        api: 'warning/page',
        gateway: Gateway.Bs,
        body: pageQuery
    })
}

/**
 * 根据告警id获取详细告警信息
 * @param id
 */
function getWarning(id: number): Promise<WarningParam> {
    return HttpUtil.get({
        api: `warning/warnings/${id}`,
        gateway: Gateway.Bs
    })
}
/**
 * 获取今日告警概况
 */
function getTodayWarningData(): Promise<TodayWarningModel> {
    return HttpUtil.get({
        api: 'warning/count/today'
    })
}
const WarningService = {getWarningPage, getWarning, getTodayWarningData}
export default WarningService
