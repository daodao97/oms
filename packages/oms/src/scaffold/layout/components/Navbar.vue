<template>
  <el-row
    ref="header"
    class="navbar"
    :style="navbarStyle"
  >
    <el-col :span="16">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </el-col>
    <el-col :span="8">
      <div class="right-content">
        <div
          v-if="showPageJsonSchemaIcon"
          class="right-item"
        >
          <PageEditor />
        </div>
        <div
          class="right-item-button"
          style="padding: 0"
        >
          <v-button :buttons="nav" />
        </div>
        <el-tooltip
          placement="bottom"
          :content="isDark ? '切换为明亮模式' : '切换为暗黑模式'"
        >
          <div
            class="right-item theme-toggle"
            role="button"
            tabindex="0"
            @click="toggleTheme"
            @keydown.enter.prevent="toggleTheme"
            @keydown.space.prevent="toggleTheme"
          >
            <el-icon>
              <component :is="isDark ? Moon : Sunny" />
            </el-icon>
          </div>
        </el-tooltip>
        <el-dropdown
          class="right-item"
          trigger="click"
        >
          <div class="user-info">
            <el-avatar
              class="user-avatar"
              :size="32"
              :src="currentAvatar || undefined"
              @error="handleAvatarError"
            >{{ avatarFallback }}</el-avatar>
            <span class="user-name">{{ nickname || name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <el-dropdown-item
                icon="oms-icon-index"
                @click="$router.push('/')"
              >首页</el-dropdown-item>
              <el-dropdown-item
                divided
                icon="el-icon-switch-button"
                @click="logout"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>
    <el-drawer
      v-if="showJsonSchema"
      :with-header="false"
      size="50%"
    />
  </el-row>
</template>

<script setup lang="ts">
import Breadcrumb from './Breadcrumb/index.vue'
import Hamburger from './Hamburger/index.vue'
import PageEditor from './PageEditor.vue'
import { showEleByClassName, Cache, waterMarker } from '@okiss/utils'
import { VBtn as VButton } from '@okiss/vbtf'
import { useAppStore, useSettingsStore, useUserStore } from '../../../store'
import { useThemeMode } from '../../../composables/useThemeMode'
import { computed, ref, onMounted, watch } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const showExportPop = ref(false)
const showJsonSchema = ref(false)
const json = ref('')
const key = ref(0)
const defaultAvatar = computed(() => settingsStore.defaultAvatar)
const sidebar = computed(() => appStore.sidebar)
const avatar = computed(() => userStore.avatar)
const name = computed(() => userStore.name)
const nickname = computed(() => userStore.nickname)
const nav = computed(() => (settingsStore as any).nav)
const setting = computed(() => settingsStore)
const user = computed(() => userStore)
const showPageJsonSchemaIcon = computed(() => settingsStore.showPageJsonSchema || false)
const { isDark, toggleTheme } = useThemeMode()
const navbarStyle = computed(() => {
  const envColor = setting.value.envColor?.[user.value.env]
  if (isDark.value) {
    return {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.55) 0%, rgba(37, 99, 235, 0.45) 45%, rgba(15, 23, 42, 0.92) 100%)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
      boxShadow: '0 1px 8px rgba(15, 23, 42, 0.7)'
    }
  }
  if (envColor) {
    return {
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 60%, ${envColor} 100%)`,
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)'
    }
  }
  return {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 70%, #ffffff 100%)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)'
  }
})

onMounted(() => {
  showEleByClassName('el-submenu is-active')
  const noticeStr = getSetting('navBarNotice') || ''
  if (noticeStr.length > 0 && !getSetting('closeNavNotice') && showNotice(noticeStr)) {
    // @ts-ignore
    window?.App?.config?.globalProperties?.$notify({
      title: '提示',
      message: noticeStr,
      dangerouslyUseHTMLString: true,
      duration: 0,
      onClose: closeNavBarNotice
    })
  }
  if (setting.value.envColor?.[user.value.env]) {
    // @ts-ignore
    waterMarker({
      elRef: header.value.$el,
      waterMark: user.value.env,
      color: 'skyblue',
      size: '20'
    })
  }
})

const header = ref()
const currentAvatar = ref('')
const avatarError = ref(false)

watch([avatar, defaultAvatar], () => {
  avatarError.value = false
  currentAvatar.value = avatar.value || defaultAvatar.value || ''
}, { immediate: true })

const avatarFallback = computed(() => {
  const text = nickname.value || name.value || settingsStore.title || '用户'
  return text ? text.toString().trim().charAt(0).toUpperCase() : '用'
})
function toggleSideBar() { appStore.toggleSideBar() }
async function logout() {
  await userStore.logout()
  // @ts-ignore
  const route = window?.App?.config?.globalProperties?.$router?.currentRoute?.value
  location.reload(`${location.origin}/#/login?redirect=${route?.fullPath || '/'}`)
}
function getSetting(name: string): any { return (settingsStore as any)[name] }
async function closeNavBarNotice() {
  settingsStore.updateSettings({ closeNavNotice: true } as any)
  closeNotice(getSetting('navBarNotice'))
}
function showPopover() { showExportPop.value = true }
function showNotice(text: string) {
  const key = 'dismiss:navbar_notice'
  if (!Cache.exist(key)) return true
  return Cache.get(key) !== text
}
function closeNotice(text: string) {
  const key = 'dismiss:navbar_notice'
  Cache.set(key, text)
}
function gotoMenuEdit() {
  // @ts-ignore
  const route = window?.App?.config?.globalProperties?.$router?.currentRoute?.value
  if (route?.meta?.pageId) {
    window.open(location.origin + location.pathname + '#/menu/' + route?.meta?.pageId)
  }
}

function handleAvatarError() {
  if (avatarError.value)
    return
  avatarError.value = true
  currentAvatar.value = ''
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.navbar {
  display: flex;
  height: 50px;
  /*overflow: hidden;*/
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
}

.notice-setting {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.right-content {
  float: right;
  height: 100%;
  padding-right: 20px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;

  .icon {
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }

  .right-item {
    padding: 0 12px;
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-item {
    padding: 0 12px;
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .theme-toggle {
    justify-content: center;

    .el-icon {
      font-size: 18px;
    }
  }

  .right-item-button {
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .user-info {
    height: 50px;
    line-height: 50px;
    display: inline-flex;
    align-items: center;
  }

  .user-avatar {
    margin: 0 10px 0 0;
    color: #fff;
    background: #1890ff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .user-name {
    vertical-align: middle;
  }
}
</style>
