<template>
  <template
    v-for="(item, index) in localButton"
    :key="index + 'v-button'"
  >
    <v-button-group
      v-if="isArray(item)"
      devtool="{devId: `${prefixPath}[${index}]`, dev: dev}"
      v-bind="{ buttons: item }"
      @click="onclick"
      @action="onaction"
    />
    <v-button
      v-else
      devtool="{devId: `${prefixPath}[${index}]`, dev: dev}"
      v-bind="item"
      @click="onclick"
      @action="onaction"
    />
  </template>
</template>
<script lang="ts">
import VButton from './VButton.vue'
import VButtonGroup from './VButtonGroup.vue'
import { isArray } from '@okiss/utils'

export default defineComponent({
  components: {
    VButton, VButtonGroup
  },
  inject: {
    dev: { from: 'dev', default: false }
  },
  props: {
    buttons: {
      type: Array,
      default: () => []
    },
    prefixPath: {
      type: String,
      default: ''
    }
  },
  emits: ['click', 'action'],
  data() {
    return {
      localButton: []
    }
  },
  watch: {
    buttons: {
      deep: true,
      immediate: true,
      handler(odlVal, newVal) {
        const local : any = []
        this.$props.buttons.forEach(item => {
          delete item['when']
          local.push(item)
        })
        this.localButton = local
      }
    }
  },
  methods: {
    isArray(tmp: any) {
      return isArray(tmp)
    },
    onclick(btn: any) {
      this.$emit('click', btn)
    },
    onaction(data: any) {
      this.$emit('action', data)
    }
  }
})
</script>
