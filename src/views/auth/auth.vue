<template>
  <yj-container>
    <!--列表-查询-->
    <template>
      <yj-table-search>
        <el-form-item label="开始日期">
          <el-date-picker class="drawer-input"
                          v-model="queryParam.startTime"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
          -
          <el-date-picker class="drawer-input"
                          v-model="queryParam.endTime"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截至日期">
          <el-date-picker class="drawer-input"
                          v-model="queryParam.endStartTime"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
          -
          <el-date-picker class="drawer-input"
                          v-model="queryParam.endEndTime"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParam.status" clearable placeholder="请选择">
            <el-option label="有效" value="1"/>
            <el-option label="失效" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryTable">查询</el-button>
        </el-form-item>
      </yj-table-search>
    </template>
    <template>
      <el-tabs v-model="activeName" type="card" class="chart-tabs">
        <el-tab-pane class="tab-pane" name="first" label="监控">
          <span slot="label">监控</span>
          <yj-table class="table" :config="tableConfig" @row-click="handleClick"
                    @pagination-change="handleMonitorPaginationChange"
                    @size-change="handleMonitorSizeChange">
            <!--列表-自定义列-->
            <template #startDate="scope">
              <span>{{scope.row.startDate.substring(0,10)}}</span>
            </template>
            <template #endDate="scope">
              <span>{{scope.row.endDate.substring(0,10)}}</span>
            </template>
            <template #settings="scope">
              <div>
                <div class="table-div1"><span class="table-span">硬件</span></div>
                <div class="table-div1"><span class="table-span">系统</span></div>
                <div class="table-div1"><span class="table-span">数据库</span></div>
                <div class="table-div1"><span class="table-span">中间件</span></div>
                <div class="table-div1"><span class="table-span">web</span></div>
              </div>
              <div>
                <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedHardwareQuantity}}/{{scope.row.hardwareQuantity}}&nbsp;</span>
                </div>
                <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedOsQuantity}}/{{scope.row.osQuantity}}&nbsp;</span>
                </div>
                <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedDbQuantity}}/{{scope.row.dbQuantity}}&nbsp;</span>
                </div>
                <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedMiddlewareQuantity}}/{{scope.row.middlewareQuantity}}&nbsp;</span>
                </div>
                <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedWebQuantity}}/{{scope.row.webQuantity}}</span>
                </div>
              </div>
            </template>
          </yj-table>
        </el-tab-pane>
        <el-tab-pane class="tab-pane" name="second" label="通知">
          <span slot="label">通知</span>
          <yj-table class="table" :config="tableConfig1" @row-click="handleClick"
                    @pagination-change="handlePaginationChange"
                    @size-change="handleSizeChange">
            <!--列表-自定义列-->
            <template #startDate="scope">
              <span>{{scope.row.startDate.substring(0,10)}}</span>
            </template>
            <template #endDate="scope">
              <span>{{scope.row.endDate.substring(0,10)}}</span>
            </template>
            <template #settings="scope">
              <div>
                <div class="table-div"><img class="table-icon"
                                            src="../../assets/images/wechat-icon.png"/></div>
                <div class="table-div"><img class="table-icon"
                                            src="../../assets/images/email-icon.png"/></div>
                <div class="table-div"><img class="table-icon"
                                            src="../../assets/images/message-icon.png"/></div>
                <div class="table-div"><img class="table-icon"
                                            src="../../assets/images/phone-icon.png"/></div>
              </div>
              <div>
                <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isWx?'无限制':'未开启'}}&nbsp;</span>
                </div>
                <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isEmail?'无限制':'未开启'}}&nbsp;</span>
                </div>
                <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isMsg?scope.row.usedMsgQuantity+'/'+scope.row.msgQuantity:'未开启'}}&nbsp;</span>
                </div>
                <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isPhone?scope.row.usedPhoneQuantity+'/'+scope.row.phoneQuantity:'未开启'}}&nbsp;</span>
                </div>
              </div>
            </template>
          </yj-table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {ColumnType, Gateway, ColumnAlign} from '@/providers/models/enums'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import HttpUtil from '@/providers/utils/http-util';
  import { AuthQueryModel } from '@/providers/models/bs/auth-model'
  import {PageQuery} from '@/providers/models/common/http-model'
  import AuthService from '@/providers/services/bs/auth-service'

  @Component({components: {YjTable, YjContainer, YjTableSearch, YjTableOperate, YjDrawer}})
  export default class Home extends Vue {

    defaultPageSize: number = 10

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: this.defaultPageSize
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '授权码', prop: 'licenseCode', minWidth: '100'},
        {label: '开始日期', prop: 'startDate', template: 'startDate', minWidth: '50'},
        {label: '截止日期', prop: 'endDate', template: 'endDate', minWidth: '50'},
        {label: '失效时间', prop: 'expireTime', minWidth: '70'},
        {label: '监控设置', template: 'settings', minWidth: '100'},
      ]
    }
    tableConfig1: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: this.defaultPageSize
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '授权码', prop: 'licenseCode', minWidth: '100'},
        {label: '开始日期', prop: 'startDate', template: 'startDate', minWidth: '50'},
        {label: '截止日期', prop: 'endDate', template: 'endDate', minWidth: '50'},
        {label: '失效时间', prop: 'expireTime', minWidth: '70'},
        {label: '监控设置', template: 'settings', minWidth: '100'},
      ]
    }

    queryParam: AuthQueryModel = {
      endEndTime: '',
      endStartTime: '',
      orgId: (this as any).$store.state.userInfo.topOrg.id,
      endTime: '',
      startTime: '',
      status: '',
    }

    private monitorPage: PageQuery<AuthQueryModel> = {
      limit: this.tableConfig.page.pageSize,
      offset: (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize,
      query: this.queryParam
    }

    private noticePage: PageQuery<AuthQueryModel> = {
      limit: this.tableConfig1.page.pageSize,
      offset: (this.tableConfig1.page.currentPage - 1) * this.tableConfig1.page.pageSize,
      query: this.queryParam
    }

    /*监控分页参数*/
    handleMonitorPaginationChange(currentPage: number) {
      // this.tableConfig1.page.currentPage = currentPage;
      this.monitorPage.offset = (currentPage - 1) * this.tableConfig.page.pageSize,
          this.queryTable();
    }

    /*监控分页参数*/
    handleMonitorSizeChange(pageSize: number) {
      this.tableConfig.page.pageSize = pageSize
      this.monitorPage.limit = pageSize
      this.queryTable();
    }

    /*通知分页参数*/
    handlePaginationChange(currentPage: number) {
      this.noticePage.offset = (currentPage - 1) * this.tableConfig1.page.pageSize,
          this.queryTable();
    }

    /*通知分页参数*/
    handleSizeChange(pageSize: number) {
      this.tableConfig1.page.pageSize = pageSize
      this.noticePage.limit = pageSize
      this.queryTable();
    }

    /*查询*/
    queryTable() {
      if (this.$data.activeName === 'first') {
        this.refreshMonitorTable()
      } else {
        this.refreshNoticeTable()
      }
    }

    // 刷新监控table
    refreshMonitorTable(groupName = ''): void {
      AuthService.getMonitorLicensesPage(this.monitorPage).then((data: any) => {
        this.tableConfig.table.data = data.result
        this.tableConfig.page.currentPage = data.pageNo
        this.tableConfig.page.total = data.totalCount
      })
    }

    // 刷新通知table
    refreshNoticeTable(groupName = ''): void {
      AuthService.getWarningLicencesPage(this.noticePage).then((data: any) => {
        this.tableConfig1.table.data = data.result;
        this.tableConfig1.page.currentPage = data.pageNo;
        this.tableConfig1.page.total = data.totalCount;
      })
    }

    handleClick(scope: RowCbParam): void {
    }

    mounted() {
      this.refreshMonitorTable()
      this.refreshNoticeTable()
    }

    data() {
      return {
        activeName: 'first',
        value1: '',
        value2: '',
        value3: '',
        value4: ''
      }
    }
  }
