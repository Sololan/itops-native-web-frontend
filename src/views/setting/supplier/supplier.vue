
<template>
    <yj-container>
        <SupplierDrawer :formDrawerData="formSupplier"
                        :visibles="flag.formDrawer"
                        @input="handleCloseDrawer"
                        @clearDrawerData="clearDrawerData"
                        @initFormData="initData">

        </SupplierDrawer>
        <yj-table :config="tableConfig"
                  @pagination-change="handleCurrentPageChange"
                  @size-change="handlePageSizeChange">

            <!--查询-->
            <template #search>
                <yj-table-search>
                    <el-form-item label="供应商名称">
                        <el-input v-model="formSearch.supplierName" clearable placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="formSearch.contacts" clearable placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="添加日期">
                        <el-date-picker
                                v-model = "formSearch.fromCreateTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="起始时间">
                        </el-date-picker>
                        -
                        <el-date-picker
                                v-model="formSearch.toCreateTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="终止时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                </yj-table-search>
            </template>

            <!--添加-->
            <template #operate>
                <yj-table-operate>
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="addSupplier">添加</el-button>
                </yj-table-operate>
            </template>

            <!--自定义列-->
            <template #oper = 'scope'>
                <el-link class="el-link" type="primary" @click="modifySupplier(scope.row.id)">修改</el-link>
                <el-link class="el-link" type="danger" @click="deleteSupplier(scope.row.id)">删除</el-link>
            </template>

            <!--添加日期-->
            <template #addDates = 'scope'>
                <span>{{ dateFormat(scope.row.createTime) }}</span>
            </template>
        </yj-table>
    </yj-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import YjTable from '@/components/common/yj-table.vue';
    import YjContainer from '@/components/common/yj-container.vue';
    import YjDrawer from '@/components/common/yj-drawer.vue';
    import {TableConfig} from '@/providers/models/common/table-model';
    import {ColumnType, NoticeType, ColumnAlign} from '@/providers/models/enums';
    import SupplierService from '@/providers/services/bs/suppier-service';
    import {SuppierQueryParam} from '@/providers/models/bs/suppier-query-model';
    import {PageQuery} from '@/providers/models/common/http-model';
    import YjTableSearch from '@/components/common/yj-table-search.vue';
    import YjTableOperate from '@/components/common/yj-table-operate.vue';
    import {SupplierParam} from '@/providers/models/bs/suppier-model';
    import NoticeUtil from '@/providers/utils/notice-util';
    import SupplierDrawer from '@/views/setting/supplier/supplier-add-edit-drawer.vue';
    import {CATCH_ERROR} from '@/providers/models/consts';

    @Component({
    components: {SupplierDrawer, YjDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate},
  })
  export default class Supplier extends Vue {
      // 页码参数初始化
      defaultTotal?: number = 100
      defaultCurrentPage?: number = 1
      defaultPageSize?: number = 10

      // 表格配置
      tableConfig: TableConfig = {
          table: {data: []},
          page: {
              total: this.defaultTotal,
              pageSize: this.defaultPageSize,
              currentPage: this.defaultCurrentPage
          },
          columns: [
              {label: '序号', type: ColumnType.Index, width: '60'},
              {label: '供应商名称', prop: 'supplierName', minWidth: '24'},
              {label: '联系人', prop: 'contacts', minWidth: '20'},
              {label: '联系电话', prop: 'contactTel', minWidth: '21'},
              {label: '邮箱', prop: 'email', minWidth: '30'},
              {label: '添加日期', template: 'addDates', minWidth: '24'},
              {label: '操作', template: 'oper', minWidth: '15'}
          ]
      }

      // 变量区
      flag = {
          formDrawer: false,   // 控制弹窗
          supplierTempName: '',
          drawerTitle: '添加供应商',
      }
      formSearch?: SuppierQueryParam = {  // 查询条件参数
          supplierName: '',   // 供应商名称
          contacts: '',   // 联系人
          fromCreateTime: '',  // 起始时间
          toCreateTime: ''  // 截止时间
      }
      formSupplier: SupplierParam = {  // 弹窗数据
          id: 0 ,   // 供应商id
          orgId: this.$store.state.userInfo.id ,   // 组织id
          supplierName: '',   // 供应商名称
          contacts: '',   // 联系人
          contactTel: '',   // 联系电话
          email: '',   // 邮箱
          createTime: ''   // 添加日期
      }
      pageQuery?: PageQuery<SuppierQueryParam> = {  // 分页条件参数
          limit: this.tableConfig.page.pageSize,
          offset: (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize,
          query: this.formSearch
      }


      // 查询按钮
      onSearch() {
          if (this.formSearch.toCreateTime) {
              const endDateTime = new Date(this.formSearch.toCreateTime)
              const endDate = endDateTime.getFullYear() + '-' + (endDateTime.getMonth() + 1) + '-' + endDateTime.getDate()
              this.formSearch.toCreateTime = endDate + ' 23:59:59'
          }
          this.tableConfig.page.currentPage = 1
          this.pageQuery.offset = (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize
          this.initData();
      }

      // 添加按钮
      addSupplier() {
          this.flag.formDrawer = true
      }

      // 关闭弹窗
      handleCloseDrawer() {
         this.flag.formDrawer = false
       }

      // 行修改按
      modifySupplier(id: number) {
          this.formSupplier.id = id
          this.flag.formDrawer = true
      }

      // 行删除按钮
      deleteSupplier(id: number) {
          NoticeUtil.showConfirm('您确定要删除吗？', '删除')
          .then(() => {
                  SupplierService.deleteSupplier(id)
                      .then(() => this.initData())
                      .catch(CATCH_ERROR)
          })
          .catch(CATCH_ERROR)
      }

      // 页码变换处理函数
      handleCurrentPageChange(currentPage: number) {
          this.pageQuery.offset = (currentPage - 1) * this.tableConfig.page.pageSize
          this.initData()
      }

      // 页面数据显示数量变换处理函数
      handlePageSizeChange(pageSize: number) {
          this.tableConfig.page.pageSize = pageSize
          this.pageQuery.limit = pageSize
          this.initData()
      }

    mounted() {
        this.initData();
    }

    // 方法区
    // 初始化数据
    initData() {
        SupplierService.getSuppierPage(this.pageQuery)
        .then((res: any) => {
            this.tableConfig.table.data = res.result,
            this.tableConfig.page.currentPage = res.pageNo
            this.tableConfig.page.total = res.totalCount
        })
        .catch(CATCH_ERROR)
    }

    // 初始化formSupplier数据
        clearDrawerData() {
          this.formSupplier = {
              id: null ,
              orgId: null ,
              supplierName: '',
              contacts: '',
              contactTel: '',
              email: '',
              createTime: ''
          }
    }

    // 格式化添加日期
    dateFormat(addDate: string) {
          const tempDate = new Date(addDate);
          return tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
    }

  }
</script>

<style scoped lang="scss">
    .el-link {
        text-decoration: underline;
    }
</style>