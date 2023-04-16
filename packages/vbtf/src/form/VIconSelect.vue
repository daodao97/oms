<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    :width="650"
  >
    <template #reference>
      <el-input
        v-model="localValue"
        :disabled="disabled"
        style="width: 60%"
        @focus="focus"
      >
        <template #prepend>
          <v-icon
            :key="key"
            :name="localValue || ''"
          />
        </template>
      </el-input>
    </template>
    <el-scrollbar style="max-height: 300px; overflow: auto">
      <el-input
        v-model="filter"
        placeholder="搜索..."
        @focus="focus"
      />
      <el-row class="icon-list">
        <el-col
          v-for="(item, index) in elIconList.filter(each => each.indexOf(filter) !== -1)"
          :key="index"
          :span="2"
          @click="e => onselected(item)"
        >
          <v-icon
            :class="{'icon-cell': true, 'active': item === localValue}"
            :name="item"
          />
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-popover>
</template>
<script lang="ts">
export default {
  name: 'VIconSelect',
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      filter: '',
      showIcons: false,
      localValue: this.$props.modelValue,
      elIconList: [],
      key: 0
    }
  },
  beforeCreate() {
    fetch('http://assest.daodao.run/element-plus-icons.json').then((response) => response.json()).then(json => {
      this.elIconList = json
    }).catch(function() {
    })
  },
  methods: {
    onselected(name) {
      this.localValue = name
      this.key++
      this.$emit('update:modelValue', this.localValue)
      this.$refs.popover.hide()
    },
    focus() {
      // this.$refs.popover.show()
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-cell {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 32px;
  display: block;
  color: #606266;
  transition: color .15s linear;

  &:hover {
    color: cornflowerblue;
    border: 1px solid cornflowerblue;
  }

  &.active {
    color: cornflowerblue;
    border: 1px solid cornflowerblue;
  }
}
</style>
