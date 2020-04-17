import {DateFormat} from '@/providers/models/enums'
<template>
  <yj-container>
    <el-row :gutter="15" type="flex" class="el-area">
      <el-col :span="10">
        <yj-panel class="monitor-area" :title="title">
          <div class="monitor-main">
            <div class="monitor-left">
              <span class="monitor-count">监控总数</span>
              <span class="monitor-num">{{monitorCount}}</span>
            </div>
            <div class="line"></div>
            <div class="monitor-right">
              <div class="monitor-right-item" v-for="item in monitorObjectInfo">
                <span :title="item.monitorTypeName">{{item.monitorTypeName}}</span>
                <span :title="item.count">{{item.count}}</span>
              </div>
            </div>
          </div>
        </yj-panel>
      </el-col>
      <el-col :span="14" class="layout-cel">
        <yj-panel class="warning-area" :title="alarmTitle">
          <div class="alarm-main">
            <div class="alarm-left">
              <div class="alarm-left-item">
                <span>今日新增告警</span>
                <span>{{todayWarningCount.totalCount}}</span>
              </div>
              <div class="left-sapce"></div>
              <div class="alarm-left-item">
                <span>今日关闭告警</span>
                <span>{{todayWarningCount.closedCount}}</span>
              </div>
            </div>
            <div class="alarm-right">
              <div class="right-item">
                <span class="title-remind">提醒</span>
                <div class="right-box">
                  <img class="right-image" src="../../assets/images/remind.png">
                  <span>{{todayWarningCount.remindCount}}</span>
                </div>
              </div>
              <div class="right-item">
                <span class="title-warin">警告</span>
                <div class="right-box">
                  <img class="right-image" src="../../assets/images/warning.png">
                  <span>{{todayWarningCount.preCount}}</span>
                </div>
              </div>
              <div class="right-item">
                <span class="title-serious">严重</span>
                <div class="right-box">
                  <img class="right-image" src="../../assets/images/serious.png">
                  <span>{{todayWarningCount.heavyCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </yj-panel>
      </el-col>
    </el-row>
    <el-row :gutter="15" type="flex" class="el-area">
      <el-col :span="12">
        <HomePanel :title="cpuTitle" :countDate="cpuTime" @refresh="handleChange(2)">
          <HomeEchart class="m-l-10" ref="cupChart" />
        </HomePanel>
      </el-col>
      <el-col :span="12">
        <HomePanel :title="memoryTitle" :countDate="memoryTime" @refresh="handleChange(1)">
          <HomeEchart class="m-l-10" ref="memoryChart" />
        </HomePanel>
      </el-col>
    </el-row>
    <el-row :gutter="15" type="flex">
      <el-col :span="12">
        <HomePanel :title="diskTitle" :countDate="diskTime" @refresh="handleChange(3)">
          <HomeEchart class="m-l-12" ref="diskChart" />
        </HomePanel>
      </el-col>
      <el-col :span="12">
        <HomePanel :title="newWorkTitle" :countDate="newWorkTime" @refresh="handleChange(4)">
          <el-tabs class="chart-tabs" type="border-card" tab-position="left" stretch @tab-click="handleTabChange($event)">
            <el-tab-pane label="网络接收">
              <HomeEchart ref="newWorkChart" />
            </el-tab-pane>
            <el-tab-pane label="网络发送">
              <HomeEchart ref="newWorkOutChart" />
            </el-tab-pane>
          </el-tabs>
        </HomePanel>
      </el-col>
    </el-row>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjPanel from '@/components/common/yj-panel.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import HomePanel from '@/views/home/home-panel.vue'
  import HomeEchart from '@/views/home/home-echart.vue'
  import CommonUtil from '@/providers/utils/common-util'
  import MonitorsService from '@/providers/services/bs/monitors-service'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import WarningService from '@/providers/services/bs/warning-service'
  import {TodayWarningModel} from '@/providers/models/bs/warning-model'
  import {MonitorObjectInfo} from '@/providers/models/bs/monitors-model'
  import {AdapterQueryModel, MonitorItemInfo} from '@/providers/models/monitor-adapter/adapter-model'
  import AdapterService from '@/providers/services/monitor-adapter/adapter-service'
  import {DateFormat} from '@/providers/models/enums'

  @Component({components: {HomeEchart, HomePanel, YjContainer, YjPanel}})
  export default class Home1 extends Vue {
    title: string = '监控对象信息'
    alarmTitle: string = '今日告警概况'
    diskTitle: string = '磁盘 Top5'
    memoryTitle: string = '内存 Top5'
    cpuTitle: string = 'CPU Top5'
    newWorkTitle: string = '网络接口 Top5'
    memoryTime: string = null
    cpuTime: string = null
    diskTime: string = null
    newWorkTime: string = null

    todayWarningCount: TodayWarningModel = {
      remindCount: 0,
      preCount: 0,
      heavyCount: 0,
      closedCount: 0,
      totalCount: 0
    }

    monitorObjectInfo: MonitorObjectInfo = {}

    monitorCount: number = 0

    tabIndex: number = 0

    handleChange(index: number): void {
      if (index === 1) {
        this.getMemoryTopData()
      } else if (index === 2) {
        this.getCupTopData()
      } else if (index === 3) {
        this.getDistTopData()
      } else if (index === 4) {
        if (this.tabIndex === 0) {
          this.getNewWorkInfoTopData()
          return
        }
        this.getNewWorkOutTopData()
      }
    }

    handleTabChange({index}: { index: string }): void {
      this.tabIndex = parseInt(index)
      this.$nextTick().then(() => {
        if (index === '0') {
          this.getNewWorkInfoTopData()
        } else {
          this.getNewWorkOutTopData()
        }
      })
    }

    // 获取监控对象
    getMonitor(): void {
      MonitorsService.getMonitorData().then((data: any) => {
        this.monitorObjectInfo = data
        data.map((item: any) => {
          this.monitorCount += item.count
        })
      }).catch(CATCH_ERROR)
    }

    // 获取今日告警统计
    getTodayWarningData(): void {
      WarningService.getTodayWarningData().then((data: TodayWarningModel) => {
        if (data) {
          this.todayWarningCount = data
        }
      })
    }

    // 获取内存 top 5 数据
    getMemoryTopData(): void {
      this.memoryTime = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const memoryQueryParam: AdapterQueryModel = {
        key: 'memory',
        n: 5
      }
      this.sendRequest(memoryQueryParam, 'memoryChart', false)
    }

    // 获取CPU top 5 数据
    getCupTopData(): void {
      this.cpuTime = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const cpuQueryParam: AdapterQueryModel = {
        key: 'system.cpu.util',
        n: 5
      }
      this.sendRequest(cpuQueryParam, 'cupChart', false)
    }

    // 获取磁盘 top 5 数据
    getDistTopData(): void {
      this.diskTime = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const distQueryParam: AdapterQueryModel = {
        key: 'vfs',
        n: 5
      }
      this.sendRequest(distQueryParam, 'diskChart', false)
    }

    // 获取网络接收top 5 数据
    getNewWorkInfoTopData(): void {
      this.newWorkTime = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const newWorkInfoQueryParam: AdapterQueryModel = {
        key: 'net.if.in',
        n: 5
      }
      this.sendRequest(newWorkInfoQueryParam, 'newWorkChart', true)
    }

    // 获取网络出口top 5 数据
    getNewWorkOutTopData(): void {
      this.newWorkTime = CommonUtil.timeFormat(new Date(), DateFormat.DateTimeFull)
      const newWorkOutQueryParam: AdapterQueryModel = {
        key: 'net.if.out',
        n: 5
      }
      this.sendRequest(newWorkOutQueryParam, 'newWorkOutChart', true)
    }

    // 发送请求
    sendRequest(queryParams: AdapterQueryModel, refName: string, changEchart: boolean) {
      (this.$refs[refName] as any).showLoading()
      AdapterService.getMonitorItemData(queryParams).then((data: MonitorItemInfo[]) => {
        (this.$refs[refName] as any).hideLoading()
        if (!data) {
          return false
        }
        const seriesData: number[] = data.map((item) => parseFloat(item.lastvalue))
        const yAxisData: string[] = data.map((item) => item.hostname)
        let dataShow: number[] = []
        let maxValue: number = null
        if (changEchart) {
          maxValue = Math.max(...seriesData)
          dataShow = seriesData.map(() => maxValue)
        } else {
          dataShow = seriesData.map(() => 100)
        }
        (this.$refs[refName] as any).drapBar(seriesData, yAxisData, maxValue, dataShow, changEchart)
      }).catch(() => (this.$refs[refName] as any).hideLoading())
    }

    mounted() {
      this.getMonitor()
      this.getTodayWarningData()
      this.getCupTopData()
      this.getDistTopData()
      this.getMemoryTopData()
      this.getNewWorkInfoTopData()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .el-area {
    margin-bottom: $-container-padding;
  }

  .monitor-area {
    height: 172px !important;
  }

  .monitor-main {
    display: flex;
  }

  .monitor-left {
    flex: none;
    width: 110px;
    text-align: center;

    .monitor-count {
      display: block;
      height: 37px;
      line-height: 37px;
    }

    .monitor-num {
      display: block;
      color: $-color-primary;
      font-size: 48px;
      font-weight: bold;
      margin-top: 10px;
      @include overflow-ellipsis;
    }
  }

  .line {
    flex: none;
    width: 1px;
    height: 89px;
    background-color: #CCC;
    margin: 11px 20px 0;
  }

  .monitor-right {
    flex: auto;
    width: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .monitor-right-item {
    flex: none;
    width: 50%;
    height: 37px;
    display: flex;
    align-items: center;
  }

  .monitor-right-item > span:nth-child(1) {
    flex: none;
    color: #999;
    width: 60px;
    padding-right: 15px;
    text-align: right;
    @include overflow-ellipsis;
  }

  .monitor-right-item > span:nth-child(2) {
    flex: auto;
    width: 0;
    text-align: left;
    @include overflow-ellipsis;
  }

  .warning-area {
    height: 172px;
  }

  .alarm-main {
    display: flex;
  }

  .alarm-left {
    flex: none;
    width: 50%;
    display: flex;
    align-items: center;
  }

  .left-space {
    flex: 1;
    width: 0;
  }

  .alarm-left-item {
    flex: 10;
    width: 0;
  }

  .alarm-left-item > span:nth-child(1) {
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
    font-size: 14px;
    color: #333;
    margin-top: 15px;
    line-height: 1.5;
  }

  .alarm-left-item > span:nth-child(2) {
    display: inline-block;
    vertical-align: middle;
    min-width: 84px;
    max-width: 100%;
    font-size: 48px;
    color: #080367;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }

  .alarm-right {
    flex: none;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .right-item {
    width: 79px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .right-item + .right-item {
    margin-left: 8%;
  }

  .right-item > span {
    font-size: 16px;
    font-style: oblique;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
  }

  .right-box {
    height: 78px;
    position: relative;
  }

  .right-image {
    width: 100%;
    height: 100%;
  }

  .right-image + span {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 34px;
    color: #666;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title-remind {
    color: #8CF9F5;
  }

  .title-warin {
    color: #FCDE02;
  }

  .title-serious {
    color: #E9000E;
  }

  .alarm-img {
    width: 69px;
    height: 78px;
  }

  .row-height {
    margin-top: 20px;
  }

  .chart-tabs {
    border: none;
    box-shadow: none;
    margin: -10px -20px;

    /deep/ {
      .el-tabs__header.is-left {
        margin: 0 !important;
      }

      .el-tabs__content {
        padding: 10px 20px 0 0 !important;
      }

      .el-tabs__nav-wrap {
        padding: 0 !important;
      }

      .el-tabs__nav-prev, .el-tabs__nav-next {
        display: none;
      }

      .el-tabs__item {
        display: flex;
        align-items: center;
        padding: 5px;
        width: 30px;
        margin: -1px 0 !important;
        text-align: center;
        white-space: normal;
        height: 110px;
        line-height: 1.2;
      }

      .el-tabs__item + .el-tabs__item {
        border-radius: 0 0 0 10px;
      }
    }
  }

</style>
