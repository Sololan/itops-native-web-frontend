/**
 * 供应商查询条件参数
 */
export interface SuppierQueryParam {
    supplierName?: string  // 供应商名称
    contacts?: string  // 联系人
    fromCreateTime?: string  // 起始时间
    toCreateTime?: string  // 截止时间
}

