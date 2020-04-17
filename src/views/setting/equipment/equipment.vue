<template>
  <yj-container>
    <yj-drawer @close="drawerClose()" :title="flag.addBtnFlag?'添加设备':'修改设备'" v-model="flag.drawerFlag">
      <template>
        <el-form ref="equipmentParam" :model="equipmentParam" :rules="equipmentRules" label-width="205px" class="p-t-10 p-b-10">
          <el-form-item label="设备编号" prop="equipmentCode">
            <el-input style="width: 190px" v-model="equipmentParam.equipmentCode"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipmentType">
            <el-select style="width: 190px" :disabled="!flag.addBtnFlag" v-model="equipmentParam.equipmentType" placeholder="请选择" @change="chooseType(equipmentParam.equipmentType)">
              <el-option
                  v-for="item in equipmentType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备子类型" prop="equipmentSubType">
            <el-select style="width: 190px" :disabled="!flag.addBtnFlag" v-model="equipmentParam.equipmentSubType" placeholder="请选择">
              <el-option
                  v-for="item in equipmentSubType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备品牌" prop="brand">
            <el-select style="width: 190px" v-model="equipmentParam.brand" placeholder="请选择" clearable>
              <el-option
                  v-for="item in brand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号" prop="equipmentMode">
            <el-input style="width: 190px" v-model="equipmentParam.equipmentMode" clearable></el-input>
          </el-form-item>
          <el-form-item label="服务编号" prop="serviceNumber">
            <el-input style="width: 190px" v-model="equipmentParam.serviceNumber" clearable></el-input>
          </el-form-item>
          <el-form-item label="购入日期" prop="purchaseDate">
            <el-date-picker style="width: 190px" v-model="equipmentParam.purchaseDate" value-format="yyyy-MM-dd 00:00:00" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="质保截止日期" prop="expiration">
            <el-date-picker style="width: 190px" v-model="equipmentParam.expiration" value-format="yyyy-MM-dd 00:00:00" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierId">
            <el-select style="width: 190px" v-model="equipmentParam.supplierId" placeholder="请选择" clearable>
              <el-option
                  v-for="item in supplier"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button type="primary" @click="addEquipment('equipmentParam')" v-if="flag.addBtnFlag">保存</el-button>
        <el-button type="primary" @click="editEquipment('equipmentParam')" v-if="flag.editBtnFlag">保存</el-button>
        <el-button type="info" @click="closeDrawer">取消</el-button>
      </template>
    </yj-drawer>
    <yj-table :config="tableConfig"
              @row-click="handleClick"
              @pagination-change="handleCurrentChange"
              @size-change="handleSizeChange">
      <!--列表-查询-->
      <template #search>
        <yj-table-search>
          <el-form-item label="设备编号">
            <el-input v-model="equipmentQueryParam.equipmentCode" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="equipmentQueryParam.equipmentType" clearable placeholder="请选择" @change="selectChooseType(equipmentQueryParam.equipmentType)">
              <el-option
                  v-for="item in equipmentType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备子类型" v-if="subIf">
            <el-select v-model="equipmentQueryParam.equipmentSubType" clearable placeholder="请选择">
              <el-option
                  v-for="item in equipmentSubType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="equipmentQueryParam.brand" clearable placeholder="请选择">
              <el-option
                  v-for="item in brand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select v-model="equipmentQueryParam.supplierId" clearable placeholder="请选择">
              <el-option
                  v-for="item in supplier"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购入日期">
            <el-date-picker
                v-model = "equipmentQueryParam.fromPurchaseDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="起始时间">
            </el-date-picker>
            -
            <el-date-picker
                v-model="equipmentQueryParam.toPurchaseDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="终止时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </yj-table-search>
      </template>
      <!--列表-操作-->
      <template #operate>
        <yj-table-operate>
          <el-button type="primary" icon="el-icon-plus" @click="toAddDrawer" size="small">添加</el-button>
        </yj-table-operate>
      </template>
      <!--列表-自定义列-->
      <template #opr="scope">
        <el-link type="primary" @click="toEditDrawer(scope)"><u>修改</u></el-link>
        <el-link type="danger" @click="deleteEquipment(scope.row.id)"><u>删除</u></el-link>
      </template>
    </yj-table>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {ColumnAlign, ColumnType, DictGroupKey} from '@/providers/models/enums'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import {EquipmentInfo, EquipmentPageQuery} from '@/providers/models/bs/equipment-model'
  import EquipmentService from '@/providers/services/bs/equipment-service'
  import {PageQuery} from '@/providers/models/common/http-model'
  import DictService from '@/providers/services/uc/dicts-service'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {ElForm} from 'element-ui/types/form'
  import {DictInfo} from '@/providers/models/uc/dicts-model'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import SuppierService from '@/providers/services/bs/suppier-service'
  import {SupplierParam} from '@/providers/models/bs/suppier-model'

  @Component({components: {YjDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class Equipment extends Vue {

    subIf:boolean = false

    defaultTotal?: number = 100
    defaultPageSize?: number = 10
    defaultCurrentPage?: number = 1

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: this.defaultTotal,
        pageSize: this.defaultPageSize,
        currentPage: this.defaultCurrentPage
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '设备编号', prop: 'equipmentCode', minWidth: '18'},
        {label: '设备类型', prop: 'equipmentTypeName', minWidth: '13'},
        {label: '设备子类型', prop: 'equipmentSubTypeName', minWidth: '13'},
        {label: '品牌', prop: 'brandName', minWidth: '13'},
        {label: '型号', prop: 'equipmentMode', minWidth: '13'},
        {label: '服务编号', prop: 'serviceNumber', minWidth: '13'},
        {label: '购入日期', prop: 'purchaseDate', minWidth: '13', formatter(row,colunm)
          {
            if(row.purchaseDate === null){
              return row.purchaseDate
            }
            return row.purchaseDate.slice(0,10)
          }
        },
        {label: '质保结束日期', prop: 'expiration', minWidth: '13', formatter(row,colunm)
          {
            if(row.expiration === null){
              return row.expiration
            }
            return row.expiration.slice(0,10)
          }
        },
        {label: '供应商', prop: 'supplierName', minWidth: '13'},
        {label: '操作', template: 'opr', minWidth: '13'}
      ]
    }

    flag = {
      drawerFlag: false,
      addBtnFlag: true,
      editBtnFlag: false
    }

    equipmentRules = {
      equipmentCode: [
        {required: true, message: '请输入设备编号', trigger: 'blur'},
        {min: 1, max: 100, message: '长度在 1 到 100 个字节', trigger: 'blur'}
      ],
      equipmentType: [
        {required: true, message: '请选择设备类型', trigger: 'blur'}
      ],
      equipmentSubType: [
        {required: true, message: '请选择设备子类型', trigger: 'blur'}
      ],
      brand: [
        {required: false, message: '请选择设备品牌', trigger: 'blur'}
      ],
      equipmentMode: [
        {required: false, message: '请输入设备型号', trigger: 'blur'},
        {min: 1, max: 100, message: '长度在 1 到 100 个字节', trigger: 'blur'}
      ],
      serviceNumber: [
        {required: false, message: '请输入服务编号', trigger: 'blur'},
        {min: 1, max: 100, message: '长度在 1 到 100 个字节', trigger: 'blur'}
      ],
      expiration: [
        {required: false, message: '长度在 0 到 200 个字符', trigger: 'blur'}
      ],
      supplierId: [
        {required: false, message: '请选择供应商', trigger: 'blur'}
      ]
    }

    closeDrawer() {
      this.flag.drawerFlag = false
    }

    brand: DictInfo[] = []
    equipmentSubType: DictInfo[] = []
    equipmentType: DictInfo[] = []
    supplier: SupplierParam[] = []

    private equipmentPage: PageQuery<EquipmentPageQuery> = {}

    equipmentQueryParam: EquipmentPageQuery = {}

    equipmentParam: EquipmentInfo = {}

    initEquipmentParam() {
      this.equipmentParam = {
        id: null, //设备id
        equipmentCode: '',  // 设备Code
        equipmentType: null,  // 设备类型
        equipmentSubType: null,  // 设备子类型
        brand: null,  // 品牌
        equipmentMode: '', //设备编号
        serviceNumber: '', //服务编号
        purchaseDate: '', // 购入日期
        expiration: '', //过期时间
        supplierId: null  // 供应商id
      }
    }

    drawerClose() {
      (this.$refs['equipmentParam'] as ElForm).resetFields()
    }

    chooseType(pid: number) {
      this.equipmentParam.equipmentSubType = null
      DictService.getDictListByGidAndPid(7,pid)
      .then((data) => {
        this.equipmentSubType = data
      })
    }

    selectChooseType(pid: number) {
      if(pid == null || pid == 0){
        this.equipmentQueryParam.equipmentSubType = null
        this.subIf = false
      }else {
        this.subIf = true
        DictService.getDictListByGidAndPid(7,pid)
        .then((data) => {
          this.equipmentSubType = data
        })
      }
    }

    addEquipment(formName: string) {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (!valid) {
          return false;
        }
        EquipmentService.addEquipment(this.equipmentParam)
        .then(() => {
          this.flag.drawerFlag = false
          NoticeUtil.showMsg('添加成功')
          this.loadingPage()
        })
        .catch(CATCH_ERROR)
      })
    }

    editEquipment(formName: string) {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (valid) {
          EquipmentService.editEquipment(this.equipmentParam)
          .then(() => {
            this.flag.drawerFlag = false
            NoticeUtil.showMsg('修改成功')
            this.loadingPage()
          })
          .catch(() => {
            this.flag.drawerFlag = false
            NoticeUtil.showAlert('修改失败')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    deleteEquipment(id: string) {
      NoticeUtil.showConfirm('您确定要删除吗？')
      .then(() => {
        EquipmentService.deleteEquipment(id)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingPage()
        })
      })
    }

    toAddDrawer() {
      this.initEquipmentParam()
      this.flag.drawerFlag = true
      this.flag.addBtnFlag = true
      this.flag.editBtnFlag = false
    }

    toEditDrawer(scope: RowCbParam
    ) {
      if ((this.$refs['equipmentParam'] as ElForm) == null) {
      } else {
        (this.$refs['equipmentParam'] as ElForm).resetFields()
      }
      this.flag.drawerFlag = true
      this.flag.addBtnFlag = false
      this.flag.editBtnFlag = true
      let equipment: EquipmentInfo = scope.row
      this.equipmentParam.id = equipment.id
      this.equipmentParam.orgId = (this as any).$store.state.userInfo.topOrg.id
      this.equipmentParam.equipmentCode = equipment.equipmentCode
      this.equipmentParam.equipmentType = equipment.equipmentType
      DictService.getDictListByGidAndPid(7,equipment.equipmentType)
      .then(
          (data: any) => {
            this.equipmentSubType = data
          })
      this.equipmentParam.equipmentSubType = equipment.equipmentSubType
      this.equipmentParam.brand = equipment.brand
      this.equipmentParam.equipmentMode = equipment.equipmentMode
      this.equipmentParam.serviceNumber = equipment.serviceNumber
      this.equipmentParam.purchaseDate = equipment.purchaseDate
      this.equipmentParam.expiration = equipment.expiration
      this.equipmentParam.supplierId = equipment.supplierId
    }

    onSubmit() {
      this.equipmentPage.offset = 0
      this.tableConfig.page.currentPage = 1
      this.equipmentPage.query = this.equipmentQueryParam
      this.loadingPage()
    }

    handleCurrentChange(currentPage: number) {
      this.equipmentPage.offset = (currentPage - 1) * this.defaultPageSize
      this.loadingPage()
    }

    handleSizeChange(pageSize: number
    ) {
      this.equipmentPage.limit = pageSize
      this.loadingPage()
    }

    handleClick(scope: RowCbParam): void {}

    loadingPage() {
      EquipmentService.getEquipmentPageList(this.equipmentPage)
      .then((data) => {
        this.tableConfig.table.data = (data as any).result
        this.tableConfig.page.total = (data as any).totalCount
        this.tableConfig.page.currentPage = (data as any).pageNo
      })
    }

    getBrand() {
      DictService.getDictList(DictGroupKey.Brand)
      .then(
          (data: any) => {
            this.brand = data
          })
    }

    getEquipmentSubType() {
      DictService.getDictList(DictGroupKey.EquipmentSubType)
      .then(
          (data: any) => {
            this.equipmentSubType = data
          })
    }

    getEquipmentType() {
      DictService.getDictListByGidAndPid(7,-1)
      .then(
          (data: any) => {
            this.equipmentType = data
          })
    }

    getSupplier() {
      SuppierService.getSuppierList()
      .then(
          (data: any) => {
            this.supplier = data
          })
    }

    mounted() {
      this.initEquipmentParam()
      this.equipmentPage.limit = this.defaultPageSize
      this.equipmentPage.offset = (this.defaultCurrentPage - 1) * this.defaultPageSize
      this.equipmentPage.query = this.equipmentQueryParam
      this.getBrand()
      this.getEquipmentType()
      this.getSupplier()
      this.loadingPage()
    }
  }
</script>

<style scoped lang="scss">
</style>
