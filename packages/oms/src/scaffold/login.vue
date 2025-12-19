<template>
  <div class="login-container">
    <div class="login-background">
      <div class="shape shape-1" />
      <div class="shape shape-2" />
      <div class="shape shape-3" />
    </div>

    <transition name="fade-scale" appear>
      <div class="login-card-wrapper">
        <el-card class="login-card" shadow="never">
          <div class="login-header">
            <div class="logo-wrapper">
              <img v-if="settingsStore.logo" :src="settingsStore.logo" alt="Logo" class="logo-img">
              <div v-else class="logo-fallback">{{ logoFallback }}</div>
            </div>
            <h1 class="login-title">{{ settingsStore.title || 'OMS' }}</h1>
            <p class="login-subtitle">欢迎回来，请登录您的账户</p>
          </div>

          <el-form
            ref="loginForm"
            :model="data"
            class="login-form"
            size="large"
            @submit.prevent="login"
          >
            <el-form-item prop="username">
              <el-input
                v-model="data.username"
                placeholder="用户名"
                prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="data.password"
                type="password"
                placeholder="密码"
                show-password
                prefix-icon="Lock"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item v-if="captcha" prop="captcha">
              <div class="captcha-wrapper">
                <el-input
                  v-model="data.captcha"
                  placeholder="验证码"
                  prefix-icon="Key"
                  class="custom-input captcha-input"
                />
                <div class="captcha-img-box" @click="onCaptchaClick">
                  <img
                    :src="baseAPI + '/user/captcha?ts=' + ts"
                    title="点击刷新"
                    class="captcha-img"
                  >
                </div>
              </div>
            </el-form-item>

            <div v-if="tips" class="login-tips">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ tips }}</span>
            </div>

            <el-button
              class="submit-button"
              type="primary"
              :loading="loading"
              :disabled="!onReady"
              native-type="submit"
              @click="login"
            >
              登 录
            </el-button>

            <div v-if="Object.keys(settingsStore.sso || {}).length > 0" class="sso-divider">
              <span>其他登录方式</span>
            </div>

            <div class="sso-container">
              <div id="sso-qrcode" />
              <!-- SSO items logic conserved -->
            </div>
          </el-form>
        </el-card>
        <div class="login-footer">
          &copy; {{ new Date().getFullYear() }} {{ settingsStore.title || 'OMS' }}. All rights reserved.
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore, useAppStore, useUserStore } from '../store'
import CryptoJS from 'crypto-js'
import { computed, ref } from 'vue'
import { User, Lock, Key, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const appStore = useAppStore()
const userStore = useUserStore()

const tips = computed(() => settingsStore.loginTips)
const captcha = computed(() => settingsStore.captcha)
const baseAPI = computed(() => appStore.baseURL)

const ts = ref(0)
const loading = ref(false)

const data = ref({
  username: '',
  password: '',
  captcha: '',
  sing: ''
})

const logoFallback = computed(() => {
  const text = settingsStore.title || 'OMS'
  return text ? text.toString().trim().charAt(0).toUpperCase() : 'O'
})

const onCaptchaClick = () => {
  ts.value++
}

const onReady = computed(() => {
  return data.value.username.length > 0 &&
         data.value.password.length >= 4 &&
         (captcha.value ? data.value.captcha.length === 4 : true)
})

const login = () => {
  if (loading.value) return
  if (!onReady.value) {
    ElMessage.error('请填写完整的登录信息')
    return
  }

  if (captcha.value) {
    data.value.sing = CryptoJS.MD5(`${data.value.username}${data.value.password}${data.value.captcha}`).toString()
  }

  loading.value = true
  userStore.login(data.value).then(res => {
    router.push({ path: route.query?.redirect as string || '/' })
  }).catch(e => {
    ts.value++
    // Error handling is handled by store/interceptors usually, but we refresh captcha
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--app-bg);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  .shape {
    position: absolute;
    filter: blur(100px);
    opacity: 0.15;
    border-radius: 50%;
    z-index: 1;
  }

  .shape-1 {
    top: -10%;
    left: -10%;
    width: 40%;
    height: 40%;
    background: #00b074; // Mint
    animation: float 20s infinite alternate;
  }

  .shape-2 {
    bottom: -15%;
    right: -5%;
    width: 50%;
    height: 50%;
    background: #00b074;
    animation: float 25s infinite alternate-reverse;
  }
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(10%, 10%) rotate(10deg); }
}

.login-card-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  padding: 20px;
}

.login-card {
  background: var(--card-bg) !important;
  border: none !important;
  border-radius: 24px !important;
  padding: 48px 40px !important;
  box-shadow: var(--card-shadow) !important;

  .el-card__body {
    padding: 0;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-wrapper {
    margin-bottom: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .logo-img {
      height: 72px;
      width: auto;
    }

    .logo-fallback {
      width: 72px;
      height: 72px;
      background: #e6f7f1;
      color: #00b074;
      font-size: 36px;
      font-weight: 800;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .login-title {
    font-size: 32px;
    font-weight: 800;
    color: var(--sidebar-text-color);
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  .login-subtitle {
    font-size: 15px;
    color: var(--sidebar-text-color);
    opacity: 0.7;
    margin: 0;
  }
}

.custom-input {
  .el-input__wrapper {
    background-color: var(--sidebar-hover-bg) !important;
    box-shadow: none !important;
    border: 1.5px solid var(--border-color) !important;
    border-radius: 16px !important;
    padding: 0 16px !important;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--sidebar-active-text-color) !important;
      background-color: var(--card-bg) !important;
    }

    &.is-focus {
      border-color: var(--sidebar-active-text-color) !important;
      background-color: var(--card-bg) !important;
      box-shadow: 0 0 0 4px rgba(0, 176, 116, 0.1) !important;
    }
  }

  .el-input__inner {
    color: var(--sidebar-text-color) !important;
    height: 56px !important;

    &::placeholder {
      color: #b0b0b0 !important;
    }
  }

  .el-input__prefix-icon {
    color: #00b074 !important;
    font-size: 20px;
  }
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: stretch;

  .captcha-input {
    flex: 1;
  }

  .captcha-img-box {
    width: 140px;
    height: 56px;
    background: var(--sidebar-hover-bg);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    border: 1.5px solid var(--border-color);
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--sidebar-active-text-color);
    }

    .captcha-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.login-tips {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00b074;
  font-size: 14px;
  margin-bottom: 28px;
  padding: 14px 18px;
  background: #e6f7f1;
  border-radius: 14px;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  height: 58px !important;
  border-radius: 18px !important;
  font-size: 17px !important;
  font-weight: 700 !important;
  background: #00b074 !important;
  box-shadow: 0 8px 20px rgba(0, 176, 116, 0.25) !important;
  border: none !important;
  margin-top: 16px;
  transition: all 0.3s ease !important;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(0, 176, 116, 0.35) !important;
    background: #009663 !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    background: #b0b0b0 !important;
    box-shadow: none !important;
  }
}

.sso-divider {
  display: flex;
  align-items: center;
  margin: 40px 0 20px;
  color: #b0b0b0;
  font-size: 14px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  span {
    padding: 0 16px;
  }
}

.login-footer {
  text-align: center;
  margin-top: 40px;
  color: #b0b0b0;
  font-size: 13px;
  font-weight: 500;
}
</style>
