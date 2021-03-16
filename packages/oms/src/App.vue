<template>
  <router-view />
</template>

<script>
import { addNewStyle } from './utils'

export default {
  name: 'App',
  created() {
    const loading = document.getElementById('preloader')
    if (loading !== null) {
      document.body.removeChild(loading)
      addNewStyle('test-icon', '//at.alicdn.com/t/font_2246548_oqyia8sctzf.css')
    }
  }
}
</script>
