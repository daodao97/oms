<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <el-image v-if="showLogoImage" :src="logo || ''" fit="contain" class="sidebar-logo" @error="handleLogoError">
          <template #error>
            <div class="sidebar-logo-fallback">{{ logoFallback }}</div>
          </template>
        </el-image>
        <template v-else>
          <div class="sidebar-logo-fallback">{{ logoFallback }}</div>
        </template>
        <div class="sidebar-subtitle">系统</div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <el-image v-if="showLogoImage" :src="logo || ''" fit="contain" class="sidebar-logo" @error="handleLogoError">
          <template #error>
            <div class="sidebar-logo-fallback">{{ logoFallback }}</div>
          </template>
        </el-image>
        <template v-else>
          <div class="sidebar-logo-fallback">{{ logoFallback }}</div>
        </template>
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../../../store'
import { computed, ref, watch } from 'vue'

defineProps<{ collapse: boolean }>()
const settings = useSettingsStore()
const title = computed(() => settings.title as any)
const logo = computed(() => settings.logo as any)
const logoError = ref(false)

const showLogoImage = computed(() => !!logo.value && !logoError.value)
const logoFallback = computed(() => {
  const text = title.value || 'OMS'
  return text ? text.toString().trim().charAt(0).toUpperCase() : 'O'
})

watch(logo, () => {
  logoError.value = false
}, { immediate: true })

function handleLogoError() {
  logoError.value = true
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: var(--sidebar-bg, #ffffff);
  text-align: center;
  color: var(--sidebar-logo-text-color, #00b074);
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: var(--sidebar-logo-text-color, #00b074);
      font-weight: 700;
      line-height: 50px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    & .sidebar-logo-fallback {
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 6px;
      background: rgba(var(--el-color-primary-rgb, 0, 176, 116), 0.1);
      color: var(--el-color-primary, #00b074);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    & .sidebar-subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.78);
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }

    .sidebar-logo-fallback {
      margin-right: 0px;
    }
  }
}
</style>
