import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { pinia, useUserStore } from '../../store'
import { Interceptor, InterceptorUse } from './types'
import { Message, MessageBox } from '../../plugins/element-plus'
import { removeToken } from '../token'
import { cancelRequestInterceptor, cancelResponseInterceptor } from './cache'
import { isString } from '@okiss/utils'
import router from '../../router'

function getToken() {
  return useUserStore(pinia).token
}

function expired() {
  return useUserStore(pinia).expired
}

function errMsg(message: string) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000,
    grouping: true
  })
}

const baseRequestInterceptor: InterceptorUse<AxiosRequestConfig, AxiosError> = {
  onFulfilled: function(config: AxiosRequestConfig) {
    config.headers = config.headers || {}
    const token = getToken()
    if (token) {
      config.headers['X-Token'] = token
    }
    if (router.currentRoute.value.meta?.path) {
      config.headers['X-Path'] = router.currentRoute.value.meta.path
    }
    return config
  }
}

const baseResponseInterceptor: InterceptorUse<AxiosResponse, AxiosError> = {
  onFulfilled(response) {
    const notHoldApiErr = response.config?.notHoldApiErr !== undefined && response.config?.notHoldApiErr === true
    if (!notHoldApiErr && response.data.code !== 0) {
      const message = response.data.message || `接口请求错误 ${response.config.method}::${response.config.url?.split('?')[0]}`
      if (response.data.code === 401) {
        if (expired()) {
          return
        }
        useUserStore(pinia).SetExpired()
        MessageBox.alert('登录信息已过期或未登录, 是否跳转登录', '操作提醒', {
          showClose: false,
          confirmButtonText: '重新登录',
          showCancelButton: true,
          cancelButtonText: '取消',
          callback: (action: string) => {
            if (action === 'confirm') {
              removeToken()
              // location.href = location.origin + location.pathname
              location.href = location.origin + location.pathname + location.hash.replace('#', '#/?redirect=')
              location.reload()
            }
            useUserStore(pinia).SetExpired()
          }
        })
        return
      } else {
        errMsg(message)
      }
      return Promise.reject(message)
    }

    let _message_box = response.data?.data?._message_box
    if (_message_box !== undefined) {
      if (isString(_message_box)) {
        _message_box = {
          message: response.data?.data?._message_box
        }
      }
      MessageBox({
        title: '提示',
        type: 'success',
        grouping: true,
        ..._message_box
      })
    }

    return response.data
  },
  onRejected(error: AxiosError) {
    if (axios.isCancel(error)) {
      return Promise.reject('')
    }
    errMsg(`${error.message} ${error.config.method}::${error.config.url?.split('?')[0]}`)
    return Promise.reject(error)
  }
}

export const interceptors: Interceptor[] = [
  {
    request: cancelRequestInterceptor,
    response: cancelResponseInterceptor
  },
  {
    request: baseRequestInterceptor,
    response: baseResponseInterceptor
  }
]

export function addInterceptor(newInterceptor: Interceptor) {
  interceptors.push(newInterceptor)
}
