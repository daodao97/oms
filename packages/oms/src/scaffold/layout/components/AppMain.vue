<template>
  <section class="app-main">
    <router-view :key="$route.fullPath + key" />
    <el-backtop :bottom="50" />
  </section>
</template>

<script setup>
import { useRoute, onBeforeRouteLeave } from 'vue-router'
const route = useRoute()
const include = []
const key = ref(0)
onBeforeRouteLeave(() => {
  if (route.meta?.keepAlive) {
    !!include.indexOf(route.name) && include.push(route.name)
  }
  key.value++
})
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>
