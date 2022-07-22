<template>
  <VIcon :name="meta.icon || 'ra-all'" />
  <span class="menu-content">{{ meta.title }}</span>
</template>

<script setup lang="ts">
defineProps({
  meta: {
    type: Object,
    default: () => {
      return {
        icon: '',
        title: ''
      }
    }
  }
})
</script>
