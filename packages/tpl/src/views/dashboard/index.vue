<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }} {{ route.fullPath }}</div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore()
const name = computed(() => store.getters.name)
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
