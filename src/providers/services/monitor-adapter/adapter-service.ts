import {DataSourceItem, HistoryDataInfo, LatestDataInfo, AdapterQueryModel, MonitorItemInfo} from '@/providers/models/monitor-adapter/adapter-model'
import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'

/**
 * 根据多个监控项id获取格式化的监控值历史数据
 * @param minutes
 * @param dataSourceList
 */
function getHistoryDataInfo(minutes: number, dataSourceList: DataSourceItem[]): Promise<HistoryDataInfo> {
  return HttpUtil.post({
    api: `adapter/history/${minutes}`,
    gateway: Gateway.Adapter,
    body: dataSourceList,
    disableLoading: true
  })
}

/**
 * 根据监控项idList获取监控最新值
 * @param dataSourceList
 */
function getLatestDataInfo(dataSourceList: DataSourceItem[]): Promise<LatestDataInfo> {
  return HttpUtil.post({
    api: 'adapter/items',
    gateway: Gateway.Adapter,
    body: dataSourceList,
    disableLoading: true
  })
}

/**
 * 根据条件获取监控项统计前5的数据（从设配器获取）
 * @param monitorParam
 */
function getMonitorItemData(monitorParam: AdapterQueryModel): Promise<MonitorItemInfo[]> {
  return HttpUtil.post({
    api: 'adapter/item/top',
    gateway: Gateway.Adapter,
    body:  monitorParam,
    disableLoading: true
  })
}

const AdapterService = {
  getHistoryDataInfo,
  getLatestDataInfo,
  getMonitorItemData
}
export default AdapterService