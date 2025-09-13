<template>
  <PageLoad :schema-api="schemaapi">
    <template #default="slotProps">
      <Report v-bind="slotProps" />
    </template>
  </PageLoad>
</template>
<script setup>
import PageLoad from '../components/PageLoad.vue'
import Report from '../components/report/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const schemaapi = computed(() => {
  let id = route.params.id
  if (!id) {
    const token = route.path.split('/')
    id = token[token.length - 1]
  }
  return '/focusbi_report/view/' + id
})
</script>
