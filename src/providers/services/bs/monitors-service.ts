import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {MonitorChartConfigInfo, MonitorDetailInfo, MonitorFullInfo, MonitorInfo, MonitorMethodInfo, MonitorMethodParamInfo, MonitorObjectInfo, MonitorsPageQuery, MonitorSubTypeInfo, MonitorTypeInfo} from '@/providers/models/bs/monitors-model'
import HttpUtil from '@/providers/utils/http-util'

/**
 * 获取监控分页列表数据
 * @param pageQuery
 */
function getMonitorPageList(pageQuery: PageQuery<MonitorsPageQuery>): Promise<PageResult<MonitorInfo[]>> {
  return HttpUtil.post({api: 'monitors/page', body: pageQuery})
}

/**
 * 根据设备子类型查询监控类型
 * @param equipmentSubTypeId
 */
function getMonitorTypeList(equipmentSubTypeId: number): Promise<MonitorTypeInfo[]> {
  return HttpUtil.get({api: `monitors/equipmentsSubType/${equipmentSubTypeId}/monitorTypes`})
}

/**
 * 根据设备子类型和监控类型id获取监控子类型
 * @param equipmentSubTypeId
 * @param monitorTypeId
 */
function getMonitorSubTypeList(equipmentSubTypeId: number, monitorTypeId: number): Promise<MonitorSubTypeInfo[]> {
  return HttpUtil.get({api: `monitors/equipmentsSubType/${equipmentSubTypeId}/monitorTypes/${monitorTypeId}/monitorTypeSubs`})
}

/**
 * 根据监控子类型id获取监控方式
 * @param monitorSubTypeId
 */
function getMonitorMethodList(monitorSubTypeId: number): Promise<MonitorMethodInfo[]> {
  return HttpUtil.get({api: `monitors/monitorTypeSubs/${monitorSubTypeId}/monitorSubMethods`})
}

/**
 * 根据监控方式id获取监控方式参数
 * @param monitorMethodId
 */
function getMonitorMethodParamList(monitorMethodId: number): Promise<MonitorMethodParamInfo[]> {
  return HttpUtil.get({api: `monitors/monitorSubMethods/${monitorMethodId}/monitorMethodParam`})
}

/**
 * 保存监控配置信息
 * @param monitorFullInfo
 */
function saveMonitorFullInfo(monitorFullInfo: MonitorFullInfo): Promise<string> {
  return HttpUtil.post({api: 'monitors', body: monitorFullInfo})
}

/**
 * 更新监控配置信息
 * @param monitorFullInfo
 */
function updateMonitorFullInfo(monitorFullInfo: MonitorFullInfo): Promise<string> {
  return HttpUtil.post({api: `monitors/${monitorFullInfo.id}`, body: monitorFullInfo})
}

/**
 * 删除监控
 * @param monitorId
 */
function deleteMonitor(monitorId: number): Promise<string> {
  return HttpUtil.post({api: `monitors/${monitorId}/delete`})
}

/**
 * 禁用监控
 * @param monitorId
 */
function disableMonitor(monitorId: number): Promise<string> {
  return HttpUtil.post({api: `monitors/${monitorId}/forbid`})
}

/**
 * 启用监控
 * @param monitorId
 */
function enableMonitor(monitorId: number): Promise<string> {
  return HttpUtil.post({api: `monitors/${monitorId}/unforbid`})
}

/**
 * 根据监控信息id获取监控详细参数
 * @param monitorId
 */
function getMonitorFullInfo(monitorId: number): Promise<MonitorFullInfo> {
  return HttpUtil.get({api: `monitors/${monitorId}`})
}

/**
 * 根据监控信息id获取监控详细设定信息
 * @param monitorId
 */
function getMonitorDetailInfo(monitorId: number): Promise<MonitorDetailInfo> {
  return HttpUtil.get({api: `monitors/monitorShowSettingPage/${monitorId}`})
}

/**
 * 根据监控信息id获取监控类型
 * @param monitorId
 */
function getMonitorTypeListByMonitorId(monitorId: number): Promise<MonitorTypeInfo[]> {
  return HttpUtil.get({api: `monitors/monitorType/monitor/${monitorId}`})
}

/**
 * 保存监控数据展现设置
 * @param monitorChartConfigInfo
 */
function saveMonitorChartConfigInfo(monitorChartConfigInfo: MonitorChartConfigInfo): Promise<string> {
  return HttpUtil.post({api: 'monitors/monitorShowSetting', body: monitorChartConfigInfo})
}

/**
 * 更新监控数据展现设置
 * @param monitorChartConfigInfo
 */
function updateMonitorChartConfigInfo(monitorChartConfigInfo: MonitorChartConfigInfo): Promise<string> {
  return HttpUtil.post({api: `monitors/monitorShowSetting/${monitorChartConfigInfo.id}`, body: monitorChartConfigInfo})
}

/**
 * 根据id获取监控数据展现设置
 * @param configId
 */
function getMonitorChartConfigInfo(configId: number): Promise<MonitorChartConfigInfo> {
  return HttpUtil.get({api: `monitors/monitorShowSetting/${configId}`})
}

/**
 * 删除监控数据展现设置
 * @param chartConfigId
 */
function deleteMonitorChartConfig(chartConfigId: number) {
  return HttpUtil.post({api: `monitors/monitorShowSetting/${chartConfigId}/delete`})
}

/**
 * 根据监控信息id和监控类型id获取监控数据展现
 * @param monitorId
 * @param monitorTypeId
 */
function getMonitorChartConfigList(monitorId: number, monitorTypeId: number): Promise<MonitorChartConfigInfo[]> {
  return HttpUtil.get({api: `monitors/monitorShowSetting/monitor/${monitorId}/monitorType/${monitorTypeId}`})
}

/**
 * 获取监控对象信息
 */
function getMonitorData(): Promise<MonitorObjectInfo[]> {
  return HttpUtil.get({
    api: 'monitors/monitorType'
  })
}

const MonitorsService = {
  getMonitorPageList,
  getMonitorTypeList,
  getMonitorSubTypeList,
  getMonitorMethodList,
  getMonitorMethodParamList,
  saveMonitorFullInfo,
  updateMonitorFullInfo,
  getMonitorFullInfo,
  deleteMonitor,
  disableMonitor,
  enableMonitor,
  getMonitorDetailInfo,
  getMonitorTypeListByMonitorId,
  getMonitorChartConfigList,
  saveMonitorChartConfigInfo,
  updateMonitorChartConfigInfo,
  deleteMonitorChartConfig,
  getMonitorChartConfigInfo,
  getMonitorData
}
export default MonitorsService
