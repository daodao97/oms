<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
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
import { useStore } from 'vuex'

const store = useStore()
const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

const sidebar = computed(() => {
  return store.state.app.sidebar
})

const device = computed(() => {
  return store.state.app.device
})

const fixedHeader = computed(() => {
  return store.state.settings.fixedHeader
})

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

useEventListener(window, 'resize', () => resizeHandler())

const handleClickOutside = () => {
  store.dispatch('app/closeSideBar', { withoutAnimation: false })
}

const resizeHandler = () => {
  if (!document.hidden) {
    const ismobile = isMobile()
    store.dispatch('app/toggleDevice', ismobile ? 'mobile' : 'desktop')
    if (ismobile) {
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/mixin";
@import "../../styles/variables";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

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
  position: absolute;
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
