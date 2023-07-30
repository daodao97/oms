<template>
  <div class="box">
    <div class="box-container">申请权限</div>
    <VForm
      v-model="data"
      v-bind="form"
    />
  </div>
</template>
<script lang="ts" setup>
import { VForm } from '@okiss/vbtf'
import { ref } from 'vue'
const data = ref({})
const form = {
  formItems: [
    {
      field: 'role_id',
      label: '角色'
    }
  ]
}
</script>
<style lang="scss" scoped>
.box {
  margin: 30px;

  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
