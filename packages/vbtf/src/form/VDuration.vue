<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-input
        v-model.number="hours"
        @update:model-value="(val) => handleInput(val, 'hours')"
      >
        <template #append>时</template>
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-input
        v-model.number="minutes"
        @update:model-value="(val) => handleInput(val, 'minutes')"
      >
        <template #append>分</template>
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-input
        v-model.number="seconds"
        @update:model-value="(val) => handleInput(val, 'seconds')"
      >
        <template #append>秒</template>
      </el-input>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      hours: '',
      minutes: '',
      seconds: ''
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (!newVal) {
          this.hours = this.minutes = this.seconds = 0
          return
        }
        const numVal = parseInt(newVal, 10)

        this.hours = Math.floor(numVal / 3600)
        this.minutes = Math.floor((numVal - this.hours * 3600) / 60)
        this.seconds = numVal - this.hours * 3600 - this.minutes * 60
      },
      immediate: true
    }
  },
  methods: {
    handleInput(value, field) {
      let newVal = 0
      if (field === 'hours') newVal = this.calcSeconds(value, this.minutes, this.seconds)
      if (field === 'minutes') newVal = this.calcSeconds(this.hours, value, this.seconds)
      if (field === 'seconds') newVal = this.calcSeconds(this.hours, this.minutes, value)

      this.$emit('update:modelValue', newVal)
    },
    calcSeconds(hours, minutes, seconds) {
      return hours * 3600 + minutes * 60 + seconds
    }
  }
}
</script>
