// @ts-ignore
import * as buildURL from 'axios/lib/helpers/buildURL'
console.log(buildURL)
export function queryParams(str: string) {
  const queryString = str.indexOf('?') !== -1 ? str.slice(str.indexOf('?') + 1) : (str.indexOf('/') !== -1 ? '' : str)
  const pairs = queryString.split('&')
  const result: Record<string, any> = {}
  pairs.forEach(function(pair) {
    let [key, val] = pair.split('=')
    if (!key) {
      return
    }
    let isArr = false
    if (key.includes('[]')) {
      key = key.replace('[]', '')
      isArr = true
    }
    val = decodeURIComponent(val || '')
    if (isArr) {
      result[key] = result[key] || []
      result[key].push(val)
    } else {
      result[key] = val
    }
  })
  return JSON.parse(JSON.stringify(result))
}

export function getQueryParam(name: string): string | null {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.href
      ) || ['', ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}

export function setUrlParams(obj: Record<string, string>) {
  const qs = new URLSearchParams(obj)
  let hash = location.hash
  const index = hash.indexOf('?')
  if (index !== -1) {
    hash = hash.substring(0, index)
  }
  const url = location.pathname + hash + (qs.toString() ? '?' + qs.toString() : '')
  history.pushState({ url: url, title: document.title }, document.title, url)
}

export function setUrlParamsLikeAxios(obj: Record<string, any>) {
  const query = buildURL('', obj)
  let hash = location.hash
  const index = hash.indexOf('?')
  if (index !== -1) {
    hash = hash.substring(0, index)
  }
  const url = location.pathname + hash + query
  history.pushState({ url: url, title: document.title }, document.title, url)
}

export function obj2Param(obj: Record<string, any>) {
  const params: string[] = []
  Object.keys(obj || {}).forEach(key => {
    params.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(obj[key] == null ? '' : obj[key])
    )
  })
  return params.join('&')
}
