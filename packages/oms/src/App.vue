<template>
  <router-view />
</template>

<script setup lang="ts">
import { addNewStyle, addNewStyleTag } from '@okiss/utils'
import { provide } from 'vue'
import { useThemeMode } from './composables/useThemeMode'

useThemeMode()

onBeforeMount(() => {
  const loading = document.getElementById('preloader')
  if (loading !== null) {
    document.body.removeChild(loading)
    document.getElementById('preloader')?.remove()
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

if (window?.OmsOptions?.form?.vsPath) {
  provide('vsPath', window?.OmsOptions?.form?.vsPath)
}
</script>
