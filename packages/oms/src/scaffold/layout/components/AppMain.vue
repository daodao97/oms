<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <keep-alive :include="include" max="10">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </router-view>
    <el-backtop :bottom="50" />
  </section>
</template>

<script>
import { useRoute, onBeforeRouteLeave } from 'vue-router'
export default {
  name: 'AppMain',
  setup() {
    const route = useRoute()
    const include = []
    onBeforeRouteLeave(() => {
      if (route.meta?.keepAlive) {
        !!include.indexOf(route.name) && include.push(route.name)
      }
    })
    return {
      include
    }
  }
}
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
