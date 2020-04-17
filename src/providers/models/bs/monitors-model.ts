import {MonitorChartType, MonitorTypeCode, YesOrNoStatus} from '@/providers/models/enums'
import {BaseModel} from '@/providers/models/base-model'

/**
 * 分页列表查询对象
 */
export interface MonitorsPageQuery {
  isValid?: YesOrNoStatus; // 启用状态 0：不启用 1：启用
  monitorName?: string; // 监控名称
  monitorType?: number; // 设备类型
  monitorUse?: number; // 设备用途
}

/**
 * 监控信息
 */
export interface MonitorInfo extends BaseModel {
  id: number; // ID
  monitorName: string;  // 监控名称
  businessSystem: string; // 设备用途字典项id
  businessSystemName: string; // 设备用途名称
  equipmentId: string; // 设备id
  equipmentType: string; // 设备类型
  ipAddress1: string; // ip地址1
  ipAddress2: string; // ip地址2
  isValid?: YesOrNoStatus; // 启用状态 0：不启用 1：启用
}

/**
 * 监控类型信息
 */
export interface MonitorTypeInfo {
  id: number; // ID
  monitorTypeCode: MonitorTypeCode;  // 监控类型code
  monitorTypeName: string;  // 监控类型名称
  sortNum: number;  // 排序
}

/**
 * 监控子类型信息
 */
export interface MonitorSubTypeInfo {
  id: number; // ID
  subName: string;  // 监控子类型名
  monitorTypeId: number;  // 监控类型id
  equipmentSubType: number;  // 设备子类型字典项id
  sortNum: number;  // 排序
}

/**
 * 监控方式信息
 */
export interface MonitorMethodInfo {
  id: number; // ID
  methodName: string; // 监控方式
  monitorTypeSubId: number; // 监控子类型id
  sortNum: number;  // 排序
}

/**
 * 监控方式参数信息
 */
export interface MonitorMethodParamInfo {
  id: number; // ID
  paramCode: string;  // 参数code
  paramName: string;  // 参数名称
  defaultValue: string; // 默认值
  isRequire: YesOrNoStatus; // 是否为必填
  monitorMethodId: number;  // 监控方式id
  sortNum: number;  // 排序
}

/**
 * 监控详细信息
 */
export interface MonitorFullInfo {
  id: number  // ID
  monitorName: string // 监控名称
  isValid: YesOrNoStatus  // 是否启用
  equipmentId: number // 设备id
  equipmentMode: string // 设备型号
  brand: number // 品牌（字典项id）
  brandName: string // 品牌名称
  businessSystem: number  // 设备用途（字典项id）
  monitorDetailType: MonitorDetailType[]  // 各监控子类型配置
}

/**
 * 监控子类型配置
 */
export interface MonitorDetailType {
  id: number  // ID
  monitorTypeId: number // 监控类型id
  monitorTypeName: string // 监控类型名称
  monitorTypeCode: string // 监控类型code
  monitorTypeSubId: number  // 监控子类型id
  monitorSubMethodId: number // 监控方式id
  monitorParam: MonitorDetailParam[]  // 监控参数列表
}

/**
 * 监控参数信息
 */
export interface MonitorDetailParam {
  id: number  // ID
  paramId: number // 参数id
  paramValue: string  // 参数值
}

/**
 * 监控详情信息
 */
export interface MonitorDetailInfo {
  id: number  // ID
  monitorName: string  // 监控名称
  businessSystemName: string  // 用途
  isValid: YesOrNoStatus  // 是否启用
  equipmentId: number  // 设备id
  equipmentCode: string  // 设备编号
  equipmentMode: string  // 设备型号
  equipmentTypeName: string  // 设备类型
  equipmentSubTypeName: string  // 设备子类型
  brandName: string  // 设备品牌
  serviceNumber: string  // 服务编号
  supplierName: string  // 供应商名称
  purchaseDate: string  // 购入日期
  expiration: string  // 质保截止日期
  hostid: string  // 主机id
  itemList: MonitorDataSourceInfo[] // 数据源集合
}

/**
 * 监控图表配置信息
 */
export interface MonitorChartConfigInfo extends BaseModel {
  id: number // ID
  monitorId: number // 监控信息id
  monitorTypeId: number // 监控类型id
  okValue: string // 正常值
  orgId: number // 组织id
  monitorItemName: string // 监控项名称
  chartType: MonitorChartType // 图表显示类型
  icon1: string // 开关类图表的图表-正常
  icon2: string // 开关类图表的图表-异常
  sortNum?: number;  // 排序
  monitorShowDataList: MonitorDataSourceConfigInfo[]  //  数据源信息
  monitorItemType?: string // （已废弃）监控项类型
}

/**
 * 数据源配置信息
 */
export interface MonitorDataSourceConfigInfo extends BaseModel {
  id?: number // ID
  monitorId?: number // 监控信息id
  monitorShowSettingId?: number  // 监控图表配置信息id
  dataItemName?: string // 数据项名称
  dataSourceKey?: string // 数据源的key
  sortNum?: number;  // 排序
}

/**
 * 数据源信息
 */
export interface MonitorDataSourceInfo {
  itemId: string
  itemName: string
}

/**
 * 监控对象信息
 */
export interface MonitorObjectInfo {
  monitorTypeName?: string
  count?: number
}
