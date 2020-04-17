<template>
  <div class="error">
    404
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjContainer from '@/components/common/yj-container.vue'

  @Component({components: {YjContainer}})
  export default class Error extends Vue {}
</script>

<style scoped lang="scss">
</style>
