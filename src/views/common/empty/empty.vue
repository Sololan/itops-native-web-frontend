<template>
  <div class="empty">
    empty
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjContainer from '@/components/common/yj-container.vue'

  @Component({components: {YjContainer}})
  export default class Empty extends Vue {}
</script>

<style scoped lang="scss">
</style>
