import HttpUtil from '@/providers/utils/http-util'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {EquipmentInfo, EquipmentPageQuery} from '@/providers/models/bs/equipment-model'

/**
 * 分页条件查询设备
 * @param pageQuery
 */
function getEquipmentPageList(pageQuery: PageQuery<EquipmentPageQuery>): Promise<PageResult<EquipmentInfo[]>> {
  return HttpUtil.post({api: 'equipments/page', body: pageQuery})
}

/**
 * 根据id删除设备
 * @param id
 */
function deleteEquipment(id: string): Promise<string> {
  return HttpUtil.post({api: `equipments/${id}/delete`})
}

/**
 * 添加设备
 * @param equipmentInfo
 */
function addEquipment(equipmentInfo: EquipmentInfo): Promise<string> {
  return HttpUtil.post({api: 'equipments', body: equipmentInfo})
}

/**
 * 修改设备
 * @param equipmentInfo
 */
function editEquipment(equipmentInfo: EquipmentInfo): Promise<string> {
  return HttpUtil.post({api: `equipments/${equipmentInfo.id}`, body: equipmentInfo})
}

/**
 * 根据id查询设备(未删除)
 * @param equipmentId
 */
function getEquipment(equipmentId: number): Promise<EquipmentInfo> {
  return HttpUtil.get({api: `equipments/${equipmentId}`})
}

const EquipmentService = {
  getEquipmentPageList,
  deleteEquipment,
  addEquipment,
  editEquipment,
  getEquipment
}
export default EquipmentService