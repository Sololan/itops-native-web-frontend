<template>
    <yj-container>
       <yj-table-search>
            <el-form-item label="告警时间">
                <el-button @click="queryWeek">本周</el-button>
                <el-button @click="queryMonth">本月</el-button>
                <el-button @click="queryYear">本年</el-button>
            </el-form-item>
           <el-form-item>
             <el-date-picker
                      v-model="searchInfo.startTime"
                      value-format="yyyy-MM-dd"
                      type="date">
             </el-date-picker>
             -
             <el-date-picker
                 v-model="searchInfo.endTime"
                 value-format="yyyy-MM-dd"
                 type="date">
             </el-date-picker>
           </el-form-item>
           <el-form-item>
               <el-button type="primary" @click="onSubmit">查询</el-button>
           </el-form-item>
       </yj-table-search>
        <yj-panel :title="title" :auto-height="true" class="pancel-area">
          <div v-if="warningData.length === 0" class="warning-empty">
            <div class="item-area">
              <img class="img" src="../../../assets/images/warnEmpty-icon.png"/>
              <span>暂无数据</span>
            </div>
          </div>
            <LineEchart ref="countChart"></LineEchart>
        </yj-panel>
    </yj-container>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator'
  import YjContainer from '@/components/common/yj-container.vue';
  import YjTableSearch from '@/components/common/yj-table-search.vue';
  import YjPanel from '@/components/common/yj-panel.vue';
  import LineEchart from '@/views/statistics/quantity/line-echart.vue';
  import { AlarmQueryModel } from '@/providers/models/bs/report-model';
  import ReportService from '@/providers/services/bs/Report-service';
  @Component({
    components: {LineEchart, YjPanel, YjTableSearch, YjContainer}
  })
  export default class Quantity extends Vue {
    title: string = '告警数量'
    isShow: boolean = false
    warningData: any[] = []

    searchInfo: AlarmQueryModel = {
      endTime: '',
      identifier: 0,
      orgId: (this as any).$store.state.userInfo.topOrg.id,
      startTime: '',
      topNumber: 0
    }

    /*条件查询按钮*/
    onSubmit() {
      this.searchInfo.identifier = 0
      this.getAlarmNumberData()
    }

    // 获取告警数量统计数据
    getAlarmNumberData() {
      ReportService.getAlarmNumberData(this.searchInfo).then((data: any[]) => {
          this.warningData = data
          if (!data) {
            return false;
          }
          const warningData: number[] = data.map((item) => item.warningNumber);
          const dates: string[] = data.map((item) => item.dates);
          (this.$refs['countChart'] as any).drapLine(warningData, dates)
      })
    }

    // 查询本周数据
    queryWeek(): void {
      this.searchInfo.identifier = 1
      this.getAlarmNumberData()
    }

    // 查询本月数据
    queryMonth(): void {
      this.searchInfo.identifier = 2
      this.getAlarmNumberData()
    }

    // 查询本年数据
    queryYear(): void {
      this.searchInfo.identifier = 3
      this.getAlarmNumberData()
    }


    mounted() {
      this.getAlarmNumberData()
    }
  }
</script>

<style scoped lang="scss">

  .yj-panel {
    margin-top: 15px;
  }

  .pancel-area {
    height: 445px;
  }

  .warning-empty {
    display: flex;
    justify-content: center;
  }

  .item-area {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .img {
    width: 400px;
    height: 286px;
  }

</style>