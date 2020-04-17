<template>
  <yj-panel :title="title" :title-border="true" :auto-height="true">
    <template #operate>
       <div class="home-operate">
         <span class="m-r-10">{{countDate}}</span>
         <el-link type="primary" @click="$emit('refresh')">刷新</el-link>
       </div>
    </template>
    <slot />
  </yj-panel>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import YjPanel from '@/components/common/yj-panel.vue'

  @Component({components: {YjPanel}})
  export default class HomePanel extends Vue {
    @Prop() title!: string
    @Prop() countDate: string
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .home-operate {
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
