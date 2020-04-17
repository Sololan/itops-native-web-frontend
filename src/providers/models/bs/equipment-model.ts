import {BaseModel} from '../base-model'
import {EquipmentSubTypeKey} from '@/providers/models/enums'

/**
 * 设备查询参数
 */
export interface EquipmentPageQuery {
  equipmentCode?: string;  // 设备Code
  equipmentType?: number;  // 设备类型
  equipmentSubType?: number;  // 设备子类型
  brand?: number;  // 品牌
  supplierId?: number;  // 供应商id
  fromPurchaseDate?: string; // 购入日期起始时间
  toPurchaseDate?: string; // 购入日期结束时间
}

/**
 * 设备信息
 */
export interface EquipmentInfo extends BaseModel {
  id?: number;  // 设备id
  orgId?: number; // 组织id
  equipmentCode?: string; // 设备编号
  equipmentType?: number; // 设备类型（字典项)
  equipmentTypeName?: string; // 设备类型名称
  equipmentSubType?: number;  // 设备子类型（字典项)
  equipmentSubTypeKey?: EquipmentSubTypeKey;  // 设备子类型（字典项key）
  equipmentSubTypeName?: string;  // 设备子类型名称
  brand?: number; // 设备品牌（字典项)
  brandName?: string; // 品牌名称
  equipmentMode?: string; // 设备型号
  serviceNumber?: string; // 服务编号
  purchaseDate?: string; // 购入日期
  expiration?: string;  // 质保截止日期
  supplierId?: number;  // 供应商
  supplierName?: string;  // 供应商名称
}