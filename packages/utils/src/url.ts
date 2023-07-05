import { isDate, isObject } from 'lodash'
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach((key) => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  const serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

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
