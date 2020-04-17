<template>
  <yj-container :no-padding="true">
    <div class="license-scroll">
      <div class="license-box">
        <span class="license-welcome">welcome</span>
        <span class="license-system">智能运维平台</span>
        <el-form label-width="100px" :model="licenseForm" ref="licenseForm" @submit.native.prevent>
          <el-form-item label="请输入授权码" prop="licenseKey" class="license-item">
            <el-input v-model="licenseForm.licenseKey" @keyup.enter.native="handleSave" />
          </el-form-item>
        </el-form>
        <div class="license-submit">
          <el-button class="license-btn" :disabled="!licenseForm.licenseKey" @click="handleSave">立即激活</el-button>
        </div>
      </div>
    </div>

    <template #background>
      <img class="license-logo" src="../../../assets/images/common/license-logo.png" alt="background">
      <img class="license-background" src="../../../assets/images/common/license-bg.svg" alt="background">
    </template>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Ref, Vue} from 'vue-property-decorator'
  import YjContainer from '@/components/common/yj-container.vue'
  import {ElForm} from 'element-ui/types/form'
  import CommonUtil from '@/providers/utils/common-util'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import licenseService from "@/providers/services/bs/license-service";

  @Component({components: {YjContainer}})
  export default class License extends Vue {
    @Ref('licenseForm') readonly licenseFormRef!: ElForm

    licenseForm = {licenseKey: ''}

    handleSave(): void {
      CommonUtil.formValidate(this.licenseFormRef).then(() => {
        licenseService.activeCode(this.licenseForm.licenseKey).then(()=>this.handleSaveSuccess()).catch(CATCH_ERROR)
      })
    }

    /**
     * 保存成功以后调用
     */
    private handleSaveSuccess(): void {
      NoticeUtil.showLicenseSuccess().then(() => {
        const redirect = this.$route.query.redirect
        this.$router.push({path: '/login', query: {redirect}})
      }).catch(CATCH_ERROR)
    }
  }
</script>

<style scoped lang="scss">
  .license-logo {
    position: absolute;
    top: 80px;
    left: 80px;
    width: 275px;
    height: 72px;
  }

  .license-background {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .license-scroll {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .license-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 700px;
      min-height: 100%;
      margin: 0 auto;
      padding: 20px 0;
      box-sizing: border-box;
      align-items: center;

      & > * {
        flex: none;
      }

      .license-welcome, .license-system {
        color: #FFF;
        font-size: 48px;
        font-weight: bold;
      }

      .license-system {
        margin: 20px 0 136px;
      }

      .license-item /deep/ {
        .el-form-item__label {
          color: #FFF;
          font-size: 14px;
          font-weight: bold;
        }

        .el-input {
          width: 550px;
        }

        .el-input__inner {
          color: #FFF;
          font-size: 14px;
          border-radius: 0;
          border-color: #FFF !important;
          background-color: transparent;
        }
      }

      .license-submit {
        margin-top: 82px;

        .license-btn {
          width: 200px;
          border-radius: 0;
          color: #FFF !important;
          border-color: #FFF !important;
          background-color: transparent;

          &.is-disabled {
            color: #646978 !important;
            border-color: #565F6B !important;
          }
        }
      }
    }
  }
</style>
