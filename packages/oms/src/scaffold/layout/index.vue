<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import { Navbar, Sidebar, AppMain } from './components'
import { useEventListener } from '@vueuse/core'
import { useAppStore, useSettingsStore } from '../../store'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const route = useRoute()

const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device.value === 'mobile'
  }
})

const isMobile = () => {
  const rect = body.getBoundingClientRect()
  return rect.width - 1 < WIDTH
}

const resizeHandler = () => {
  if (!document.hidden) {
    const ismobile = isMobile()
    appStore.toggleDevice(ismobile ? 'mobile' : 'desktop')
    if (ismobile) appStore.closeSideBar({ withoutAnimation: true })
  }
}

resizeHandler()

useEventListener(window, 'resize', () => resizeHandler())

watch(route, () => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    appStore.closeSideBar({ withoutAnimation: false })
  }
})

const handleClickOutside = () => appStore.closeSideBar({ withoutAnimation: false })
</script>

<style lang="scss" scoped>
@use "../../styles/mixin" as *;
@use "../../styles/variables" as *;

.app-wrapper {
  @include clearfix;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: fixed;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
