<template>
  <div :class="'ident ' + (left ? 'line-left' : '')">
    <div
      v-if="!root"
      class="logic"
    >
      <i
        v-if="!disabled"
        :class="'iconfont ' + (localValue === 'and' ? 'ra-and' : 'ra-or')"
        @click="onclick"
      />
      <span v-else>{{ localValue === 'and' ? '且' : '或' }}</span>
    </div>
    <div class="line" />
  </div>
</template>
<script>
export default {
  props: {
    root: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: 'and'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      localValue: ''
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        this.localValue = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onclick() {
      this.localValue = this.localValue === 'and' ? 'or' : 'and'
      this.$emit('update:modelValue', this.localValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.line-left {
  border-left: 1px dashed #999;
}
.ident {
  position: relative;
  height: 50px;
  width: 100%;
  display: inline-block;
  vertical-align: middle;
  line-height: initial;

  .line {
    width: 100%;
    position: absolute;
    border-top: 1px dashed #999;
    vertical-align: middle;
    line-height: initial;
    top: 50%;
  }
  .logic {
    top: 11px;
    position: absolute;
    background: white;
    left: -15px;
  }
}

i {
  font-size: 28px;
  color: #999;
  vertical-align: middle;
  cursor: pointer;
  &.ra-and  {
    color: green;
  }
  &.ra-or  {
    color: red;
  }
}

</style>
