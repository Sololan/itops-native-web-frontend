import {BaseModel} from '@/providers/models/base-model';

export interface WarningParam extends BaseModel {
    id?: number  // 告警id
    orgId?: number  // 根机构id
    warningCode?: string  // 告警编号
    warningLevel?: number  // 告警级别
    warningInfo?: string  // 告警内容
    ipAddress?: string  // IP地址
    warningTime?: string  // 告警时间
    warningStatus?: string // 告警状态
    closeTime?: string  // 关闭时间
    equipmentId?: number // 设备id
    monitorId?: number  // 监控id
    users?: string  // 通知用户列表
    warningLevelName?: string  // 告警级别名称
}

/**
 * 今日告警信息
 */
export interface TodayWarningModel {
    remindCount?: number // 今日提醒告警数量
    preCount?: number // 今日预告告警数量
    heavyCount?: number // 今日严重告警数量
    closedCount?: number // 今日关闭告警数量
    totalCount?: number // 今日警告总数量
}