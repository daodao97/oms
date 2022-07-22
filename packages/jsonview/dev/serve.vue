<template>
  <JsonView :data="data" />
</template>
<script setup>
import JsonView from '../src/index'
const data = {
  a: 1,
  b: {
    c: 2,
    e: [1, 2, 3]
  }
}
</script>
