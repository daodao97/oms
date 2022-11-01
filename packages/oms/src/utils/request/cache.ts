import { InterceptorUse } from './types'
import axios, { AxiosError, AxiosInstance, AxiosResponse, Canceler } from 'axios'
import { AxiosRequestConfig } from './index'
// @ts-ignore
import qs from 'qs'

const CancelToken = axios.CancelToken

const task = {
  taskList: {} as Record<string, any>,
  cacheList: new Map(),
  uniqueId(config: AxiosRequestConfig) {
    return `${location.href}|${config.method}|${config.url}|`
    // + qs.stringify(config.params)
  },
  addTask(config: AxiosRequestConfig, cancelfun: Canceler) {
    const key = this.uniqueId(config)
    this.taskList[key] = cancelfun
  },
  delTask(config: AxiosRequestConfig) {
    const key = this.uniqueId(config)
    const c = this.taskList[key]
    c && c(config)
  },
  pending(config: AxiosRequestConfig) {
    const key = this.uniqueId(config)
    return !!this.taskList[key]
  },
  cache(config: AxiosRequestConfig) {
    const key = this.uniqueId(config)
    const c = this.cacheList.get(key)
    if (!c) {
      return undefined
    }
    if (c.expirationTime < (new Date()).getTime()) {
      this.delCache(config)
      return undefined
    }
    console.log('getcache', key, c.response)
    return c.response
  },
  addCache(config: AxiosRequestConfig, response: any) {
    const key = this.uniqueId(config)
    const cacheTime = config.cacheTime || 0
    if (cacheTime) {
      this.cacheList.set(key, { response, expirationTime: (new Date()).getTime() + cacheTime })
    }
  },
  delCache(config: AxiosRequestConfig) {
    const key = this.uniqueId(config)
    return this.cacheList.delete(key)
  }
}

export const cacheAdapter: (config: AxiosRequestConfig, instance: AxiosInstance) => Promise<any> = (config: AxiosRequestConfig, instance: AxiosInstance) => {
  return new Promise((resolve, reject) => {
    if (config.method !== 'get') {
      delete config.adapter
      resolve(instance(config))
      return
    }
    const cache = task.cache(config)
    if (!cache) {
      delete config.adapter
      resolve(instance(config))
      return
    }
    resolve({ data: cache, config: config })
  })
}

export const cancelRequestInterceptor: InterceptorUse<AxiosRequestConfig, AxiosError> = {
  onFulfilled: function(config: AxiosRequestConfig) {
    if (config.cacheEnable === false) {
      return config
    }
    if (task.pending(config)) {
      task.delTask(config)
    }
    config.cancelToken = new CancelToken((cancel) => {
      task.addTask(config, cancel)
    })
    return config
  },
  onRejected(error: AxiosError) {
    return Promise.reject(error)
  }
}

export const cancelResponseInterceptor: InterceptorUse<AxiosResponse, AxiosError> = {
  onFulfilled: function(response: AxiosResponse) {
    console.log(response.config)
    // @ts-ignore
    if (response.config.cacheEnable === false) {
      return response
    }
    if (response.config.method === 'get' && Object.keys(response.data as Record<string, any>).length > 0) {
      task.addCache(response.config, response.data)
    }
    return response
  },
  onRejected(error: AxiosError) {
    return Promise.reject(error)
  }
}
