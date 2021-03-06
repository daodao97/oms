import { defineAsyncComponent } from 'vue'
import router from '../../router'
import { useHttp } from '../../oms'
import { AxiosRequestConfig } from 'axios'
import { Component, SetupContext } from '@vue/runtime-core'
import { FormProps } from '../form/types'
import { TableProps } from '../table/types'
import { strVarReplace } from '../../utils/string'
import { Ref, UnwrapRef } from '@vue/reactivity'

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

export const events: string[] = ['click', 'aflterClick', 'apiError', 'apiSuccess', 'action', 'formReset', 'formSubmit']

export const baseProps = {
  props: {
    type: Object,
    default: () => {}
  },
  metaData: {
    type: Object,
    default: () => {}
  },
  injectData: {
    type: [Object, Function],
    default: () => {}
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
  }
}

export const baseComps: Record<string, Component> = {
  VForm: defineAsyncComponent(() => import('../form/index.vue')),
  VTable: defineAsyncComponent(() => import('../table/index.vue')),
  SocketList: defineAsyncComponent(() => import('../normal/SocketList.vue'))
}

export interface Plugin<T> {
  getSubProps?: (extra: T, metaData: Record<string, any>) => void,
  getSubComp?: () => string,
  getSubEvent?: (props: VButtonProps, ctx: SetupContext, showContainer: Ref<UnwrapRef<boolean>>) => any,
  getContainerProps? :(container: string) => any,
  onclick(target: string, ctx: SetupContext, extra: T, callback: () => void): void
}

const jump : Plugin<void> = {
  onclick(target: string) {
    if (/http.*/.test(target)) {
      window.open(target)
    } else {
      router.push(target).then()
    }
  }
}

const api : Plugin<AxiosRequestConfig> = {
  onclick(target: string, ctx, extra) {
    console.log(99999, target, extra)
    useHttp().request({
      url: target,
      ...extra
    }).then(response => {
      ctx.emit('apiSuccess', response)
    }).catch(err => {
      ctx.emit('apiError', err)
    })
  }
}

const form: Plugin<TableProps> = {
  onclick(target: string, ctx: SetupContext, extra: TableProps, callback: () => void) {
    callback()
  },
  getSubComp() {
    return 'VForm'
  },
  getSubProps(extra: TableProps, metaDataa) {
    if (extra.infoApi) {
      extra.infoApi = strVarReplace(extra.infoApi, metaDataa)
    }
    return extra
  },
  getSubEvent(props, ctx: SetupContext, showContainer) {
    return {
      submit(data: any) {
        ctx.emit('formSubmit', data)
      },
      reset() {
        showContainer.value = false
        ctx.emit('formReset')
      }
    }
  }
}

const modal: Plugin<any> = {
  onclick(target: string, ctx: SetupContext, extra: any, callback: () => void) {
    callback()
  },
  getSubComp() {
    return ''
  },
  getSubProps(extra: any, metaDataa) {
    return {}
  },
  getSubEvent(props, ctx: SetupContext, showContainer) {
    return {
      submit(data: any) {
      },
      reset() {
        showContainer.value = false
      }
    }
  }
}

const table: Plugin<FormProps> = {
  onclick(target: string, ctx: SetupContext, extra: FormProps, callback: () => void) {
    callback()
  },
  getSubComp() {
    return 'VTable'
  },
  getSubProps(extra: FormProps, metaDataa) {
    if (extra.infoApi) {
      extra.infoApi = strVarReplace(extra.infoApi, metaDataa)
    }
    if (extra.saveApi) {
      extra.saveApi = strVarReplace(extra.saveApi, metaDataa)
    }
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

export const plugins: Record<string, Plugin<any>> = { jump, api, form, table, modal }

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
