<template>
  <yj-dialog v-model="visible" :title="isEdit ? '修改' : '添加'" :append-to-body="true"
             @open="handleDialogOpen" @close="handleDialogClose">
    <yj-info-panel title="监控项信息" :border-none="true">
      <el-form label-width="130px" :model="monitorItemForm" ref="monitorItemFormRef">
        <el-row type="flex" class="yj-wrap-row">
          <el-col :span="12">
            <el-form-item label="监控项名称" prop="monitorItemName" :rules="{required: true, message: '请输入监控项名称', trigger: 'blur'}">
              <el-input style="width: 190px" v-model="monitorItemForm.monitorItemName" placeholder="请输入" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监控项显示类型" prop="monitorChartType" :rules="{required: true, message: '请选择监控项显示类型', trigger: 'change'}">
              <el-select style="width: 190px" v-model="monitorItemForm.monitorChartType" placeholder="请选择" @change="handleMonitorChartTypeChange">
                <el-option v-for="item in monitorChartTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="monitorItemForm.monitorChartType === 4">
            <el-form-item label="正常值" prop="okValue" :rules="{required: true, message: '请输入正常值', trigger: 'blur'}">
              <el-input style="width: 190px" v-model="monitorItemForm.okValue" placeholder="请输入" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </yj-info-panel>
    <yj-info-panel title="显示模块">
      <template #operate>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </template>

      <el-form label-width="130px" :model="dataSourceForm" ref="dataSourceFormRef">
        <el-row type="flex" class="yj-wrap-row" v-for="(control, index) in dataSourceForm.controls" :key="control.pk">
          <el-col :span="12">
            <el-form-item label="名称" :prop="['controls', index, 'dataItemName'].join('.')"
                          :rules="{required: true, message: '请输入名称', trigger: 'blur'}">
              <el-input style="width: 190px" v-model="control.dataItemName" placeholder="请输入" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据源" :prop="['controls', index, 'dataSourceKey'].join('.')"
                          :rules="{required: true, message: '请选择数据源', trigger: 'change'}">
              <el-select style="width: 190px" class="m-r-15" v-model="control.dataSourceKey" placeholder="请选择">
                <el-option v-for="item in dataSourceList" :key="item.itemId" :label="item.itemName" :value="item.itemId" />
              </el-select>
              <el-button type="primary" icon="el-icon-delete" @click="handleDelete(control.pk)"
                         v-if="dataSourceForm.controls.length > 1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </yj-info-panel>
    <yj-info-panel v-if="monitorItemForm.monitorChartType === 4" title="监控项显示图标">
      <el-form label-width="130px">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="正常/异常">
              <div class="icon-click" @click="showIconList = !showIconList">
                <div class="icon-add" v-if="!checkedIcon">
                  <div class="icon-icon"></div>
                </div>
                <div class="icon-group" v-else>
                  <yj-switch-icon :name="getIconName(checkedIcon, true)" />
                  <yj-switch-icon :name="getIconName(checkedIcon, false)" />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <transition name="el-zoom-in-top">
          <div v-show="showIconList" class="icon-list">
            <div class="icon-item" v-for="libraryIcon in libraryIconList" :key="libraryIcon"
                 :class="{'icon-checked': libraryIcon === checkedIcon}"
                 @click="handleIconChecked(libraryIcon)">
              <div class="icon-item-inner">
                <div class="icon-group">
                  <yj-switch-icon :name="getIconName(libraryIcon, true)" />
                  <yj-switch-icon :name="getIconName(libraryIcon, false)" />
                </div>
              </div>
              <div class="checked-icon"><i class="el-icon-success" /></div>
            </div>
          </div>
        </transition>
      </el-form>
    </yj-info-panel>
    <yj-info-panel title="预览">
      <monitor-detail-chart v-if="visible" style="margin: 0 auto;" :preview="true" ref="previewChartRef"
                            :config="{chartType: monitorItemForm.monitorChartType}" />
    </yj-info-panel>
    <template #footer>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="info" @click="visible = false">取消</el-button>
    </template>
  </yj-dialog>
</template>

