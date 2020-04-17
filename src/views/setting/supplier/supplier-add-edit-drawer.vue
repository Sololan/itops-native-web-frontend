<template>
    <yj-drawer v-model="visible"
               :title="title"
               @open="handleOpenDrawer"
               @close="handleCloseDrawer">
        <el-form :model = "formDrawerData" class="p-b-10 p-t-10" ref="formSupplier" :rules="rule" label-width="205px">
            <el-form-item label="id" prop="id" hidden>
                <el-input style="width: 190px" v-model = "formDrawerData.id"></el-input>
            </el-form-item>
            <el-form-item label="tempName" hidden>
                <el-input style="width: 190px" v-model = "drawerFlag.tempName"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
                <el-input style="width: 190px" v-model = "formDrawerData.supplierName"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contacts">
                <el-input style="width: 190px" v-model = "formDrawerData.contacts"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactTel">
                <el-input style="width: 190px" v-model = "formDrawerData.contactTel"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input style="width: 190px" v-model = "formDrawerData.email"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="submitSupplier" type="primary">保 存</el-button>
            <el-button @click="handleCloseDrawer" type="info">关 闭</el-button>
        </template>
    </yj-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import YjDrawer from '@/components/common/yj-drawer.vue';
    import {SupplierParam} from '@/providers/models/bs/suppier-model';
    import SuppierService from '@/providers/services/bs/suppier-service';
    import {CATCH_ERROR} from '@/providers/models/consts';
    import {ElForm} from 'element-ui/types/form';
    import NoticeUtil from '@/providers/utils/notice-util';

    @Component({components: {YjDrawer}})
    export default class SupplierDrawer extends Vue {
        @Prop() visibles: boolean
        @Prop() formDrawerData: SupplierParam

        get visible() {return this.visibles}
        set visible(visibles) {this.$emit('input', visibles)}

        title: string = '供应商添加'
        formName: string = 'formSupplier'

        drawerFlag = { // 临时变量名，用来记录更新状态下名字是否进行修改，从而决定是否对名字验证重复
            tempName: ''
        }

        // 弹窗开启事件
        handleOpenDrawer() {
            this.formDrawerData.id === null ? this.title = '供应商添加' : this.title = '供应商编辑'
            if (this.formDrawerData.id > 0) {
                SuppierService.getSupplier(this.formDrawerData.id)
                .then((result: SupplierParam) => {
                    this.drawerFlag.tempName = result.supplierName
                    this.formDrawerData = result
                })
                .catch(CATCH_ERROR)
            } else {
                this.$emit('clearDrawerData')
            }
        }

        // 弹窗关闭事件
        handleCloseDrawer() {
            this.$emit('input'),
            this.$emit('clearDrawerData'),
            (this.$refs[this.formName] as ElForm).clearValidate();  // 清空验证信息
        }

        // 弹窗提交按钮
        submitSupplier() {
            (this.$refs[this.formName] as ElForm).validate((valid: boolean) => {
                if (!valid) {
                    return false;
                }
                if (this.formDrawerData.id > 0) {
                    // 更新
                    SuppierService.updateSupplier(this.formDrawerData)
                    .then(() => {
                        NoticeUtil.showMsg('更新成功')
                        this.$emit('initFormData')
                        this.$emit('input')  // 关闭弹窗
                    })
                    .catch(CATCH_ERROR)
                } else {
                    // 添加
                    this.formDrawerData.orgId = this.$store.state.userInfo.topOrg.id
                    SuppierService.addSupplier(this.formDrawerData)
                    .then(() => {
                        NoticeUtil.showMsg('添加成功')
                        this.$emit('initFormData')
                        this.$emit('input')  // 关闭弹窗
                    })
                    .catch(CATCH_ERROR)
                }
            })
        }

        // 定义电话验证规则
        validMobile = (rule: any, value: any, callback: any) => {
            if (value === '' || value === undefined) {
                callback()
            } else {
                const reg = /^1[3456789]\d{9}$/
                if (!reg.test(value)) {
                    callback(new Error('请输入正确电话格式'))
                } else {
                    callback()
                }
            }
        }
        // 判断是否重复名
        isRepeat = (rule: any, value: any, callback: any) => {
            if (this.drawerFlag.tempName === this.formDrawerData.supplierName){
                callback()
            } else {
                SuppierService.isRepeat(this.formDrawerData.supplierName)
                    .then((res) => {
                        callback()
                    })
                    .catch((error) => {
                        callback(new Error('您输入的供应商名称已经存在，请重新输入！'))
                    })
            }

        }

        rule = {
            supplierName: [
                {required: true, message: '供应商名称不能为空', trigger: 'blur' },
                {validator: this.isRepeat, trigger: 'blur', message: '用户名已存在'},
                {min: 1, max: 100, message: '长度在 1 到 100 个字节', trigger: 'blur' }
            ],
            contacts: [
                {required: true, message: '联系人不能为空', trigger: 'blur' },
                { min: 1, max: 50, message: '长度在 1 到 50 个字节', trigger: 'blur' }
            ],
            contactTel: [
                {required: true, message: '联系电话不能为空', trigger: 'blur',  },
                { min: 1, max: 20, message: '长度在 1 到 20 个字节', trigger: 'blur' },
                {validator: this.validMobile, message: '请输入正确的电话号码格式'}
            ],
            email: [
                {required: true, message: '邮箱不能为空', trigger: 'blur' },
                {type: 'email', message: '邮箱格式错误，请重新输入!', trigger: 'blur'}
            ]
        }
    }
</script>

<style scoped lang="css">

</style>
