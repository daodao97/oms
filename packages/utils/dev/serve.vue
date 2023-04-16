<template>
  {{ show1 }}
  <br>
  {{ show2 }}
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { strVarReplace } from '@'
const show1 = computed(() => {
  return strVarReplace('{{tag_label}} {{#if num_users}} {{ num_users }} 人{{/if}}', { tag_label: 'ok', num_users: 0 })
})
const show2 = computed(() => {
  return strVarReplace('{tag_label} {num_users}人', { tag_label: 'ok', num_users: 0 })
})
</script>
