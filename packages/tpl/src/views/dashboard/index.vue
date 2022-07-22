<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Hi {{ name }}</div>
  </div>
</template>
<script setup>
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
