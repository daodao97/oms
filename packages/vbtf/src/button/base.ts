import { AxiosRequestConfig } from 'axios'
import { Component, SetupContext, defineAsyncComponent } from 'vue'
import { FormProps } from '../form/types'
import { strVarReplace, isFunc, isObject } from '@okiss/utils'
import { Ref, UnwrapRef } from 'vue'
import { ElMessage as Message } from 'element-plus'
import { get } from 'lodash'
import { ElLoading } from 'element-plus'

export interface formExtra {
  reset?: () => void
  submit?: (data: Record<string, any>) => void
}

export interface BaseButtonProps {
  type: string,
  target: string,
  text: string,
  extra: AxiosRequestConfig | formExtra,
  when: Array<any>,
}

export interface VButtonProps extends BaseButtonProps {
  container: string,
  preCheck: (props: VButtonProps) => boolean
  containerProps: Record<string, any>,
  beforeCloseContainer: () => boolean
  metaData: Record<string, any>
}

export const events = ['click', 'afterClick', 'apiError', 'apiSuccess', 'action', 'formReset', 'formSubmit'] as const
export type eventsType = typeof events;

export const baseProps = {
  props: {
    type: Object,
    default: () => {}
  },
  metaData: {
    type: [Object, Function],
    default: () => {}
  },
  injectData: {
    type: [Object, Function],
    default: () => {}
  },
  dynamicExtra: {
    type: Function,
    default: (val: any) => val
  },
  preCheck: {
    type: Function,
    default: () => {
      return true
    }
  },
  container: {
    type: String,
    default: 'dialog',
    validator: (value: string) => {
      return ['dialog', 'drawer'].indexOf(value) !== -1
    }
  },
  containerProps: {
    type: Object,
    default: () => {}
  },
  beforeCloseContainer: {
    type: Function,
    default: () => {
      return () => true
    }
  },
  confirm: {
    type: Boolean,
    default: true
  }
}

export const baseComps: Record<string, Component> = {
  VForm: defineAsyncComponent(() => import('../form/VForm.vue')),
  VTable: defineAsyncComponent(() => import('../table/VTable.vue')),
  VPlayer: defineAsyncComponent(() => import('../VPlayer.vue'))
}

export interface Plugin<T> {
  getSubProps?: (extra: T, metaData: Record<string, any>) => void,
  getSubComp?: (extra: T) => string,
  getSubEvent?: (props: VButtonProps, ctx: SetupContext, showContainer: Ref<UnwrapRef<boolean>>, extra?:Record<any, any>) => any,
  getContainerProps? :(container: string) => any,
  onclick(target: Function, root: any, ctx: SetupContext, extra: T, callback: () => void): void
}

const base : Plugin<any> = {
  onclick(target: Function, root: any, ctx: SetupContext, extra: any, callback: () => void) {
    if (extra?.actionHandler && isFunc(extra?.actionHandler)) {
      extra?.actionHandler()
    } else {
      setTimeout(() => ctx.emit('action'), 200)
    }
    callback()
  }
}

const jump : Plugin<void> = {
  onclick(target: Function, root) {
    const _target = target()
    if (/http.*/.test(_target)) {
      window.open(_target)
    } else {
      if (!root.$router) {
        console.error('you must set : app.config.globalProperties.$router = createRouter()')
        return
      }
      root.$router.push(_target).then()
    }
  }
}

