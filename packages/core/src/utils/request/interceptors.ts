import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from '../../store'
import { InterceptorUse, Interceptor } from './types'
import Message from 'element-plus/lib/el-message'
import { removeToken } from '../token'

function getToken() {
  return store.state.user.token
}

const baseRequestInterceptor: InterceptorUse<AxiosRequestConfig, AxiosError> = {
  onFulfilled: function(config: AxiosRequestConfig) {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['X-Test'] = 1
    return config
  }
}

const baseResponseInterceptor: InterceptorUse<AxiosResponse, AxiosError> = {
  onFulfilled: function(response: AxiosResponse) {
    if (response.data.code !== 0) {
      const message = response.data.message || '接口请求错误'
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      // return Promise.reject(response.data.message || '接口请求错误')
    }
    if (response.data.code === 401) {
      removeToken()
      location.href = '/'
    }
    return response.data
  },
  onRejected(error: AxiosError) {
    console.log(error)
    Message({
      message: `${error.message} ${error.config.method}::${error.config.baseURL}${error.config.url}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
}

export const interceptors: Interceptor[] = [
  {
    request: baseRequestInterceptor,
    response: baseResponseInterceptor
  }
]

export function addInterceptor(newInterceptor: Interceptor) {
  interceptors.push(newInterceptor)
}
