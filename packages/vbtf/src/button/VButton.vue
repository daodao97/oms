<template>
  <span class="v-btn">
    <!-- 按钮 -->
    <el-popconfirm
      v-if="$props.type === 'api' && confirm"
      :title="'确定要' + (relText ? relText : '操作') + '吗'"
      @confirm="clickHandler"
    >
      <template #reference>
        <ElButton
          v-if="relText"
          v-bind="transBtnProps($props.props)"
        >{{ relText }}</ElButton>
        <ElButton
          v-else
          v-bind="transBtnProps($props.props)"
        />
      </template>
    </el-popconfirm>
    <template v-else>
      <ElButton
        v-if="relText"
        v-bind="transBtnProps($props.props)"
        @click="clickHandler"
      >{{ relText }}</ElButton>
      <ElButton
        v-else
        v-bind="transBtnProps($props.props)"
        @click="clickHandler"
      />
    </template>
    <!-- 弹窗容器 -->
    <component
      :is="'el-' + container"
      v-if="showContainer"
      v-model="showContainer"
      v-bind="containerProps"
      :before-close="beforeClose"
      :title="relText"
    >
      <slot />
      <component
        :is="xsubComp"
        v-if="xsubComp !== ''"
        v-bind="xsubProps"
        v-on="xsubEvent"
      />
    </component>
  </span>
</template>
<script lang="ts">
// @ts-nocheck
// todo ts
import { baseProps, plugins, Plugin, VButtonProps, getContainerProps, baseComps, events, eventsType } from './base'
import { snakeToCamel, strVarReplace, isString, isFunc } from '@okiss/utils'
import { SetupContext } from 'vue'
import * as Icon from '@element-plus/icons-vue'
import { merge } from 'lodash'

type VButtonType = PropType<'jump' | 'api' | 'form' | 'table' | 'model'>
import { getCurrentInstance } from 'vue'

export default defineComponent({
  name: 'VButton',
  components: baseComps,
  props: {
    type: {
      type: String as VButtonType,
      default: '',
      validator: (val: string) => {
        return [
          'jump', 'api', 'form', 'table', 'modal', '', 'base'
        ].includes(val)
      }
    },
    target: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: undefined
    },
    extra: {
      type: Object,
      default() {
        return {}
      }
    },
    ...baseProps
  },
  emits: events as eventsType,
  setup(props: VButtonProps, ctx: SetupContext) { // @ts-ignore
    const app = getCurrentInstance()
    const root = app.appContext.config.globalProperties

    const showContainer = ref(false)
    const instance : Plugin<any> = plugins[props.type || 'base']
    if (!instance) {
      console.error(`您所配置的 button.type=${props.type} 不存在, 仅支持` + Object.keys(plugins).join(', '))
      return {}
    }
    const metaData = () => isFunc(props.metaData) ? props.metaData() : props.metaData
    const injectData = () => isFunc(props.injectData) ? props.injectData(props.extra) : props.injectData
    const clickHandler = (e) => {
      ctx.emit('click', e)
      if (!props.preCheck(props)) {
        return
      }
      const realTarget : Function = () => strVarReplace(props.target || '', metaData())
      let extra = props.extra || {}
      if (extra.url === undefined) {
        extra.url = props.target
      }
      extra = props.dynamicExtra({...extra})

      const _injectData = injectData()
      if (extra.method === undefined || extra.method === 'GET') {
        extra.params = merge(extra.params, _injectData)
      } else {
        extra.data = merge(extra.data, _injectData)
      }

      const conf = { ...extra, metaData: metaData() }
      Object.keys(conf).forEach(key => {
        if (isString(conf[key])) {
          conf[key] = strVarReplace(conf[key], metaData())
        }
      })
      instance.onclick(realTarget, root, ctx, conf, () => {
        if (['modal', 'form', 'table'].indexOf(props.type) > -1) {
          showContainer.value = true
        }
        if (['api'].indexOf(props.type) > -1) {
          ctx.emit('action')
        }
      })
    }
    const relText = computed(() => strVarReplace(props.text || '', metaData()))
    const containerProps = ref({})
    const xsubComp = ref('span')
    const xsubProps = ref({})
    const xsubEvent = ref({})
    watch(() => showContainer.value, () => {
      containerProps.value = getContainerProps(props.container, props)
      xsubComp.value = instance.getSubComp ? instance.getSubComp(props.extra || {}) : 'span'
      xsubProps.value = instance.getSubProps ? instance.getSubProps(props.extra, metaData()) : {}
      xsubEvent.value = instance.getSubEvent ? instance.getSubEvent(props, ctx, showContainer, props.extra) : {}
    })
    const beforeClose = () => {
      if (!props.beforeCloseContainer()) {
        return
      }
      showContainer.value = false
    }
    const closeModal = () => {
      showContainer.value = false
    }
    const transBtnProps = (old) => {
      if (old && old.icon && isString(old.icon)) {
        const iconName = snakeToCamel(old.icon.replace('el-icon-', ''), '-')
        old.icon = shallowRef(Icon[iconName])
      }
      return old
    }
    return {
      clickHandler,
      relText,
      showContainer,
      containerProps,
      beforeClose,
      xsubComp,
      xsubProps,
      xsubEvent,
      closeModal,
      transBtnProps
    }
  }
})
</script>