<script lang="ts">
  import {Component, Prop, PropSync, Ref, Vue} from 'vue-property-decorator'
  import YjDialog from '@/components/common/yj-dialog.vue'
  import {MonitorChartType, MonitorTypeCode} from '@/providers/models/enums'
  import YjInfoPanel from '@/components/bs/yj-info-panel.vue'
  import {MonitorChartConfigInfo, MonitorDataSourceConfigInfo, MonitorDataSourceInfo} from '@/providers/models/bs/monitors-model'
  import YjSwitchIcon from '@/components/bs/yj-switch-icon.vue'
  import MonitorDetailChart from '@/views/monitor/monitor-detail-chart.vue'
  import {ElForm} from 'element-ui/types/form'
  import CommonUtil from '@/providers/utils/common-util'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import MonitorsService from '@/providers/services/bs/monitors-service'

  interface DataSourceForm {
    controls: DataSourceControl[]
  }

  interface DataSourceControl {
    pk: number  // 唯一主键
    dataId: number // 数据ID
    dataItemName: string // 数据项名称
    dataSourceKey: string // 数据源的key
  }

  @Component({components: {YjDialog, YjInfoPanel, YjSwitchIcon, MonitorDetailChart}})
  export default class MonitorDetailChartDialog extends Vue {
    @Prop() configId!: number
    @Prop() monitorId!: number
    @Prop() monitorTypeId!: number
    @Prop() monitorTypeCode!: MonitorTypeCode
    @Prop() value: boolean
    @PropSync('dataSource') dataSourceList: MonitorDataSourceInfo[]
    @Ref() readonly monitorItemFormRef: ElForm
    @Ref() readonly dataSourceFormRef: ElForm
    @Ref() readonly previewChartRef: { handleRefreshRender: Function }
    get isEdit() {return !!this.configId}
    get orgId() {return this.$store.getters.orgId}
    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}

    getIconName = (iconGroup: string, isOk: boolean): string => {
      const iconArr = iconGroup.split(',')
      return isOk ? iconArr[0] : iconArr[1]
    }
    private getDataSourceControl = (configInfo?: MonitorDataSourceConfigInfo): DataSourceControl => ({
      pk: ++this.pk,
      dataId: configInfo ? configInfo.id : null,
      dataItemName: configInfo ? configInfo.dataItemName : '',
      dataSourceKey: configInfo ? configInfo.dataSourceKey : null
    })

    readonly monitorChartTypeList = [
      {label: '折线图', value: 1},
      {label: '柱状图', value: 2},
      {label: '饼图', value: 3},
      {label: '开关图表', value: 4},
      {label: '文本显示', value: 5}
    ]
    readonly libraryIconList = [
      ['lib-power-ok', 'lib-power-no'].join(','),
      ['lib-cpu-ok', 'lib-cpu-no'].join(','),
      ['lib-fan-ok', 'lib-fan-no'].join(','),
      ['lib-harddisk-ok', 'lib-harddisk-no'].join(','),
      ['lib-memory-ok', 'lib-memory-no'].join(','),
      ['lib-network-ok', 'lib-network-no'].join(','),
      ['lib-raid-ok', 'lib-raid-no'].join(','),
    ]

    pk = 0
    monitorItemForm = {monitorItemName: '', monitorChartType: 1, okValue: ''}
    dataSourceForm: DataSourceForm = {controls: []}
    checkedIcon = ''
    showIconList = false

    handleMonitorChartTypeChange(): void {
      this.checkedIcon = ''
      this.showIconList = false
      this.$nextTick().then(() => this.previewChartRef.handleRefreshRender())
    }

    handleAdd(): void {
      this.dataSourceForm.controls.push(this.getDataSourceControl())
    }

    handleIconChecked(checkedIcon: string): void {
      this.checkedIcon = checkedIcon
      this.showIconList = false
    }

    handleDelete(pk: number): void {
      this.dataSourceForm.controls = this.dataSourceForm.controls.filter((item) => item.pk !== pk)
    }

    handleSave(): void {
      this.handleCheckValid().then(() => {
        const monitorChartConfigInfo = this.getMonitorChartConfigInfo()
        const handler = this.isEdit
            ? MonitorsService.updateMonitorChartConfigInfo(monitorChartConfigInfo)
            : MonitorsService.saveMonitorChartConfigInfo(monitorChartConfigInfo)
        handler.then(() => {
          NoticeUtil.showMsg('保存成功')
          this.visible = false
          this.$emit('success')
        }).catch(CATCH_ERROR)
      })
    }

    handleDialogOpen(): void {
      // 新增
      if (!this.isEdit) {
        this.handleAdd()
        return
      }
      // 编辑时回填数据
      this.handleBackfill()
    }

    handleDialogClose(): void {
      this.pk = 0
      this.monitorItemFormRef.clearValidate()
      this.monitorItemForm = {monitorItemName: '', monitorChartType: 1, okValue: ''}
      this.dataSourceFormRef.clearValidate()
      this.dataSourceForm = {controls: []}
      this.checkedIcon = ''
      this.showIconList = false
    }

    private handleCheckValid(): Promise<void> {
      return new Promise((resolve) => {
        CommonUtil.formValidate(this.monitorItemFormRef)
        .then(() => CommonUtil.formValidate(this.dataSourceFormRef))
        .then(() => {
          if (this.monitorItemForm.monitorChartType === MonitorChartType.Switch && !this.checkedIcon) {
            NoticeUtil.showAlert('请选择监控项显示图标').catch(CATCH_ERROR)
            return
          }
          resolve()
        })
      })
    }

    private getMonitorChartConfigInfo(): MonitorChartConfigInfo {
      const id = this.isEdit ? this.configId : null
      const monitorId = this.monitorId
      const monitorTypeId = this.monitorTypeId
      const orgId = this.orgId
      const {monitorItemName, monitorChartType: chartType, okValue} = this.monitorItemForm
      const [icon1, icon2] = this.checkedIcon ? this.checkedIcon.split(',') : ['', '']
      const monitorShowDataList = this.dataSourceForm.controls.map((control) => ({
        id: control.dataId, monitorId, monitorShowSettingId: id, dataItemName: control.dataItemName, dataSourceKey: control.dataSourceKey
      }))
      return {id, monitorId, monitorTypeId, orgId, monitorItemName, chartType, okValue, icon1, icon2, monitorShowDataList}
    }

    private handleBackfill(): void {
      MonitorsService.getMonitorChartConfigInfo(this.configId)
      .then((monitorChartConfigInfo) => {
        const {monitorItemName, chartType: monitorChartType, okValue, monitorShowDataList, icon1, icon2} = monitorChartConfigInfo
        this.monitorItemForm = {monitorItemName, monitorChartType, okValue}
        this.handleMonitorChartTypeChange()
        this.dataSourceForm.controls = monitorShowDataList.map((item) => this.getDataSourceControl(item))
        if (monitorChartType === MonitorChartType.Switch) {
          this.checkedIcon = [icon1, icon2].join(',')
        }
      })
    }
  }
