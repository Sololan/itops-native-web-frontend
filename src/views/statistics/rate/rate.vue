<template>
    <yj-container>
        <template #header>
            <yj-table-search>
                <el-form-item label="告警时间">
                    <el-button @click="queryWeek">本周</el-button>
                    <el-button @click="queryMonth">本月</el-button>
                    <el-button @click="queryYear">本年</el-button>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="searchInfo.startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="date">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="searchInfo.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </yj-table-search>
        </template>
        <yj-panel :title="title">
            <yj-table :config="tableConfig" :disableRadius="true" @row-click="handleClick" class="table-area"></yj-table>
        </yj-panel>
    </yj-container>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'
    import YjContainer from '@/components/common/yj-container.vue';
    import YjTableSearch from '@/components/common/yj-table-search.vue';
    import YjPanel from '@/components/common/yj-panel.vue';
    import { TableConfig, RowCbParam } from '@/providers/models/common/table-model';
    import { ColumnType, ColumnAlign } from '@/providers/models/enums';
    import YjTable from '@/components/common/yj-table.vue';
    import { AlarmQueryModel } from '@/providers/models/bs/report-model';
    import ReportService from '@/providers/services/bs/Report-service'
    @Component({components: { YjTable, YjPanel, YjTableSearch, YjContainer}})
    export default class Quantity extends Vue {

        title: string = '告警内容TOP10'

        searchInfo: AlarmQueryModel = {
            endTime: '',
            identifier: 0,
            orgId: (this as any).$store.state.userInfo.topOrg.id,
            startTime: '',
            topNumber: 10
        }

        tableConfig: TableConfig = {
            table: {data: []},
            page: {
                layout: '',
                prevText: '',
                nextText: ''
            },
            columns: [
                {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
                {label: '告警内容', prop: 'warningInfo', minWidth: '20', align: ColumnAlign.Center},
                {label: '发生频率', prop: 'warningInfoCount', minWidth: '20', align: ColumnAlign.Center}
            ]
        }

        /*条件查询按钮*/
        onSubmit() {
            this.searchInfo.identifier = 0
            this.refreshTable()
        }

        // 查询本周数据
        queryWeek(): void {
            this.searchInfo.identifier = 1
            this.refreshTable()
        }

        // 查询本月数据
        queryMonth(): void {
            this.searchInfo.identifier = 2
            this.refreshTable()
        }

        // 查询本年数据
        queryYear(): void {
            this.searchInfo.identifier = 3
            this.refreshTable()
        }

        handleClick(scope: RowCbParam): void {

        }

        // 刷新表格
        refreshTable(): void {
            ReportService.getAlarmFrequencyData(this.searchInfo).then(
                (data: any[]) => {
                   this.tableConfig.table.data = data
            })
        }

        mounted() {
            this.refreshTable()
        }
    }
</script>

<style scoped lang="scss">

   /deep/.yj-panel {
       margin-top: 10px;
   }

    .el-tabs /deep/ .el-tabs__header {
        margin: 0 0 0 0;
    }

    .el-tabs /deep/ .el-tabs__content {
        padding: 0 0 0 0;
    }

</style>