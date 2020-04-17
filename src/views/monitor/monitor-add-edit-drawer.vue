<template>
  <yj-drawer v-model="visible" :title="!isEdit ? '添加监控' : '配置监控'" size="large"
             @open="handleDrawerOpen" @close="handleDrawerClose">
    <div class="yj-content-area">
      <yj-info-panel title="监控信息" :border-none="true">
        <el-form label-width="110px" :model="monitorInfoForm" ref="monitorInfoForm">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="监控名称" prop="monitorName" :rules="{required: true, message: '请输入监控名称', trigger: 'blur'}">
                <el-input v-model="monitorInfoForm.monitorName" placeholder="请输入" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备用途" prop="businessSystem" :rules="{required: true, message: '请选择设备用途', trigger: 'change'}">
                <el-select v-model="monitorInfoForm.businessSystem" placeholder="请选择">
                  <el-option v-for="item in monitorUseList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否启用">
                <el-switch v-model="monitorInfoForm.isValid" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </yj-info-panel>
      <yj-info-panel title="设备信息">
        <template #operate>
          <el-button type="primary" @click="equipmentDialogVisible = true">选择设备</el-button>
        </template>

        <el-form label-width="110px" class="yj-detail-form">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="设备编号">{{equipmentInfo.equipmentCode}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型">{{equipmentInfo.equipmentTypeName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备子类型">{{equipmentInfo.equipmentSubTypeName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="设备品牌">{{equipmentInfo.brandName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备型号">{{equipmentInfo.equipmentMode}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务编号">{{equipmentInfo.serviceNumber}}</el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="购入日期">{{equipmentInfo.purchaseDate|timeFormat('yyyy-MM-dd')}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质保截止日期">{{equipmentInfo.expiration|timeFormat('yyyy-MM-dd')}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商">{{equipmentInfo.supplierName}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </yj-info-panel>

      <el-form label-width="110px" :model="monitorConfigForm" ref="monitorConfigForm">
        <yj-info-panel v-for="(control, index) in monitorConfigForm.controls" :title="control.monitorTypeName">
          <template #operate v-if="control.showAddButton">
            <el-button type="primary" @click="handleAddSubControl(index)">添加</el-button>
          </template>

          <div v-for="(subControl, subIndex) in control.subControls">
            <el-row type="flex" class="monitor-sub-type-header">
              <div class="monitor-sub-type-checkbox">
                <el-checkbox v-model="subControl.checked" :disabled="subControl.checkboxDisabled" />
              </div>
              <el-col :span="8" v-show="subControl.monitorSubTypeList.length > 1">
                <el-form-item label="类型">
                  <el-select v-model="subControl.monitorSubTypeId" placeholder="请选择" @change="handleMonitorSubTypeChange(index, subIndex)">
                    <el-option v-for="item in subControl.monitorSubTypeList" :key="item.id" :label="item.subName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="监控方式">
                  <el-select v-model="subControl.monitorMethodId" placeholder="请选择" @change="handleMonitorMethodChange(index, subIndex)">
                    <el-option v-for="item in subControl.monitorMethodList" :key="item.id" :label="item.methodName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="yj-wrap-row monitor-sub-type-body">
              <el-col :span="8" v-for="(fieldControl, fieldIndex) in subControl.fieldControls" :key="fieldControl.id">
                <el-form-item
                    :label="fieldControl.paramName"
                    :prop="['controls', index, 'subControls', subIndex, 'fieldControls', fieldIndex, 'paramValue'].join('.')"
                    :rules="{required: fieldControl.isRequire && subControl.checked, message: '请输入' + fieldControl.paramName, trigger: 'blur'}">
                  <el-input v-model="fieldControl.paramValue" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </yj-info-panel>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="info" @click="visible = false">取消</el-button>
    </template>

    <monitor-equipment-dialog v-model="equipmentDialogVisible" :equipment-id="equipmentInfo.id" @chose="handleEquipmentChose($event)" />
  </yj-drawer>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import YjInfoPanel from '@/components/bs/yj-info-panel.vue'
  import {ElForm} from 'element-ui/types/form'
  import {DictInfo} from '@/providers/models/uc/dicts-model'
  import DictService from '@/providers/services/uc/dicts-service'
  import {DictGroupKey, EquipmentSubTypeKey, MonitorTypeCode} from '@/providers/models/enums'
  import {MonitorDetailParam, MonitorDetailType, MonitorFullInfo, MonitorMethodInfo, MonitorMethodParamInfo, MonitorSubTypeInfo, MonitorTypeInfo} from '@/providers/models/bs/monitors-model'
  import {EquipmentInfo} from '@/providers/models/bs/equipment-model'
  import MonitorEquipmentDialog from '@/views/monitor/monitor-equipment-dialog.vue'
  import MonitorsService from '@/providers/services/bs/monitors-service'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import NoticeUtil from '@/providers/utils/notice-util'
  import EquipmentService from '@/providers/services/bs/equipment-service'

  interface MonitorConfigForm {
    controls: MonitorControl[]
  }

  interface MonitorControl extends MonitorTypeInfo {
    defaultMonitorSubTypeId: number
    defaultMonitorSubTypeList: MonitorSubTypeInfo[]
    defaultMonitorMethodId: number
    defaultMonitorMethodList: MonitorMethodInfo[]
    defaultMonitorMethodParam: MonitorMethodParamInfo[]
    subControls: MonitorSubControl[]
    showAddButton: boolean
  }

  interface MonitorSubControl {
    checkboxDisabled: boolean
    checked: boolean
    monitorSubTypeId: number
    monitorSubTypeList: MonitorSubTypeInfo[]
    monitorMethodId: number
    monitorMethodList: MonitorMethodInfo[]
    fieldControls: FieldControl[]
    // 扩展，用于数据回填
    dataId: number
    monitorParam?: MonitorDetailParam[]
  }

  interface FieldControl extends MonitorMethodParamInfo {
    dataId: number
    paramValue: string
  }

  @Component({components: {YjDrawer, YjInfoPanel, MonitorEquipmentDialog}})
  export default class MonitorAddEditDrawer extends Vue {
    @Prop() monitorId!: number
    @Prop() value: boolean
    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}
    get isEdit() {return !!this.monitorId}

    private getFieldControls = (paramList: MonitorMethodParamInfo[], defaultDataList?: MonitorDetailParam[]): FieldControl[] => {
      const hasDefault = !!defaultDataList
      const defaultData: { [key: string]: MonitorDetailParam } = {}
      if (hasDefault) {
        defaultDataList.forEach((itemInfo) => defaultData[itemInfo.paramId] = itemInfo)
      }
      return paramList.map((paramInfo) => ({
        ...paramInfo,
        dataId: hasDefault ? defaultData[paramInfo.id].id : null,
        paramValue: hasDefault ? defaultData[paramInfo.id].paramValue : (paramInfo.defaultValue || '')
      }))
    }
    private getCheckboxDisabled = (equipmentInfo: EquipmentInfo, topControl: MonitorControl): boolean => {
      // 设备子类型为服务器 且 监控类型为操作系统监控 必填
      // return equipmentInfo.equipmentSubTypeKey === EquipmentSubTypeKey.Server && topControl.monitorTypeCode === MonitorTypeCode.Os
      return false;
    }

    monitorUseList: DictInfo[] = []
    equipmentDialogVisible = false
    equipmentInfo: EquipmentInfo = {}
    monitorInfoForm = {monitorName: '', businessSystem: null as number, isValid: 0}
    monitorConfigForm: MonitorConfigForm = {controls: []}
    monitorDetailTypeMap: { [key: string]: MonitorDetailType[] } = {}

    handleEquipmentChose(equipmentInfo: EquipmentInfo): void {
      this.equipmentInfo = equipmentInfo
      this.getMonitorConfigForm(false)
    }

    handleMonitorSubTypeChange(topControlIndex: number, subControlIndex: number): void {
      const topControl: MonitorControl = this.monitorConfigForm.controls[topControlIndex]
      const subControl: MonitorSubControl = topControl.subControls[subControlIndex]
      MonitorsService.getMonitorMethodList(subControl.monitorSubTypeId)
      .then((monitorMethodList) => {
        subControl.monitorMethodList = monitorMethodList
        subControl.monitorMethodId = monitorMethodList.length ? monitorMethodList[0].id : null
      }).catch(() => {
        subControl.monitorMethodList = []
        subControl.monitorMethodId = null
      }).then(() => this.handleMonitorMethodChange(topControlIndex, subControlIndex))
    }

    handleMonitorMethodChange(topControlIndex: number, subControlIndex: number): void {
      const topControl: MonitorControl = this.monitorConfigForm.controls[topControlIndex]
      const subControl: MonitorSubControl = topControl.subControls[subControlIndex]
      MonitorsService.getMonitorMethodParamList(subControl.monitorMethodId)
      .then((monitorMethodParamList) => subControl.fieldControls = this.getFieldControls(monitorMethodParamList))
      .catch(() => subControl.fieldControls = [])
    }

    handleSave(): void {
      this.handleCheckValid().then(() => {
        const monitorFullInfo = this.getMonitorFullInfo()
        const handler = this.isEdit
            ? MonitorsService.updateMonitorFullInfo(monitorFullInfo)
            : MonitorsService.saveMonitorFullInfo(monitorFullInfo)

        handler.then(() => {
          NoticeUtil.showMsg('保存成功')
          this.visible = false
          this.$emit('success')
        }).catch(CATCH_ERROR)
      })
    }

    handleDrawerOpen(): void {
      this.clearValidate('monitorInfoForm')
      this.getMonitorUseList()
      if (!this.isEdit) {
        return
      }
      // 编辑时回填数据
      this.handleBackfill()
    }

    handleDrawerClose(): void {
      this.equipmentDialogVisible = false
      this.equipmentInfo = {}
      this.clearValidate('monitorInfoForm')
      this.monitorInfoForm = {monitorName: '', businessSystem: null as number, isValid: 0}
      this.clearValidate('monitorConfigForm')
      this.monitorConfigForm = {controls: []}
      this.monitorDetailTypeMap = {}
    }

    private clearValidate(formName: string) {
      const form: ElForm = this.$refs[formName] as ElForm
      form ? form.clearValidate() : null
    }

    private handleCheckValid(): Promise<void> {
      return new Promise((resolve) => {
        // 校验监控信息
        (this.$refs['monitorInfoForm'] as ElForm).validate((valid1) => {
          if (!valid1) {
            return
          }
          // 校验设备信息
          if (!this.equipmentInfo.id) {
            NoticeUtil.showAlert('请选择设备').catch(CATCH_ERROR)
            return
          }
          // 校验设备监控配置
          (this.$refs['monitorConfigForm'] as ElForm).validate((valid2) => {
            valid2 ? resolve() : null
          })
        })
      })
    }

    private getMonitorFullInfo(): MonitorFullInfo {
      const {monitorName, businessSystem, isValid} = this.monitorInfoForm
      const {id: equipmentId, equipmentMode, brand, brandName} = this.equipmentInfo
      const id = this.isEdit ? this.monitorId : null
      const monitorDetailType: MonitorDetailType[] = []
      this.monitorConfigForm.controls.forEach((topControl) => {
        const {id: monitorTypeId, monitorTypeName, monitorTypeCode} = topControl
        topControl.subControls.forEach((subControl) => {
          const {dataId: id, checked, monitorSubTypeId: monitorTypeSubId, monitorMethodId: monitorSubMethodId, fieldControls} = subControl
          if (!checked) {
            return
          }
          const monitorParam: MonitorDetailParam[] = fieldControls
          .map(({dataId: id, id: paramId, paramCode, paramValue}) => ({id, paramId, paramCode, paramValue}))
          monitorDetailType.push({id, monitorTypeId, monitorTypeName, monitorTypeCode, monitorTypeSubId, monitorSubMethodId, monitorParam})
        })
      })
      return {id, monitorName, isValid, equipmentId, equipmentMode, brand, brandName, businessSystem, monitorDetailType}
    }

    private getMonitorUseList(): void {
      DictService.getDictList(DictGroupKey.EquipmentUse).then(
          (dictList) => this.monitorUseList = dictList,
          () => this.monitorUseList = []
      )
    }

    private getMonitorConfigForm(backfill: boolean): void {
      const equipmentSubTypeId = this.equipmentInfo.equipmentSubType
      if (!equipmentSubTypeId) {
        return
      }
      this.monitorConfigForm.controls = []
      MonitorsService.getMonitorTypeList(equipmentSubTypeId).then((monitorTypeList) => {
        // 页面先渲染
        this.monitorConfigForm.controls = monitorTypeList.map((monitorTypeInfo) => ({
          ...monitorTypeInfo, defaultMonitorSubTypeId: null, defaultMonitorSubTypeList: [],
          defaultMonitorMethodId: null, defaultMonitorMethodList: null,
          defaultMonitorMethodParam: [], subControls: [],
          showAddButton: false
        }))
        // 再异步加载每块
        this.monitorConfigForm.controls.forEach((controls, index) => {
          MonitorsService.getMonitorSubTypeList(equipmentSubTypeId, controls.id)
          // 获取监控类型对应的监控子类型
          .then((monitorSubTypeList) => {
            controls.defaultMonitorSubTypeList = monitorSubTypeList
            const monitorSubTypeId = monitorSubTypeList.length ? monitorSubTypeList[0].id : null
            controls.defaultMonitorSubTypeId = monitorSubTypeId
            return MonitorsService.getMonitorMethodList(monitorSubTypeId)
          })
          // 获取监控子类型对应的监控方式
          .then((monitorMethodList) => {
            controls.defaultMonitorMethodList = monitorMethodList
            const monitorMethodId = monitorMethodList.length ? monitorMethodList[0].id : null
            controls.defaultMonitorMethodId = monitorMethodId
            return MonitorsService.getMonitorMethodParamList(monitorMethodId)
          })
          // 获取监控方式下的参数
          .then((monitorMethodParamList) => {
            controls.defaultMonitorMethodParam = monitorMethodParamList
            backfill ? this.handleSubControlsBackfill(index) : this.handleAddSubControl(index)

            // 添加按钮在请求后判断显示，避免过早显示误操作
            controls.showAddButton = [MonitorTypeCode.Database, MonitorTypeCode.Middleware]
            .indexOf(controls.monitorTypeCode) > -1
          }).catch(CATCH_ERROR)
        })
      }).catch(CATCH_ERROR)
    }

    private handleAddSubControl(topControlIndex: number): void {
      const topControl: MonitorControl = this.monitorConfigForm.controls[topControlIndex]
      const checkboxDisabled = this.getCheckboxDisabled(this.equipmentInfo, topControl)
      topControl.subControls.push({
        dataId: null,
        checkboxDisabled,
        checked: checkboxDisabled,
        monitorSubTypeId: topControl.defaultMonitorSubTypeId,
        monitorSubTypeList: [...topControl.defaultMonitorSubTypeList],
        monitorMethodId: topControl.defaultMonitorMethodId,
        monitorMethodList: [...topControl.defaultMonitorMethodList],
        fieldControls: this.getFieldControls(topControl.defaultMonitorMethodParam)
      })
    }

    private handleBackfill(): void {
      MonitorsService.getMonitorFullInfo(this.monitorId)
      .then((monitorFullInfo) => {
        const {monitorName, businessSystem, isValid, equipmentId, monitorDetailType} = monitorFullInfo
        this.monitorInfoForm = {monitorName, businessSystem, isValid}
        monitorDetailType.forEach((detail) => {
          if (!this.monitorDetailTypeMap[detail.monitorTypeId]) {
            this.monitorDetailTypeMap[detail.monitorTypeId] = []
          }
          this.monitorDetailTypeMap[detail.monitorTypeId].push(detail)
        })
        return EquipmentService.getEquipment(equipmentId)
      })
      .then((equipmentInfo) => this.equipmentInfo = equipmentInfo)
      .then(() => this.getMonitorConfigForm(true))
    }

    private handleSubControlsBackfill(topControlIndex: number): void {
      const topControl: MonitorControl = this.monitorConfigForm.controls[topControlIndex]
      const checkboxDisabled = this.getCheckboxDisabled(this.equipmentInfo, topControl)
      const monitorDetailTypeList: MonitorDetailType[] = this.monitorDetailTypeMap[topControl.id]
      const equipmentSubTypeId = this.equipmentInfo.equipmentSubType
      // 如果此项没有数据，加载一项空的
      if (!monitorDetailTypeList || !monitorDetailTypeList.length) {
        this.handleAddSubControl(topControlIndex)
        return
      }
      // 页面先渲染
      topControl.subControls = monitorDetailTypeList.map((monitorDetail) => ({
        dataId: monitorDetail.id,
        checkboxDisabled,
        checked: true,
        monitorSubTypeId: monitorDetail.monitorTypeSubId,
        monitorSubTypeList: [],
        monitorMethodId: monitorDetail.monitorSubMethodId,
        monitorMethodList: [],
        fieldControls: [],
        monitorParam: monitorDetail.monitorParam
      }))
      // 再异步加载下拉框待选项
      topControl.subControls.forEach((subControl) => {
        // 查询监控子类型
        MonitorsService.getMonitorSubTypeList(equipmentSubTypeId, topControl.id)
        .then((monitorSubTypeList) => subControl.monitorSubTypeList = monitorSubTypeList)
        .catch(CATCH_ERROR)
        // 查询监控方式
        MonitorsService.getMonitorMethodList(subControl.monitorSubTypeId)
        .then((monitorMethodList) => subControl.monitorMethodList = monitorMethodList)
        .catch(CATCH_ERROR)
        // 查询监控方式下的参数信息
        MonitorsService.getMonitorMethodParamList(subControl.monitorMethodId)
        .then((paramList) => subControl.fieldControls = this.getFieldControls(paramList, subControl.monitorParam))
      })
    }
  }
</script>

<style scoped lang="scss">
  .monitor-sub-type-header {
    position: relative;
    height: 55px;
    align-items: center;
    background-color: #EAF4FE;

    .monitor-sub-type-checkbox {
      position: absolute;
      left: 10px;

      /deep/ .el-checkbox__inner {
        width: 20px;
        height: 20px;

        &::after {
          border-width: 2px;
          left: 6px;
          width: 4px;
          height: 10px;
        }
      }
    }

    .el-form-item {
      margin: 0;
    }
  }

  .monitor-sub-type-body {
    margin-top: 15px;
    min-height: 62px;
  }
</style>
