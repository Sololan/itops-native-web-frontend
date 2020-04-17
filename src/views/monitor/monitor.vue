<template>
  <yj-container>
    <!--列表页-->
    <yj-table :config="tableConfig" @page-search="handlePageChange($event)">
      <!--列表-查询-->
      <template #search>
        <yj-table-search>
          <el-form-item label="监控名称">
            <el-input v-model="tableQuery.monitorName" clearable />
          </el-form-item>
          <el-form-item label="设备用途">
            <el-select v-model="tableQuery.monitorUse" clearable placeholder="请选择">
              <el-option v-for="item in monitorUseList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
<!--          <el-form-item label="设备类型">-->
<!--            <el-cascader v-model="tableQuery.monitorType" clearable placeholder="请选择" :show-all-levels="false"-->
<!--                         :props="{ expandTrigger: 'click', lazy: true, lazyLoad: handleMonitorTypeLoad }" />-->
<!--          </el-form-item>-->
          <el-form-item label="设备类型">
            <el-select v-model="tableQuery.monitorType" clearable placeholder="请选择" >
                         <el-option v-for="item in monitorTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-select v-model="tableQuery.isValid" clearable placeholder="请选择">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleTableSearch(true)">查询</el-button>
          </el-form-item>
        </yj-table-search>
      </template>
      <!--列表-操作-->
      <template #operate>
        <yj-table-operate>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleMonitorAddOrEdit(null)">添加</el-button>
        </yj-table-operate>
      </template>
      <!--列表-自定义列-->
      <template #monitorName="{row}">
        <el-link type="primary" @click="handleMonitorDetail(row.id)">{{row.monitorName}}</el-link>
      </template>
      <template #cz="{row}">
        <el-link type="primary" @click="handleToggleEnable(!row.isValid, row.id)">{{row.isValid ? '禁用' : '启用'}}</el-link>
        <el-link type="primary" @click="handleMonitorAddOrEdit(row.id)">配置</el-link>
        <el-link type="danger" @click="handleMonitorDelete(row.id)">删除</el-link>
      </template>
    </yj-table>
    <!--新增、编辑抽屉-->
    <monitor-add-edit-drawer v-model="addEditDrawerVisible" :monitor-id="monitorId"
                             @success="(isEdit) => this.handleTableSearch(!isEdit)" />
    <!--详细抽屉-->
    <monitor-detail-drawer v-model="detailDrawerVisible" :monitor-id="monitorId" />
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjTable from '@/components/common/yj-table.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import {PageChangeParam, TableConfig} from '@/providers/models/common/table-model'
  import {DictInfo} from '@/providers/models/uc/dicts-model'
  import {CascaderNode, CascaderOption, Resolve} from 'element-ui/types/cascader-panel'
  import {MonitorInfo, MonitorsPageQuery} from '@/providers/models/bs/monitors-model'
  import {ColumnAlign, ColumnType, DictGroupKey, YesOrNoStatus} from '@/providers/models/enums'
  import {PageQuery} from '@/providers/models/common/http-model'
  import MonitorsService from '@/providers/services/bs/monitors-service'
  import DictService from '@/providers/services/uc/dicts-service'
  import MonitorAddEditDrawer from '@/views/monitor/monitor-add-edit-drawer.vue'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import MonitorDetailDrawer from '@/views/monitor/monitor-detail-drawer.vue'

  @Component({components: {YjContainer, YjTable, YjTableSearch, YjTableOperate, MonitorAddEditDrawer, MonitorDetailDrawer}})
  export default class Monitor extends Vue {
    tableConfig: TableConfig = {
      table: {data: []},
      page: {currentPage: 1, pageSize: 10},
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '监控名称', template: 'monitorName', minWidth: '90'},
        {label: '设备用途', prop: 'businessSystemName', minWidth: '90'},
        {label: 'IP地址', prop: 'ipAddress1', minWidth: '90'},
        {label: '设备类型', prop: 'equipmentType', minWidth: '90'},
        {label: '启用状态', minWidth: '90', formatter: ((row: MonitorInfo) => row.isValid === YesOrNoStatus.Yes ? '启用' : '禁用')},
        {label: '操作', template: 'cz', minWidth: '130'}
      ]
    }
    tableQuery: MonitorsPageQuery = {
      monitorName: '',
      monitorUse: null,
      monitorType: null,
      isValid: null
    }
    monitorUseList: DictInfo[] = []
    monitorTypeList :DictInfo[] = []
    monitorId: number = null
    addEditDrawerVisible = false
    detailDrawerVisible = false

    // handleMonitorTypeLoad(node: CascaderNode<number, CascaderOption>, resolve: Resolve<CascaderOption>): void {
    //   const {level, value} = node
    //   const leaf = level > 0  // 是否子级
    //   const handler = leaf
    //       ? DictService.getDictListByPid(value)
    //       : DictService.getDictList(DictGroupKey.EquipmentType)
    //   handler.then((dictList) => resolve(dictList.map((item) => ({leaf, label: item.name, value: item.id}))))
    // }

    handleMonitorTypeLoad(): void {
      const handler = DictService.getDictListByGidAndPid(7,-1);
      handler.then((data)=> this.monitorTypeList = data)
    }

    handleTableSearch(toFirstPage?: boolean): void {
      const limit: number = this.tableConfig.page.pageSize
      const pageNum: number = toFirstPage ? 1 : this.tableConfig.page.currentPage
      const offset: number = (pageNum - 1) * limit
      const pageQuery: PageQuery<MonitorsPageQuery> = {limit, offset, query: this.tableQuery}
      MonitorsService.getMonitorPageList(pageQuery).then((pageResult) => {
        this.tableConfig.table.data = pageResult.result
        this.tableConfig.page.total = pageResult.totalCount
      }, () => {
        this.tableConfig.table.data = []
      })
    }

    handleMonitorAddOrEdit(monitorId: number): void {
      this.monitorId = monitorId
      this.addEditDrawerVisible = true
    }

    handleMonitorDetail(monitorId: number): void {
      this.monitorId = monitorId
      this.detailDrawerVisible = true
    }

    handleToggleEnable(enable: boolean, monitorId: number): void {
      NoticeUtil.showConfirm(`您确定要${enable ? '启用' : '禁用'}吗？`)
      .then(() => enable ? MonitorsService.enableMonitor(monitorId) : MonitorsService.disableMonitor(monitorId))
      .then(() => this.handleTableSearch())
      .then(() => NoticeUtil.showMsg('操作成功'))
      .catch(CATCH_ERROR)
    }

    handleMonitorDelete(monitorId: number): void {
      NoticeUtil.showConfirm('您确定要删除吗？')
      .then(() => MonitorsService.deleteMonitor(monitorId))
      .then(() => this.handleTableSearch())
      .then(() => NoticeUtil.showMsg('操作成功'))
      .catch(CATCH_ERROR)
    }

    handlePageChange(pageChangeParam: PageChangeParam): void {
      this.tableConfig.page = {...this.tableConfig.page, ...pageChangeParam}
      this.handleTableSearch()
    }

    private getMonitorUseList(): void {
      DictService.getDictList(DictGroupKey.EquipmentUse).then(
          (dictList) => this.monitorUseList = dictList,
          () => this.monitorUseList = []
      )
    }

    mounted(): void {
      this.getMonitorUseList()
      this.handleTableSearch()
      this.handleMonitorTypeLoad()
    }
  }
</script>

<style scoped lang="scss">
</style>
