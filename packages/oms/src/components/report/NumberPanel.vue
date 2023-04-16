<template>
  <span
    v-for="(each, i) in dataList"
    :key="i"
  >
    <div class="number-panel-title">
      <div
        v-for="(item, index) in Object.keys(each)"
        :key="index"
        class="title-inner"
      >
        <p class="number">{{ each[item] }}</p>
        <p class="name">{{ item }}</p>
      </div>
    </div>
  </span>
</template>

<script>
export default defineComponent({
  name: 'NumberPanel',
  props: {
    dataList: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.number-panel-title {
  padding: 20px;
  text-align: center;
  .title-inner {
    display: inline-block;
    width: 20%;
    position: relative;
    text-align: center;
    border-right: 1px solid #e8e8e8;
    &:last-child {
      border: none;
    }
  }
  .el-divider {
    position: absolute;
    right: 0;
    top: 10px;
  }
  .name {
    font-size: 12px;
    color: #666;
  }
  .number {
    font-size: 20px;
    line-height: 30px;
  }
}
</style>
