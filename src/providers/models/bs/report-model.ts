
/**
 * 告警报表统计查询参数
 */
export interface AlarmQueryModel {
  endTime?: string
  identifier?: number
  orgId?: number
  startTime?: string
  topNumber?: number
}

/**
 * 报表统计-告警响应信息
 */
export interface AlarmCountDataModel {
  dates?: string // 日期
  warningNumber?: number // 当天的告警数量
}