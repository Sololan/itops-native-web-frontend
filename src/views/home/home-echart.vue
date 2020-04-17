<template>
  <div class="echart-area">
    <yj-echarts ref="monitorChartRef" @mouseover="handleMouseOver" @mousemove="handleMouseMove" @mouseout="handleMouseOut"></yj-echarts>
    <div v-show="showTip" class="x-axis-tip" :style="tipStyle">{{tipText}}</div>
  </div>
</template>

<script lang="ts">
  import {Component, Ref, Vue} from 'vue-property-decorator'
  import echarts from 'echarts'
  import YjEcharts from '@/components/common/yj-echarts.vue'
  import ECharts = echarts.ECharts
  import EChartOption = echarts.EChartOption

  @Component({
    components: {YjEcharts}
  })
  export default class HomeEchart extends Vue {
    @Ref() readonly monitorChartRef: ECharts

    showTip = false
    tipText = ''
    tipStyle = {top: '0', left: '0'}

    options: EChartOption = {}
    drapBar(statisticsData: any, yAxisData: any, maxValue: number, dataShadow: any, changeEcharts: boolean): void {
      const formatterValue = changeEcharts ? '{c}Kbps' : '{c}%'
      const units = changeEcharts ? 'Kbps' : '%'
      const newStatisticsData = statisticsData.map((item: number) => {
        const statisticsDataItem: any = {value: item}
        if (item >= 80 || item === maxValue) {
          if (!changeEcharts && item === 100) {
            statisticsDataItem.itemStyle = {color: '#F42626'}
          }
          statisticsDataItem.label = {show: true, position: 'insideBottomRight', formatter: formatterValue}
        }
        return statisticsDataItem
      })
      this.options = {
        xAxis: {
          show: false,
          splitNumber: 5,
          splitLine: {show: false},
          max: maxValue
        },
        yAxis: {
          inverse: true,
          data: yAxisData,
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false},
          triggerEvent: true,
          axisLabel: {formatter: (name: string) => (echarts as any).format.truncateText(name, 162, '12px Microsoft Yahei', '…')}
        },
        // tooltip: {show: true, formatter: '{b0}: {c0}' + units},
        grid: {top: 0, left: 130, right: 40, bottom: 0},
        series: [
          {
            type: 'bar',
            itemStyle: {color: '#CCCCCC', barBorderRadius: [5, 5, 5, 5]},
            barGap: '-100%',
            barWidth: 10,
            barCategoryGap: '25',
            data: dataShadow,
            animation: false,
            silent: true
          },
          {
            type: 'bar',
            label: {show: true, position: 'right', formatter: formatterValue},
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0,
                  [
                    {offset: 0, color: '#266EF4'},
                    {offset: 0.5, color: '#080367'},
                    {offset: 1, color: '#080367'}
                  ]
              ) as any,
              barBorderRadius: [5, 5, 5, 5]
            },
            barWidth: 10,
            data: newStatisticsData
          }
        ]
      }
      this.monitorChartRef.setOption(this.options)
      if (changeEcharts) {
        this.monitorChartRef.resize()
      }
    }

    showLoading(): void {
      this.monitorChartRef.showLoading()
    }

    hideLoading(): void {
      this.monitorChartRef.hideLoading()
    }

    handleMouseOver(params: any): void {
      if (params.componentType == 'yAxis') {
        const offsetX = params.event.event.offsetX
        const offsetY = params.event.event.offsetY
        this.tipText = params.value
        this.tipStyle = {top: `${offsetY + 10}px`, left: `${offsetX + 10}px`}
        this.showTip = true
      }
    }

    handleMouseMove(params: any): void {
      if (params.componentType == 'yAxis') {
        const offsetX = params.event.event.offsetX
        const offsetY = params.event.event.offsetY
        this.tipText = params.value
        this.tipStyle = {top: `${offsetY + 10}px`, left: `${offsetX + 10}px`}
        this.showTip = true
      }
    }

    handleMouseOut(params: any): void {
      if (params.componentType == 'yAxis') {
        this.tipText = ''
        this.tipStyle = {top: '', left: ''}
        this.showTip = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .echart-area {
    height: 198px;
    position: relative;
  }

  .x-axis-tip {
    position: absolute;
    padding: 5px;
    font-size: 12px;
    line-height: 18px;
    color: #FFF;
    background: #6A7985;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .2);
    border-radius: 2px;
  }
</style>