const api : Plugin<AxiosRequestConfig> = {
  onclick(target: Function, root, ctx, extra, callback) {
    if (!root.$http) {
      console.error('you must set : app.config.globalProperties.$http = axios.create()')
      return
    }
    const conf = {
      url: target,
      ...extra
    }

    // @ts-ignore
    if (extra.sourceData !== undefined && isObject(extra.sourceData)) {
      const data = {}
      // @ts-ignore
      Object.keys(extra.sourceData as Object).forEach(item => {
        // @ts-ignore
        const tmp = get(extra.metaData || {}, extra.sourceData[item])
        // @ts-ignore
        data[item] = tmp
      })
      conf.data = { ...(conf.data || {}), ...data }
    }

    let loading = null
    // @ts-ignore
    if (extra.isGrup) {
      loading = ElLoading.service({
        lock: true,
        text: '正在提交',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }

    // @ts-ignore
    root.$http.request(conf).then((response : any) => {
      ctx.emit('apiSuccess', response)
      callback()
      // @ts-ignore
      if (extra.isGrup && loading) {
        loading.close()
      }
      Message({
        // @ts-ignore
        message: response?.data?.message || '操作成功',
        type: 'success',
        duration: 5 * 1000
      })
    }).catch((err: any) => {
      // @ts-ignore
      if (extra.isGrup && loading) {
        loading.close()
      }
      ctx.emit('apiError', err)
      callback()
    }).finally(() => {
      // @ts-ignore
      if (extra.isGrup && loading) {
        loading.close()
      }
      callback()
    })
  },
  getSubProps(extra: any, metaData) {
    if (extra.infoApi) {
      extra.infoApi = strVarReplace(extra.infoApi, metaData)
    }
    return extra
  }
}

const form: Plugin<any> = {
  onclick(target: Function, root: any, ctx: SetupContext, extra: any, callback: () => void) {
    callback()
  },
  getSubComp() {
    return 'VForm'
  },
  getSubProps(extra: any, metaData) {
    Object.keys(extra).forEach(key => {
      if (/.*Api$/.test(key)) {
        extra[key] = strVarReplace(extra[key], { ...metaData, ...metaData.$row })
      }
    })
    const val : Record<string, any> = {}
    const formItems = isFunc(extra.formItems) ? extra.formItems(metaData) : (extra.formItems || [])
    const formData = metaData || {}
    formItems.forEach((item: any) => {
      if (formData && formData[item.field] !== undefined) {
        val[item.field] = formData[item.field]
      }
    })
    console.log(111, { modelValue: val, ...extra })
    return { modelValue: val, ...extra }
  },
  getSubEvent(props, ctx: SetupContext, showContainer, extra) {
    return {
      submit(data: any, response: any) {
        console.log(data, response)
        if (response && response.code !== 0) {
          return
        }
        console.log(222)
        showContainer.value = false
        if (extra?.actionHandler && isFunc(extra?.actionHandler)) {
          extra?.actionHandler(data)
        } else {
          setTimeout(() => ctx.emit('action'), 200)
        }
      },
      reset() {
        showContainer.value = false
      }
    }
  }
}

const modal: Plugin<any> = {
  onclick(target: Function, root:any, ctx: SetupContext, extra: any, callback: () => void) {
    callback()
  },
  getSubComp(extra: Record<string, any>) {
    const type = extra.type
    return type ? 'v-' + type : ''
  },
  getSubProps(extra: any, metaData) {
    const props : Record<string, any> = {}
    Object.keys(extra).forEach(key => {
      if (/.*Api$/.test(key)) {
        props[key] = strVarReplace(extra[key], metaData)
      } else if (extra[key] !== 'type') {
        props[key] = extra[key]
      }
    })
    console.log(props, metaData)
    return props
  },
  getSubEvent(props, ctx: SetupContext, showContainer) {
    return {}
  }
}

const table: Plugin<FormProps> = {
  onclick(target: Function, root:any, ctx: SetupContext, extra: FormProps, callback: () => void) {
    callback()
  },
  getSubComp() {
    return 'VTable'
  },
  getSubProps(extra: any, metaData) {
    Object.keys(extra).forEach(key => {
      if (/.*Api$/.test(key)) {
        extra[key] = strVarReplace(extra[key], metaData)
      }
    })
    return extra
  },
  getSubEvent(props, ctx: SetupContext, showContainer) {
    return {
      reset() {
        showContainer.value = false
        if ('reset' in props.extra && props.extra.reset) {
          props.extra?.reset()
        }
      },
      submit(form: Record<string, any>) {
        if ('submit' in props.extra && props.extra.submit) {
          props.extra?.submit(form)
        }
      }
    }
  }
}

export const plugins: Record<string, Plugin<any>> = { jump, api, form, table, modal, base }

export function getContainerProps(container: string, props: VButtonProps) {
  let defaultP : Record<string, any> = {
    'append-to-body': true,
    'destroy-on-close': true
  }
  if (container === 'dialog') {
    defaultP = {
      width: '80%',
      ...defaultP
    }
  }
  if (container === 'drawer') {
    defaultP = {
      size: '80%',
      ...defaultP
    }
  }

  return { ...defaultP, ...props.containerProps }
}

export function RegComponents(cps : Record<string, Component>) {
  Object.keys(cps).forEach(key => {
    baseComps[key] = cps[key]
  })
}
