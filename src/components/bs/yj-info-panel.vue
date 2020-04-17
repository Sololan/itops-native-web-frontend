<template>
  <div class="yj-info-panel" :class="{'yj-border-none': borderNone}">
    <div class="yj-title-area">
      <div class="yj-left" v-if="title">
        <span>{{title}}</span>
      </div>
      <div class="yj-right" v-if="$slots.operate">
        <slot name="operate" />
      </div>
    </div>
    <div class="yj-body-area">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class YjInfoPanel extends Vue {
    @Prop() title?: string
    @Prop() borderNone?: boolean
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-info-panel {

    &:not(.yj-border-none) {
      border-top: 1px dashed #999;
    }

    .yj-title-area {
      display: flex;

      .yj-left {
        flex: auto;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-weight: bold;
        @include overflow-ellipsis;
      }

      .yj-right {
        flex: none;
        display: flex;
        align-items: center;
        height: 50px;
        margin-left: 10px;
      }
    }
  }
</style>
