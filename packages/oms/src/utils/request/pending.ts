import axios, { AxiosRequestConfig } from 'axios'
// @ts-ignore
import qs from 'qs'

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()

function key(config: AxiosRequestConfig) : string {
  return [
    config.method,
    config.url,
    qs.stringify(config.params)
  ].join('|')
}

/**
 * 添加请求
 * @param {Object} config
 */
export const addPending = (config: AxiosRequestConfig) => {
  const url = key(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
    if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
      pending.set(url, cancel)
    }
  })
}

/**
 * 移除请求
 * @param {Object} config
 */
export const removePending = (config: AxiosRequestConfig) => {
  const url = key(config)
  if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
}
