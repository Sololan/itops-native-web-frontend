
export interface AuthQueryModel {
  endEndTime?: string // 截止结束时间
  endStartTime?: string // 截止开始时间
  orgId?: number // 当前组织
  endTime?: string // 结束时间
  startTime?: string // 开始时间
  status: string // 状态
}

export interface WarningMsgLicenseModel {
  orgId?: number
  licenseCode?: string
  startDate?: Date
  endDate?: Date
  expireTime?: Date
  isWx?: number
  isEmail?: number
  isMsg?: number
  msgQuantity?: number
  isPhone?: number
  phoneQuantity?: number
  usedMsgQuantity?: number
  usedPhoneQuantity?: number
}

export interface MonitorLicenseModel {
  applicationQuantity?: number // 可监控的应用
  usedStorageQuantity?: number // 已使用的监控的存储
  usedWebQuantity?: number // 已使用的监控的web
  usedApplicationQuantity?: number // 已使用的监控的应用
  usedMiddlewareQuantity?: number // 已使用的监控的中间件
  usedDbQuantity?: number // 已使用的监控的数据库
  usedNetworkQuantity?: number // 已使用的监控的网络设备
  usedOsQuantity?: number // 已使用的监控的操作系统数量
  usedHardwareQuantity?: number // 已使用的监控的硬件数量
  storageQuantity?: number // 可监控的存储
  webQuantity?: number // 可监控的web
  middlewareQuantity?: number // 可监控的中间件
  dbQuantity?: number // 可监控的数据库
  networkQuantity?: number // 可监控的网络设备
  osQuantity?: number // 可监控的操作系统数量
  hardwareQuantity?: number // 可监控的硬件数量
  expireTime?: Date // 失效时间
  endDate?: Date // 结束日期
  startDate?: Date // 开始日期
  licenseCode?: string // 授权码
  orgId?: number // 根机构(T_BASE_ORG.ID)
 }