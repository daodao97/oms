<template>
  <ElForm>
    <VButton
      v-if="modal"
      type="modal"
      text="查看"
    >
      <component
        :is="getComponentName(item.type)"
        v-model="localValue"
        v-bind="getComponentProps(item)"
        @update:model-value="onFiledChange"
      />
    </VButton>
    <component
      :is="getComponentName(item.type)"
      v-else
      v-model="localValue"
      v-bind="getComponentProps(item)"
      @update:model-value="onFiledChange"
    />
  </ElForm>
</template>
<script lang="ts">

import VButton from '../../button/VButton.vue'
import { customFormComps, getComponentName, getComponentProps } from '../../form/util'

export default defineComponent({
  name: 'CellEdit',
  components: { ...customFormComps, VButton: VButton },
  provide() {
    return {
      formData: {}
    }
  },
  props: {
    modelValue: {
      type: [String, Number, Array, Object],
      default: undefined
    },
    item: {
      type: Object,
      default: () => {
      }
    },
    modal: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      localValue: this.$props.modelValue
    }
  },
  methods: {
    onFiledChange(val: string | number) {
      this.$emit('update:modelValue', val)
    },
    getComponentName(name: string) {
      return getComponentName(name)
    },
    getComponentProps(item: string) {
      return getComponentProps(item, { disabled: this.disabled })
    }
  }
})
</script>
