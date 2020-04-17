import {YesOrNoStatus} from '@/providers/models/enums'

/**
 * 字典信息
 */
export interface DictInfo {
  id: number;  // ID
  pid: number;  // 父级字典项ID
  groupId: number;  // 所属字典组ID
  itemKey: string;  // 字典项key
  name: string; // 字典项名称
  value: string;  // 字典项值
  description: string;  // 描述
  sort: number; // 排序号
  isEdit: YesOrNoStatus;  // 是否可编辑（0: 否；1: 是）
  enabled: YesOrNoStatus;  // 是否启用 (0: 否；1：是)
}