<template>
  <div id="login">
    <h1 id="title">登录</h1>
    <form id="form">
      <input
        v-model="data.username"
        type="text"
        placeholder="用户名"
        class="input"
      >
      <input
        v-model="data.password"
        type="password"
        placeholder="密码"
        class="input"
      >
      <div v-if="captcha" class="captcha">
        <input
          v-model="data.captcha"
          type="text"
          placeholder="验证码"
          class="input-captcha"
        >
        <img
          class="captcha-img"
          :src="baseAPI + '/user/captcha?ts=' + ts"
          title="点击刷新"
          @click="onCaptchaClick"
        >
      </div>
      <div
        :class="{input: true, button: true, 'no-ready': !onReady}"
        @click="login"
      >登录</div>
      <div class="tips">
        <div>{{ tips }}</div>
      </div>
      <div class="sso">
        <div id="sso-qrcode" />
        <div
          v-for="item in Object.keys([])"
          :key="item"
        >
          {{ item }}
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore, useAppStore, useUserStore } from '../store'
import CryptoJS from 'crypto-js'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const appStore = useAppStore()
const userStore = useUserStore()
const tips = computed(() => settingsStore.loginTips)
const captcha = computed(() => settingsStore.captcha)
const baseAPI = computed(() => appStore.baseURL)

const ts = ref(0)
const onCaptchaClick = () => ts.value++
const onReady = computed(() => {
  return data.value.username.length > 0 && data.value.password.length >= 4 && (captcha.value ? data.value.captcha.length === 4 : true)
})

const data = ref({
  username: '',
  password: '',
  captcha: '',
  sing: ''
})

const login = () => {
  if (data.value.username === '' || data.value.password === '' || (captcha.value && data.value.captcha === '')) {
    ElMessage.error('用户名, 密码, 验证码是必须的')
    return
  }
  if (captcha.value) {
    data.value.sing = CryptoJS.MD5(`${data.value.username}${data.value.password}${data.value.captcha}`).toString()
  }
  userStore.login(data.value).then(res => {
    router.push({ path: route.query?.redirect as string || '/' })
  }).catch(e => {
    ts.value++
  })
  return
}
</script>

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;

#login {
  width: 100%;
  height: 100%;
  background: $bg;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-top: 150px;

  #title {
    color: #fff;
  }

  #form {
    width: 300px;
    margin: 10px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .input {
      width: 300px;
      height: 40px;
      margin: 10px auto;
      padding: 10px;
    }

    .captcha {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;

      .input-captcha {
        width: 60%;
        height: 40px;
        margin-right: 10px;
      }

      .captcha-img {
        height: 40px;
        width: auto;
      }
    }

    .button {
      width: 300px;
      height: 40px;
      border: 1px solid #fff;
      background: #fff;
    }

    .no-ready {
      background: #909399 !important;
      border: 1px solid #909399 !important;
      color: #DCDFE6;
    }
  }

  .tips,
  .sso {
    padding: 10px 0;
    display: flex;
    justify-content: flex-start;
    color: gray;
  }
}
</style>
