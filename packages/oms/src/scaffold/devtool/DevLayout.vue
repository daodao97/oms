<template>
  <el-container style="width: 100%;height: 100%">
    <el-row class="aside">
      <slot name="left-aside" />
    </el-row>
    <el-main
      class="main"
      style="margin: 0 10px"
    >
      <slot name="main" />
    </el-main>
    <el-aside
      class="aside"
      width="350px"
      style="padding: 20px"
    >
      <slot name="right-aside" />
    </el-aside>
  </el-container>
</template>
<style scoped>
.main {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
}
.aside {
  padding-top: 20px;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
}
</style>
