<template>
  <span class="v-btn">
    <!-- 按钮 -->
    <el-dropdown
      v-bind="dropProps"
      @command="clickHandle"
    >
      <template v-if="dropProps.splitButton">
        更多
      </template>
      <template v-else>
        <el-button :type="dropProps.type">
          更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in buttons"
            :key="index + 'button-group'"
            :command="index + 1"
          >{{ item.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 弹窗容器 -->
    <component
      :is="'el-' + container"
      v-if="showContainer"
      v-model="showContainer"
      v-bind="containerProps"
      :before-close="beforeClose"
      :title="containerTitle"
    >
      <component
        :is="xsubComp"
        v-bind="xsubProps"
        v-on="xsubEvent"
      />
    </component>
  </span>
</template>
<script lang="ts">
// @ts-nocheck
// todo ts
import { BaseButtonProps, baseComps, baseProps, getContainerProps, Plugin, plugins, events } from './base'
import { getCurrentInstance, SetupContext } from 'vue'
import { isString, isFunc, strVarReplace } from '@okiss/utils'
import { ArrowDown } from '@element-plus/icons-vue'
import { merge } from 'lodash'

type Buttons = BaseButtonProps[]
interface DropProps {
  splitButton: boolean,
  type?: string
}

const defaultDropProps : DropProps = {
  splitButton: false
}

interface VButtonGroupProps {
  buttons: Buttons,
  props: DropProps
}

export default defineComponent({
  name: 'VButtonGroup',
  components: { ...baseComps, ArrowDown },
  props: {
    buttons: {
      type: Array as unknown as Buttons,
      default: () => []
    },
    ...baseProps
  },
  emits: events,
  setup(props: VButtonGroupProps, ctx: SetupContext) {
    const app = getCurrentInstance()
    const root = app.appContext.config.globalProperties

    const dropProps : DropProps = { ...defaultDropProps, ...props.props }
    const replaceText: (string) => string = (str) => {
      return strVarReplace(str, props.metaData)
    }
    const activeIndex = ref(undefined)
    const showContainer = ref(false)
    const showText = computed(() => {
      if (props.buttons?.length > 0) {
        return replaceText(props.buttons[0].text || '')
      }
      return ''
    })

    const instance : Plugin<any> = ref(null)
    const clickHandle = (index) => {
      index = index - 1
      if (!props.preCheck(props)) {
        return
      }
      const btn = props.buttons[index]
      const metaData = () => isFunc(btn['meta-data']) ? btn['meta-data']() : btn['meta-data']
      const realTarget : Function = () => strVarReplace(btn.target || '', metaData())
      instance.value = plugins[btn.type || 'base']
      let extra = btn.extra || {}
      if (extra.url === undefined) {
        extra.url = btn.target
      }

      const injectData = isFunc(btn['inject-data']) ? btn['inject-data'](extra) : btn['inject-data']

      extra = isFunc(btn['dynamic-extra']) ? btn['dynamic-extra']({ ...extra }) : extra
      if (extra.method === undefined || extra.method === 'GET') {
        extra.params = merge(extra.params, injectData)
      } else {
        extra.data = merge(extra.data, injectData)
      }
      const conf = { ...extra }

      const data = metaData()
      Object.keys(conf || {}).forEach(key => {
        if (isString(conf[key])) {
          conf[key] = strVarReplace(conf[key], data || {})
        }
      })
      instance.value.onclick(realTarget, root, ctx, conf, () => {
        activeIndex.value = index
        if (['modal', 'form', 'table'].indexOf(btn.type) > -1) {
          showContainer.value = true
        }
        if (['api'].indexOf(btn.type) > -1) {
          ctx.emit('action')
        }
        if (isFunc(props.buttons[index].onClick)) {
          props.buttons[index].onClick(index)
        }
      })
    }
    const beforeClose = () => {
      if (!props.beforeCloseContainer()) {
        return
      }
      showContainer.value = false
    }
    const containerTitle = computed<string>(() => {
      const btn = props.buttons[activeIndex.value]
      return replaceText(btn.text || '')
    })
    const containerProps = ref({})
    const xsubComp = ref('span')
    const xsubProps = ref({})
    const xsubEvent = ref({})
    watch(() => activeIndex.value, () => {
      const btn = props.buttons[activeIndex.value]
      containerProps.value = getContainerProps(props.container, props)
      const metaData = isFunc(btn['meta-data']) ? btn['meta-data']() : btn['meta-data']
      xsubComp.value = (instance.value && instance.value.getSubComp) ? instance.value.getSubComp(btn.extra || {}) : 'span'
      xsubProps.value = (instance.value && instance.value.getSubProps) ? instance.value.getSubProps(btn.extra, metaData) : {}
      xsubEvent.value = (instance.value && instance.value.getSubEvent) ? instance.value.getSubEvent(btn, ctx, showContainer) : {}
    })

    return {
      dropProps,
      showText,
      replaceText,
      clickHandle,
      showContainer,
      containerProps,
      beforeClose,
      xsubComp,
      xsubProps,
      xsubEvent,
      containerTitle
    }
  }
})
</script>