</script>

<style scoped lang="scss">

  .chart-tabs  /deep/ {
    margin-top: 15px;

    .el-tabs__content {
      padding: 0 !important;
    }
  }

  .drawer-input {
    width: 190px;
    height: 32px;
  }

  .table-span {
    display: inline-block;
  }

  .table-div1 {
    width: 20%;
    display: inline-block;
    text-align: center;
  }

  .table-icon {
    display: inline-block;
    padding-right: 10px;
  }

  .table-div {
    width: 25%;
    display: inline-block;
    text-align: center;
  }

  .table-span2 {
    display: inline-block;
  }

  .table-span-color {
    color: #080367;
  }

  .tab-pane {
    min-height: 300px;
  }

  .table {
    height: 36vw;
  }

  .on {
    background: rgba(234, 244, 254, 1);
  }

  .yj-table /deep/ .el-table:not(.yj-disable-radius)  {
    border-radius: 0;
  }

  .el-tabs /deep/ .el-tabs__header {
    margin: 0 0 0 0;
  }

  .el-tabs /deep/ .el-tabs__content {
    padding: 0 0 0 0;
  }

  .el-tabs /deep/ .el-tabs__item.is-active {
    background-color: #EAEDF4;
    border-bottom-color: #EAEDF4;
    border-left: none;
  }
</style>
