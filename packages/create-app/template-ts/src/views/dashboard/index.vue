<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }}, This is OMS: operator manager system!</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const name = computed(() => {
  return store.getters.nickname || store.getters.name
})
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
