<template>
  <div class="yj-switch-icon">
    <i class="libfont" :class="[iconClass]"></i>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class YjSwitchIcon extends Vue {
    @Prop() name?: string
    get iconClass() {
      if (!this.name) {
        return ''
      }
      const suffix = this.name.substring(this.name.lastIndexOf('-'))
      return `${this.name} color${suffix}`
    }
  }
</script>

<style scoped lang="scss">
  .yj-switch-icon {
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid #CCC;
    border-radius: 2px;
    box-sizing: border-box;

    .libfont {
      font-size: 50px;

      &.color-ok {
        color: #22FF60;
      }

      &.color-no {
        color: #FD3333;
      }
    }
  }
</style>
