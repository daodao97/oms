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
      <div
        class="input button"
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
import store from '../store'
import sso, { allSso } from '../utils/sso'

const router = useRouter()
const route = useRoute()
const tips = computed(() => store.state.settings.loginTips)
const allsso = () => allSso()

const data = ref({
  username: '',
  password: ''
})

const login = () => {
  if (data.value.username === '' || data.value.password === '') {
    ElMessage.error('请填写用户名和密码')
    return
  }
  store.dispatch('user/login', data.value).then(res => {
    router.push({ path: route.query?.redirect as string || '/' })
  })
  return
}

const loginType = ref()

const changLoginChannel = () => {
  if (loginType.value) {
    return
  }
  const redirect_url = location.origin + location.pathname + '#' + (route.params.redirect || '')
  const params = {
    elId: 'sso-qrcode',
    redirect_uri: redirect_url,
    iframe: {
      width: '280px',
      height: '320px'
    }
  }
  sso(params)?.showQrCode()
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
    .button {
      width: 300px;
      height: 40px;
      border: 1px solid #fff;
      background: #fff;
    }
  }
  .tips, .sso {
    padding: 10px 0;
    display: flex;
    justify-content: flex-start;
    color: gray;
  }
}
</style>
