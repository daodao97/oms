<template>
  <VIcon
    name="ra-code"
    @click="show = !show"
  />
  <el-drawer
    v-model="show"
    title="PageSchema"
    class="my-drawer"
    :direction="direction"
    size="50%"
    destroy-on-close
    append-to-body
  >
    <json-view
      :key="key"
      :data="pageSchema"
      v-bind="{
        theme: '',
        fontSize: 14,
        lineHeight: 24,
        deep: 3,
        closed: false,
        iconStyle: 'circle',
        closed: false
      }"
    />
  </el-drawer>
</template>
<script setup>
import JsonView from '../../../components/jsonview/index.vue'
import { useAppStore } from '../../store'
import { useRoute } from 'vue-router'

const show = ref(false)
const key = ref(1)
const direction = 'rtl'
const route = useRoute()
const appStore = useAppStore()
const pageSchema = computed(() => appStore.pages[route.path])
</script>
