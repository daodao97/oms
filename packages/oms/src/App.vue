<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { addNewStyle, addNewStyleTag } from '@okiss/utils'
import { provide } from 'vue'

onBeforeMount(() => {
  const loading = document.getElementById('preloader')
  if (loading !== null) {
    document.body.removeChild(loading)
    addNewStyle('test-icon', '//at.alicdn.com/t/font_2246548_zclaqxwmzq8.css')

    const css = `.iconfont {
      font-size: 19px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      font-family: iconfont !important;
    }`

    addNewStyleTag(css)
  }
})
const locale = zhCn

if (window?.OmsOptions?.form?.vsPath) {
  provide('vsPath', window?.OmsOptions?.form?.vsPath)
}
</script>
