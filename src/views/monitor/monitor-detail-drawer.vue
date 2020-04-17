<template>
  <yj-drawer v-model="visible" title="监控详细" size="xLarge"
             @open="handleDrawerOpen" @close="handleDrawerClose">
    <div class="yj-content-area">
      <yj-info-panel title="监控信息" :border-none="true">
        <el-form label-width="110px" class="yj-detail-form">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="监控名称">{{monitorDetailInfo.monitorName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备用途">{{monitorDetailInfo.businessSystemName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否启用">{{monitorDetailInfo.isValid ? '启用' : '禁用'}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </yj-info-panel>
      <yj-info-panel title="设备信息">
        <template #operate>
          <el-button :icon="showEquipment ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
                     size="small" circle @click="showEquipment=!showEquipment"></el-button>
        </template>
        <el-form v-show="showEquipment" label-width="110px" class="yj-detail-form">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="设备编号">{{monitorDetailInfo.equipmentCode}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型">{{monitorDetailInfo.equipmentTypeName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备子类型">{{monitorDetailInfo.equipmentSubTypeName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="设备品牌">{{monitorDetailInfo.brandName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备型号">{{monitorDetailInfo.equipmentMode}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务编号">{{monitorDetailInfo.serviceNumber}}</el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="购入日期">{{monitorDetailInfo.purchaseDate|timeFormat('yyyy-MM-dd')}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质保截止日期">{{monitorDetailInfo.expiration|timeFormat('yyyy-MM-dd')}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商">{{monitorDetailInfo.supplierName}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </yj-info-panel>
      <yj-info-panel>
        <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
          <el-tab-pane v-for="item in monitorTypeList" :key="item.id" :label="item.monitorTypeName" :name="String(item.id)">
            <div class="chart-list" v-if="activeTabName === String(item.id)">
              <div class="chart-item" v-for="configItem in monitorChartConfigList">
                <monitor-detail-chart :config="configItem" @delete="handleChartConfigDelete(configItem.id)"
                                      @edit="handleChartDialogOpen(configItem.id, item.id, item.monitorTypeCode)" />
              </div>
              <div class="chart-item">
                <div class="chart-add" @click="handleChartDialogOpen(null, item.id, item.monitorTypeCode)">
                  <div class="chart-icon"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </yj-info-panel>
    </div>
    <template #footer>
      <el-button type="info" @click="visible = false">关闭</el-button>
    </template>

    <monitor-detail-chart-dialog v-model="chartDialogVisible" :config-id="configId" :monitor-id="monitorId"
                                 :monitor-type-id="monitorTypeId" :monitor-type-code="monitorTypeCode"
                                 :data-source="dataSourceList" @success="handleTabClick" />
  </yj-drawer>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import YjInfoPanel from '@/components/bs/yj-info-panel.vue'
  import {MonitorChartConfigInfo, MonitorDataSourceInfo, MonitorDetailInfo, MonitorTypeInfo} from '@/providers/models/bs/monitors-model'
  import MonitorsService from '@/providers/services/bs/monitors-service'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import MonitorDetailChart from '@/views/monitor/monitor-detail-chart.vue'
  import MonitorDetailChartDialog from '@/views/monitor/monitor-detail-chart-dialog.vue'
  import {MonitorTypeCode} from '@/providers/models/enums'
  import NoticeUtil from '@/providers/utils/notice-util'

  @Component({components: {YjDrawer, YjInfoPanel, MonitorDetailChart, MonitorDetailChartDialog}})
  export default class MonitorDetailDrawer extends Vue {
    @Prop() monitorId!: number
    @Prop() value: boolean
    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}

    monitorDetailInfo: MonitorDetailInfo = {} as MonitorDetailInfo
    showEquipment = false
    activeTabName: string = ''
    monitorTypeList: MonitorTypeInfo[] = []
    monitorChartConfigList: MonitorChartConfigInfo[] = []
    chartDialogVisible = false
    configId: number = null
    monitorTypeId: number = null
    monitorTypeCode: MonitorTypeCode = null
    dataSourceList: MonitorDataSourceInfo[] = []

    handleTabClick(): void {
      this.monitorChartConfigList = []
      MonitorsService.getMonitorChartConfigList(this.monitorId, Number(this.activeTabName))
      .then((monitorChartConfigList) => this.monitorChartConfigList = monitorChartConfigList)
      .catch(() => this.monitorChartConfigList = [])
    }

    handleChartConfigDelete(configId: number): void {
      NoticeUtil.showConfirm('您确定要删除吗？')
      .then(() => MonitorsService.deleteMonitorChartConfig(configId))
      .then(() => this.handleTabClick())
      .then(() => NoticeUtil.showMsg('操作成功'))
      .catch(CATCH_ERROR)
    }

    handleChartDialogOpen(configId: number, monitorTypeId: number, monitorTypeCode: MonitorTypeCode): void {
      this.configId = configId
      this.monitorTypeId = monitorTypeId
      this.monitorTypeCode = monitorTypeCode
      this.chartDialogVisible = true
    }

    handleDrawerOpen(): void {
      this.getMonitorDetailInfo()
      this.getMonitorTypeListByMonitorId()
    }

    handleDrawerClose(): void {
      this.monitorDetailInfo = {} as MonitorDetailInfo
      this.showEquipment = false
      this.activeTabName = ''
      this.monitorTypeList = []
      this.monitorChartConfigList = []
      this.chartDialogVisible = false
      this.configId = null
      this.monitorTypeId = null
      this.monitorTypeCode = null
    }

    private getMonitorDetailInfo(): void {
      MonitorsService.getMonitorDetailInfo(this.monitorId)
      .then((monitorDetailInfo) => this.monitorDetailInfo = monitorDetailInfo)
      .then((monitorDetailInfo) => this.dataSourceList = monitorDetailInfo.itemList)
      .catch(CATCH_ERROR)
    }

    private getMonitorTypeListByMonitorId(): void {
      MonitorsService.getMonitorTypeListByMonitorId(this.monitorId)
      .then((monitorTypeList) => {
        this.monitorTypeList = monitorTypeList
        this.activeTabName = monitorTypeList.length ? String(monitorTypeList[0].id) : ''
        this.handleTabClick()
      }).catch(CATCH_ERROR)
    }
  }
</script>

<style scoped lang="scss">
  .chart-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .chart-item {
      flex: none;
      margin: 10px 0;

      .chart-add {
        width: 565px;
        height: 278px;
        border: 1px solid #999;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .chart-icon {
          position: relative;
          width: 70px;
          height: 70px;
          background-color: #CCC;
          border-radius: 50%;

          &::before {
            content: '';
            position: absolute;
            top: 33px;
            left: 15px;
            width: 40px;
            height: 4px;
            background-color: #FFF;
          }

          &::after {
            content: '';
            position: absolute;
            top: 15px;
            left: 33px;
            width: 4px;
            height: 40px;
            background-color: #FFF;
          }
        }
      }
    }
  }
</style>