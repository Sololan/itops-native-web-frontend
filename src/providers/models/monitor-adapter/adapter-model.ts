/**
 * 数据源项
 */
export interface DataSourceItem {
  id: string  // 数据源id
  name: string  // 数据源名称
}

/**
 * 历史数据信息
 */
export interface HistoryDataInfo {
  now: string
  dataList: {
    data: string[]
    dataName: string
  }[],
  xdata: string[],
  units: string
}

export interface LatestDataInfo {
  now: string
  dataList: {
    lastvalue: string
    name: string
  } [],
  units: string
}

/*
 * 首页-监控项查询参数
 */
export interface AdapterQueryModel {
  key?: string // 监控项key
  n?: number // 统计前n个
}

/**
 * 监控项信息
 */
export interface  MonitorItemInfo {
  host?: string
  hostid?: string
  hostname?: string
  itemid?: string
  key_?: string
  lastvalue?: string

}