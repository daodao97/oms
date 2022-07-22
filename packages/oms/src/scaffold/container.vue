<template>
  <router-view />
</template>
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'
const key = ref(0)
onBeforeRouteUpdate(() => {
  key.value++
})
</script>
