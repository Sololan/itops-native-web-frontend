<template>
  <div class="monitor-detail-chart" v-loading="showLoading">
    <div class="detail-header">
      <div class="detail-title">
        <span>{{preview ? '[监控项名称]' : configSync.monitorItemName}}</span>
      </div>
      <div class="detail-operate">
        <el-link type="primary" @click="handleEdit">修改</el-link>
        <el-link type="danger" @click="handleDelete">删除</el-link>
      </div>
      <div class="detail-refresh">
        <el-select style="width: 110px" size="small" v-model="refreshTime" v-if="[1, 2].indexOf(configSync.chartType) > -1">
          <el-option v-for="item in refreshTimeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button class="m-l-10" size="small" type="primary" @click="handleRefreshData">刷新</el-button>
      </div>
    </div>
    <div class="detail-body">
      <!--图表实例只需初始化一次，所以使用v-show，而不是v-if-->
      <yj-echarts class="detail-chart" v-show="[1, 2, 3].indexOf(configSync.chartType) > -1" ref="echartsRef" :disable-resize="true" />
      <div class="detail-scroll detail-switch-area" v-if="configSync.chartType === 4">
        <div class="detail-switch-item" v-for="switchData in switchDataList">
          <yj-switch-icon class="detail-switch-icon" :name="switchData.iconName" />
          <div class="detail-switch-text"><span>{{switchData.dataSourceName}}</span></div>
        </div>
      </div>
      <div class="detail-scroll detail-text-area" v-if="configSync.chartType === 5">
        <div class="detail-text-item" v-for="textData in textDataList">
          <div class="detail-text-label"><span>{{textData.name}}：</span></div>
          <div class="detail-text-value"><span>{{textData.lastvalue}}</span></div>
        </div>
      </div>
    </div>
    <div class="detail-footer">
      <span v-if="updateTime">更新时间：{{updateTime}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, PropSync, Ref, Vue} from 'vue-property-decorator'
  import YjEcharts from '@/components/common/yj-echarts.vue'
  import {MonitorChartConfigInfo} from '@/providers/models/bs/monitors-model'
  import {DateFormat, MonitorChartType} from '@/providers/models/enums'
  import echarts from 'echarts'
  import AdapterService from '@/providers/services/monitor-adapter/adapter-service'
  import {HistoryDataInfo, LatestDataInfo} from '@/providers/models/monitor-adapter/adapter-model'
  import CommonUtil from '@/providers/utils/common-util'
  import YjSwitchIcon from '@/components/bs/yj-switch-icon.vue'
  import ECharts = echarts.ECharts
  import EChartOption = echarts.EChartOption
  import PieDataObject = echarts.EChartOption.SeriesPie.DataObject
  import LineObject = echarts.EChartOption.SeriesLine
  import BarObject = echarts.EChartOption.SeriesBar

  /**
   * 开关项信息
   */
  interface SwitchItemInfo {
    dataSourceName: string  // 数据源名称
    iconName: string  // 图标名
  }

  @Component({components: {YjEcharts, YjSwitchIcon}})
  export default class MonitorDetailChart extends Vue {
    @Ref() readonly echartsRef: ECharts
    @PropSync('config') configSync!: MonitorChartConfigInfo
    @Prop() preview?: boolean

    private readonly defaultOption: EChartOption = {
      legend: {
        type: 'scroll', orient: 'vertical', left: 455, top: 20, bottom: 40, tooltip: {show: true}, itemGap: 5, textStyle: {lineHeight: 18},
        formatter: (name: string) => (echarts as any).format.truncateText(name, 78, '12px Microsoft Yahei', '…')
      },
      color: [
        '#C23531', '#2F4554', '#61A0A8', '#D48265', '#78C679', '#88419D', '#EC7014', '#FA9FB5', '#4292C6', '#BCBDDC',
        '#DF65B0', '#41AB5D', '#FE9929', '#FC4E2A', '#41B6C4'
      ]
    }
    private readonly previewConfig = {okValue: '1', icon1: 'lib-power-ok', icon2: 'lib-power-no'} as MonitorChartConfigInfo
    private getPreviewHistoryDataInfo = (refreshTime: number): Promise<HistoryDataInfo> => {
      const date = new Date()
      const now = CommonUtil.timeFormat(date, DateFormat.DateTimeFull)
      const sourceList = ['[数据源一]', '[数据源二]', '[数据源三]', '[数据源四]']
      const xdata = new Array(refreshTime).join(',').split(',').map(() => {
        date.setMinutes(date.getMinutes() - 1)
        return CommonUtil.timeFormat(date, 'HH:mm')
      }).reverse()
      const dataList = sourceList.map((item) => ({dataName: item, data: xdata.map(() => String(Math.floor(Math.random() * 100)))}))
      return Promise.resolve({now, dataList, xdata, units: '%'})
    }
    private getPreviewLatestDataInfo = (isSwitch: boolean): Promise<LatestDataInfo> => {
      const now = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const sourceList = ['[数据源一]', '[数据源二]', '[数据源三]', '[数据源四]']
      let dataList
      if (isSwitch) {
        dataList = sourceList.map((item) => ({lastvalue: String(Math.floor(Math.random() * 2)), name: item}))
      } else {
        let sourceDataTemp = new Array(sourceList.length).join(',').split(',').map(() => Math.floor(Math.random() * 10))
        let totalTemp = sourceDataTemp.reduce((prev, current) => prev + current, 0)
        sourceDataTemp = sourceDataTemp.map((item) => Math.floor((item / totalTemp) * 100))
        totalTemp = sourceDataTemp.reduce((prev, current) => prev + current, 0)
        sourceDataTemp[0] = sourceDataTemp[0] + (100 - totalTemp)
        dataList = sourceList.map((item, index) => ({lastvalue: String(sourceDataTemp[index]), name: item}))
      }
      return Promise.resolve({now, dataList, units: '%'})
    }
    private historyDataInfo: HistoryDataInfo = null
    private latestDataInfo: LatestDataInfo = null

    readonly refreshTimeList = [
      {label: '5分钟', value: 5},
      // {label: '10分钟', value: 10},
      {label: '15分钟', value: 15},
      {label: '30分钟', value: 30},
      {label: '1小时', value: 60},
      {label: '1天', value: 1440}
    ]
    refreshTime = this.refreshTimeList[2].value
    showLoading = false
    updateTime = ''
    switchDataList: SwitchItemInfo[] = []
    textDataList: { lastvalue: string; name: string }[] = []

    /**
     * 刷新组件渲染
     */
    handleRefreshRender(): void {
      this.handleReset()
      this.handleGetData()
    }

    /**
     * 刷新数据渲染
     */
    handleRefreshData(): void {
      this.handleGetData()
    }

    handleEdit(): void {
      // 预览时不操作
      if (this.preview) {
        return
      }
      this.$emit('edit')
    }

    handleDelete(): void {
      // 预览时不操作
      if (this.preview) {
        return
      }
      this.$emit('delete')
    }

    private handleReset(): void {
      this.showLoading = false
      this.echartsRef.clear()
      this.refreshTime = this.refreshTimeList[2].value
      this.updateTime = ''
      this.switchDataList = []
      this.textDataList = []
      this.historyDataInfo = null
      this.latestDataInfo = null
    }

    private handleGetData(): void {
      switch (this.configSync.chartType) {
        case MonitorChartType.Line:
        case MonitorChartType.Bar:
          this.getHistoryDataInfo().then(this.handleDataRender)
          break
        case MonitorChartType.Pie:
        case MonitorChartType.Switch:
        case MonitorChartType.Text:
          const isSwitch = MonitorChartType.Switch === this.configSync.chartType
          this.getLatestDataInfo(isSwitch).then(this.handleDataRender)
          break
        default:
          break
      }
    }

    private handleDataRender(): void {
      switch (this.configSync.chartType) {
        case MonitorChartType.Line:
          this.handleLineDataRender()
          break
        case MonitorChartType.Bar:
          this.handleBarDataRender()
          break
        case MonitorChartType.Pie:
          this.handlePieDataRender()
          break
        case MonitorChartType.Switch:
          this.handleSwitchDataRender()
          break
        case MonitorChartType.Text:
          this.handleTextDataRender()
          break
        default:
          break
      }
    }

    private handleLineDataRender(): void {
      if (!this.historyDataInfo) {
        this.echartsRef.clear()
        return
      }
      const {dataList, units, xdata} = this.historyDataInfo
      const legendData: string[] = []
      const series: LineObject[] = []
      const unitsStr = units ? `（${units}）` : ''
      dataList.forEach((item) => {
        legendData.push(item.dataName)
        series.push({
          type: 'line',
          name: item.dataName,
          data: item.data,
          areaStyle: {},
          smooth: true,
          connectNulls: true,
          symbolSize: 8,
          showSymbol: false,
          hoverAnimation: false
        })
      })
      // 刷新图表
      const option: EChartOption = {...this.defaultOption}
      option.dataZoom = [{type: 'inside'}, {type: 'slider', top: 217, left: 130, right: 270, bottom: 2}]
      option.tooltip = {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6A7985'}}}
      option.grid = {top: 10, left: 58, right: 115, bottom: 45}
      option.xAxis = [{type: 'category', data: xdata, boundaryGap: false}]
      option.yAxis = [{
        type: 'value',
        name: `单位${unitsStr}`,
        nameLocation: 'start',
        nameTextStyle: {padding: [14, 0, 0, -30]},
        max: units === '%' ? 100 : undefined,
        splitNumber: 10
      }]
      option.legend.data = legendData
      option.series = series
      this.echartsRef.setOption(option)
    }

    private handleBarDataRender(): void {
      if (!this.historyDataInfo) {
        this.echartsRef.clear()
        return
      }
      const {dataList, units, xdata} = this.historyDataInfo
      const legendData: string[] = []
      const series: BarObject[] = []
      const unitsStr = units ? `（${units}）` : ''
      dataList.forEach((item) => {
        legendData.push(item.dataName)
        series.push({
          type: 'bar',
          name: item.dataName,
          data: item.data
        })
      })
      // 刷新图表
      const option: EChartOption = {...this.defaultOption}
      option.dataZoom = [{type: 'inside'}, {type: 'slider', top: 217, left: 130, right: 280, bottom: 2}]
      option.tooltip = {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6A7985'}}}
      option.grid = {top: 10, left: 58, right: 115, bottom: 45}
      option.xAxis = [{type: 'category', data: xdata, boundaryGap: true}]
      option.yAxis = [{
        type: 'value',
        name: `单位${unitsStr}`,
        nameLocation: 'start',
        nameTextStyle: {padding: [14, 0, 0, -30]},
        max: units === '%' ? 100 : undefined,
        splitNumber: 10
      }]
      option.legend.data = legendData
      option.series = series
      this.echartsRef.setOption(option)
    }

    private handlePieDataRender(): void {
      if (!this.latestDataInfo) {
        this.echartsRef.clear()
        return
      }
      const {dataList, units} = this.latestDataInfo
      const config = this.configSync
      const legendData: string[] = []
      const seriesData: PieDataObject[] = []
      const unitsStr = units ? `（${units}）` : ''
      dataList.forEach((item) => {
        legendData.push(item.name)
        seriesData.push({name: item.name, value: Number(item.lastvalue)})
      })
      const series = [{
        type: 'pie',
        name: `${this.preview ? '[监控项名称]' : config.monitorItemName}${unitsStr}`,
        radius: '90',
        center: ['40%', '50%'],
        data: seriesData,
        label: {show: true, formatter: '{d}%', fontSize: 14},
        emphasis: {itemStyle: {shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'}}
      }]
      // 刷新图表
      const option: EChartOption = {...this.defaultOption}
      option.tooltip = {show: true}
      option.legend.data = legendData
      option.series = series
      this.echartsRef.setOption(option)
    }

    private handleSwitchDataRender(): void {
      if (!this.latestDataInfo) {
        this.switchDataList = []
        return
      }
      const {okValue, icon1, icon2} = this.preview ? this.previewConfig : this.configSync
      this.switchDataList = this.latestDataInfo.dataList
      .map((item) => ({dataSourceName: item.name, iconName: item.lastvalue === okValue ? icon1 : icon2}))
    }

    private handleTextDataRender(): void {
      if (!this.latestDataInfo) {
        this.textDataList = []
        return
      }
      this.textDataList = [...this.latestDataInfo.dataList]
    }

    private getHistoryDataInfo(): Promise<void> {
      const handler = this.preview
          ? this.getPreviewHistoryDataInfo(this.refreshTime)
          : AdapterService.getHistoryDataInfo(this.refreshTime, this.configSync.monitorShowDataList
          .map((item) => ({id: item.dataSourceKey, name: item.dataItemName})))
      this.showLoading = true
      return handler.then((historyDataInfo) => {
        this.showLoading = false
        this.historyDataInfo = historyDataInfo
        this.updateTime = historyDataInfo.now
      }).catch(() => {
        this.showLoading = false
        this.historyDataInfo = null
      })
    }

    private getLatestDataInfo(isSwitch: boolean): Promise<void> {
      const handler = this.preview
          ? this.getPreviewLatestDataInfo(isSwitch)
          : AdapterService.getLatestDataInfo(this.configSync.monitorShowDataList
          .map((item) => ({id: item.dataSourceKey, name: item.dataItemName})))
      this.showLoading = true
      return handler.then((latestDataInfo) => {
        this.showLoading = false
        this.latestDataInfo = latestDataInfo
        this.updateTime = latestDataInfo.now
      }).catch(() => {
        this.showLoading = false
        this.latestDataInfo = null
      })
    }

    mounted(): void {
      this.$nextTick().then(() => this.handleRefreshRender())
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .monitor-detail-chart {
    display: flex;
    flex-direction: column;
    width: 565px;
    height: 278px;
    border: 1px solid #999;
    background-color: #FFF;
    box-sizing: border-box;

    .detail-header {
      flex: none;
      padding: 0 10px;
      display: flex;
      height: 42px;
      align-items: center;

      .detail-title {
        flex: none;
        font-weight: bold;
        max-width: 360px;
        margin-right: 30px;
        @include overflow-ellipsis
      }

      .detail-operate {
        flex: none;

        .el-link {
          font-size: 12px;
        }
      }

      .detail-refresh {
        margin-left: auto;
      }
    }

    .detail-body {
      flex: auto;
      height: 0;

      .detail-chart {
        margin-top: -5px;
        height: calc(100% + 29px);
      }

      .detail-scroll {
        height: 100%;
        padding: 0 10px;
        overflow-x: hidden;
        overflow-y: auto;

        &.detail-switch-area {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -7px;

          .detail-switch-item {
            flex: none;
            margin: 7px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .detail-switch-text {
              font-size: 12px;
              height: 34px;
              line-height: 34px;
              white-space: nowrap;
            }
          }
        }

        &.detail-text-area .detail-text-item {
          display: flex;
          margin: 7px 0;
          font-size: 12px;

          .detail-text-label {
            flex: none;
            font-weight: bold;
          }

          .detail-text-value {
            flex: auto;
            width: 0;
          }

          .detail-text-label, .detail-text-value {
            line-height: 1.5;
          }
        }
      }
    }

    .detail-footer {
      flex: none;
      font-size: 12px;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
      text-align: right;
    }
  }
</style>
