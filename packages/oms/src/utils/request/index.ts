import axios, { AxiosRequestConfig as C } from 'axios'
import { defaultOptions } from '../../default'
import { merge } from 'lodash'
import { interceptors } from './interceptors'
import { cacheAdapter } from './cache'

export interface AxiosRequestConfig extends C {
  cacheTime?: number,
  notHoldApiErr?: boolean
}

export function instance(conf: AxiosRequestConfig = {}) {
  const defaultConf: AxiosRequestConfig = defaultOptions.axios || {}
  const c = merge(defaultConf, conf || {})
  const defaultAxios = axios.create(c)
  const service = axios.create({
    ...c
    // adapter: (c) => cacheAdapter(c, defaultAxios)
  })

  interceptors.forEach(item => {
    service.interceptors.request.use(item.request.onFulfilled, item.request.onRejected)
    service.interceptors.response.use(item.response.onFulfilled, item.response.onRejected)
  })

  return service
}

export default instance()
