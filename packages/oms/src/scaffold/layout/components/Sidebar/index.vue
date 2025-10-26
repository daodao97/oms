<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <search-menu v-if="!isCollapse" />
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template
          v-for="(item, index) in routes"
          :key="index + '-module'"
        >
          <!-- <div v-if="item.routes.length > 0 && item.label" class="menu-section">{{ item.label }}</div>-->
          <sidebar-item
            v-for="route in filterRoute(item.routes)"
            :key="route.path"
            :item="route"
            :to="$router.resolve(route.redirect ? route.redirect : route).fullPath"
            :is-collapse="isCollapse"
          />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import SearchMenu from './SearchMenu.vue'
import { cloneDeep } from 'lodash'
import { MenuType } from '../../../../types'
import { showEleByClassName } from '@okiss/utils'
import { useAppStore, useUserStore, useSettingsStore } from '../../../../store'
import { useRouter, useRoute } from 'vue-router'

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const sidebar = computed(() => appStore.sidebar)
const remoteRouter = computed(() => userStore.remoteRouter)
const customRouter = computed(() => userStore.customRouter)

const router = useRouter()
const route = useRoute()

const routes = computed(() => {
  let localRoutes: any[] = []
  router.options.routes.concat(customRouter.value || []).forEach(item => {
    if (item.path === '/') {
      localRoutes = localRoutes.concat(item.children || [])
    } else {
      localRoutes.push(item)
    }
  })
  return cloneDeep([
    { label: '', routes: localRoutes },
    ...remoteRouter.value
  ])
})

const activeMenu = computed(() => {
  const m = route.matched
  for (let i = m.length - 1; i >= 0; i--) {
    const tmp = m[i]
    if (tmp.meta.menuType === MenuType.menu) {
      showActive()
      return router.resolve(tmp.redirect ? tmp.redirect : tmp).fullPath
    }
  }
  return ''
})

const showLogo = computed(() => settingsStore.sidebarLogo)
const variables = computed(() => ({
  menuBg: '#304156',
  menuText: '#bfcbd9',
  menuActiveText: '#409EFF'
}))
const isCollapse = computed(() => !sidebar.value.opened)

onMounted(() => showActive())
function showActive() { showEleByClassName('is-active', 200) }
function filterRoute(arr: any[]) {
  return arr.filter(item => [MenuType.dir, MenuType.menu].indexOf(item.meta.menuType) !== -1)
    .map(item => {
      item = Object.assign({}, item)
      if (item.children) item.children = filterRoute(item.children)
      return item
    })
}
</script>
<style scoped>
::v-deep(.el-scrollbar__wrap) {
  overflow: scroll;
}

.menu-section {
  height: 30px;
  font-size: 14px;
  display: table-cell;
  vertical-align: bottom;
  padding-left: 20px;
  color: #97a8be;
  padding-top: 5px;
}
</style>
