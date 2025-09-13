<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }} {{ route.fullPath }}</div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@okiss/oms'

const userStore = useUserStore()
const name = computed(() => userStore.name)
const route = useRoute()

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
