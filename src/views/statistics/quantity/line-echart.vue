<template>
  <div class="line-area">
    <yj-echarts ref="chart"></yj-echarts>
  </div>

</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import echarts from 'echarts';
  import YjEcharts from '@/components/common/yj-echarts.vue'
  @Component({
    components: {YjEcharts}
  })
  export default class LineEchart extends Vue {
    @Prop() autoHeight: boolean
    options = {}

    drapLine(statisticsData: any, xAxisData: any): void {
      this.options = {
        tooltip: {

        },
        xAxis: {
          type: 'category',
          show: Object.keys(statisticsData).length > 0,
          axisLabel: {
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          },
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          show: Object.keys(statisticsData).length > 0
        },
        series: [
          {
            type: 'line',
            itemStyle: {
              normal: {
                color: '#080367',
                lineStyle: {
                  color: '#C74744'
                }
              }
            },
            label: {
              show: true,
              position: 'top',
              itemStyle: {
                color: '#080367'
              }
            },
            data: statisticsData
          }
        ]
      };
      (this.$refs['chart'] as any).setOption(this.options);
   }

    mounted() {

    }
  }
</script>

<style scoped lang="scss">

  .line-area {
    height: 320px;
  }

</style>
