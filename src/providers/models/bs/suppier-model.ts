import {BaseModel} from '@/providers/models/base-model';

/**
 * 供应商参数
 */

export interface SupplierParam extends BaseModel {
    id?: number   // 供应商id
    orgId?: number   // 组织id
    supplierName?: string   // 供应商名称
    contacts?: string   // 联系人
    contactTel?: string   // 联系电话
    email?: string   // 邮箱
    createTime?: string   //添加日期
}