</script>

<style scoped lang="scss">

  .icon-click {
    cursor: pointer;

    .icon-add {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 119px;
      height: 60px;
      border: 1px solid #999;
      box-sizing: border-box;

      .icon-icon {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #999;

        &::before {
          content: '';
          position: absolute;
          top: 19px;
          left: 7px;
          width: 26px;
          height: 2px;
          background-color: #FFF;
        }

        &::after {
          content: '';
          position: absolute;
          top: 7px;
          left: 19px;
          width: 2px;
          height: 26px;
          background-color: #FFF;
        }
      }
    }
  }

  .icon-list {
    display: flex;
    flex-wrap: wrap;
    margin: -14px 0 22px;
    border: 1px solid #999;

    .icon-item {
      flex: none;
      margin: 6px;
      cursor: pointer;
      position: relative;

      .checked-icon {
        display: none;
      }

      &:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(51, 51, 51, .2);
      }

      &.icon-checked {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1px solid #49D049;
          background-color: rgba(51, 51, 51, .2);
        }

        .checked-icon {
          display: block;
          position: absolute;
          right: 2px;
          bottom: 2px;
          border-radius: 50%;
          line-height: 1;
          color: #49D049;
          font-size: 24px;

          & > * {
            position: relative;
            z-index: 1;
          }

          &::before {
            content: '';
            position: absolute;
            z-index: 0;
            width: 16px;
            height: 16px;
            top: 50%;
            left: 50%;
            margin: -8px 0 0 -8px;
            background-color: #FFF;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .icon-group {
    display: flex;

    .yj-switch-icon + .yj-switch-icon {
      margin-left: -1px;
    }
  }
</style>
