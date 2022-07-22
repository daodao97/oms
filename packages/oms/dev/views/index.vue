<template>
  <div>
    Just for fun!
  </div>
  <VForm :form-items="formItems" />
</template>
<script setup>
import { VForm } from '@okiss/vbtf'
console.log(123, VForm)
const options = {}
const formItems = [
  {
    field: 'test'
  }
]
</script>
