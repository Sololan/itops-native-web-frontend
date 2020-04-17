<template>
  <yj-dialog v-model="visible" title="选择设备" :append-to-body="true"
             @open="handleDialogOpen" @close="handleDialogClose">
    <div class="yj-content">
      <div class="yj-header">
        <el-form ref="searchForm" :inline="true" label-width="100px" class="yj-search-form">
          <el-form-item label="设备编号">
            <el-input v-model="tableQuery.equipmentCode" clearable />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="tableQuery.equipmentType" clearable placeholder="请选择" @change="getEquipmentSubTypeList()">
              <el-option v-for="item in equipmentTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备子类型">
            <el-select v-model="tableQuery.equipmentSubType" clearable placeholder="请选择">
              <el-option v-for="item in equipmentSubTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="tableQuery.brand" clearable placeholder="请选择">
              <el-option v-for="item in equipmentBrandList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select v-model="tableQuery.supplierId" clearable placeholder="请选择">
              <el-option v-for="item in equipmentSupplierList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="购入日期">
            <el-date-picker v-model="tableQuery.fromPurchaseDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="开始时间" />
            <span class="m-l-5 m-r-5">~</span>
            <el-date-picker v-model="tableQuery.toPurchaseDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="结束时间" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleTableSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="yj-body">
        <yj-table ref="table" :config="tableConfig" @page-search="handlePageChange($event)" @table-change="row => equipmentInfo = row" />
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSave">选择</el-button>
      <el-button type="info" @click="visible = false">取消</el-button>
    </template>
  </yj-dialog>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import YjTable from '@/components/common/yj-table.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import {PageChangeParam, TableConfig} from '@/providers/models/common/table-model'
  import {DictInfo} from '@/providers/models/uc/dicts-model'
  import {ColumnType, DateFormat, DictGroupKey} from '@/providers/models/enums'
  import {PageQuery} from '@/providers/models/common/http-model'
  import DictService from '@/providers/services/uc/dicts-service'
  import YjDialog from '@/components/common/yj-dialog.vue'
  import {EquipmentInfo, EquipmentPageQuery} from '@/providers/models/bs/equipment-model'
  import EquipmentService from '@/providers/services/bs/equipment-service'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import CommonUtil from '@/providers/utils/common-util'
  import {ElTable} from 'element-ui/types/table'
  import NoticeUtil from '@/providers/utils/notice-util'

  @Component({components: {YjTable, YjTableSearch, YjDialog}})
  export default class MonitorEquipmentDialog extends Vue {
    @Prop() equipmentId: number
    @Prop() value: boolean
    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}

    private equipmentInfo: EquipmentInfo = null

    tableConfig: TableConfig = {
      table: {data: [], highlightCurrentRow: true},
      page: {currentPage: 1, pageSize: 10},
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '设备编号', prop: 'equipmentCode', minWidth: '80'},
        {label: '设备类型', prop: 'equipmentTypeName', minWidth: '80'},
        {label: '设备子类型', prop: 'equipmentSubTypeName', minWidth: '80'},
        {label: '品牌', prop: 'brandName', minWidth: '60'},
        {label: '型号', prop: 'equipmentMode', minWidth: '100'},
        {label: '服务编号', prop: 'serviceNumber', minWidth: '100'},
        {label: '购入日期', minWidth: '80', formatter: (row => CommonUtil.timeFormat(row.purchaseDate, DateFormat.Date))},
        {label: '质保截止日期', minWidth: '80', formatter: (row => CommonUtil.timeFormat(row.expiration, DateFormat.Date))}
      ]
    }
    tableQuery: EquipmentPageQuery = {
      equipmentCode: '',
      equipmentType: null,
      equipmentSubType: null,
      brand: null,
      supplierId: null,
      fromPurchaseDate: '',
      toPurchaseDate: ''
    }
    equipmentTypeList: DictInfo[] = []
    equipmentSubTypeList: DictInfo[] = []
    equipmentBrandList: DictInfo[] = []
    equipmentSupplierList: DictInfo[] = []

    handleSave(): void {
      if (!this.equipmentInfo) {
        NoticeUtil.showAlert('请选择设备').catch(CATCH_ERROR)
        return
      }
      this.$emit('chose', this.equipmentInfo)
      this.visible = false
    }

    handleTableSearch(toFirstPage?: boolean): void {
      toFirstPage ? this.tableConfig.page.currentPage = 1 : null

      const limit: number = this.tableConfig.page.pageSize
      const pageNum: number = this.tableConfig.page.currentPage
      const offset: number = (pageNum - 1) * limit
      const pageQuery: PageQuery<EquipmentPageQuery> = {limit, offset, query: this.tableQuery}
      EquipmentService.getEquipmentPageList(pageQuery).then((pageResult) => {
        this.tableConfig.table.data = pageResult.result
        this.tableConfig.page.total = pageResult.totalCount
        this.setCurrentRow()
      }, () => {
        this.tableConfig.table.data = []
      })
    }

    handlePageChange(pageChangeParam: PageChangeParam): void {
      this.tableConfig.page = {...this.tableConfig.page, ...pageChangeParam}
      this.handleTableSearch()
    }

    getEquipmentSubTypeList(): void {
      this.equipmentSubTypeList = []
      this.tableQuery.equipmentSubType = null
      if (!this.tableQuery.equipmentType) {
        return
      }
      DictService.getDictListByPid(this.tableQuery.equipmentType)
      .then((dictList) => this.equipmentSubTypeList = dictList)
      .catch(CATCH_ERROR)
    }

    handleDialogOpen(): void {
      this.getEquipmentTypeList()
      this.getEquipmentBrandList()
      this.getEquipmentSupplierList()
      this.handleTableSearch(true)
    }

    handleDialogClose(): void {
      this.tableQuery = {}
      this.equipmentTypeList = []
      this.equipmentSubTypeList = []
      this.equipmentBrandList = []
      this.equipmentSupplierList = []
      this.equipmentInfo = null
      this.tableConfig.table.data = []
      this.tableConfig.page.pageSize = 10
    }

    private setCurrentRow(): void {
      if (!this.equipmentId) {
        return
      }
      const rowInfo = this.tableConfig.table.data.find((item: EquipmentInfo) => item.id === this.equipmentId)
      if (!rowInfo) {
        return
      }
      this.equipmentInfo = rowInfo
      this.$nextTick(() => (this.$refs.table as ElTable).setCurrentRow(rowInfo))
    }

    private getEquipmentTypeList(): void {
      DictService.getDictList(DictGroupKey.EquipmentType).then(
          (dictList) => this.equipmentTypeList = dictList,
          () => this.equipmentTypeList = []
      )
    }

    private getEquipmentBrandList(): void {
      DictService.getDictList(DictGroupKey.Brand).then(
          (dictList) => this.equipmentBrandList = dictList,
          () => this.equipmentBrandList = []
      )
    }

    private getEquipmentSupplierList(): void {
      DictService.getDictList(DictGroupKey.Supplier).then(
          (dictList) => this.equipmentSupplierList = dictList,
          () => this.equipmentSupplierList = []
      )
    }
  }
</script>

<style scoped lang="scss">
  .yj-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .yj-header {
      flex: none;
    }

    .yj-body {
      flex: auto;
      height: 0;
    }
  }
</style>