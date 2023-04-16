import { get, cloneDeep } from 'lodash'
import { isArray, isObject, isString } from './type'
import { Message as ElMessage } from 'element-plus'

export function ruleCompute(obj: Record<string, any>, rule: string[][] | string[], fakeKey?: string) {
  if (!rule) {
    return true
  }
  let ret = true
  let real_rule: string[][] = rule as string[][]
  if (!isArray(rule[0])) {
    real_rule = [rule as string[]]
  }
  for (let i = 0; i < real_rule.length; i++) {
    const item = real_rule[i]
    const key = fakeKey ? item[0].replace('.', '-') : item[0]
    const val = get(obj, key)
    if (item[1] === '=') {
      // eslint-disable-next-line eqeqeq
      ret = val == item[2]
    }
    if (item[1] === '>') {
      ret = val > item[2]
    }
    if (item[1] === '<') {
      ret = val < item[2]
    }
    if (item[1] === '>=') {
      ret = val >= item[2]
    }
    if (item[1] === '<=') {
      ret = val <= item[2]
    }
    if (item[1] === '!=') {
      // eslint-disable-next-line eqeqeq
      ret = val != item[2]
    }
    if (item[1] === 'in') {
      ret = item[2].indexOf(val) !== -1
    }
    if (item[1] === 'not_in') {
      ret = item[2].indexOf(val) === -1
    }
    if (!ret) {
      return false
    }
  }
  return ret
}

export function showEleByClassName(class_name: string, block: string = 'center', behavior: string = 'smooth', index: number | string | boolean = false) {
  setTimeout(() => {
    const ele = document.getElementsByClassName(class_name)
    if (ele.length === 0) {
      return
    }
    const elIndex = index && index === 'last' ? ele.length - 1 : 0
    const options = {
      block: block || 'center', // 值有start,center,end,nearest，当前显示在视图区域中间
      behavior: behavior || 'smooth' // 值有auto,instant,smooth，缓动动画（当前是慢速的）
    }
    // @ts-ignore
    ele[elIndex].scrollIntoView(options)
    // isError[0].querySelector('input').focus()
  }, 100)
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function searchTreeValues(tree: Record<string, any>, value: any, key = 'id') {
  let nodes: any[] = []
  tree.forEach((item: any) => {
    if (item[key] === value) {
      nodes.push(value)
      return
    }
    if (item.children) {
      const sub = searchTreeValues(item.children, value, key)
      if (sub.length > 0) {
        nodes = [item[key]].concat(sub)
      }
    }
  })
  return nodes
}

export function toArray(value: any) {
  return Array.isArray(value)
    ? value
    : ((value === undefined || value === null || value === '' ? [] : [value])
    )
}

export function checkImgExists(imgurl: string) {
  const ImgObj = new Image() // 判断图片是否存在
  ImgObj.src = imgurl
  console.log(111, ImgObj)
  return ImgObj.width > 0 && ImgObj.height > 0
}

export function addNewStyle(id: string, src: string) {
  let styleElement = document.getElementById(id)

  if (styleElement === null) {
    styleElement = document.createElement('link')
    // @ts-ignore
    styleElement.type = 'text/css'
    // @ts-ignore
    styleElement.rel = 'stylesheet'
    // @ts-ignore
    styleElement.href = src
    // @ts-ignore
    styleElement.id = id
    document.getElementsByTagName('head')[0].appendChild(styleElement)
  }
}

export function addNewStyleTag(css: string) {
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  head.appendChild(style)
  style.appendChild(document.createTextNode(css))
}

// @ts-ignore
export function createIFrame({ elId, attrs }) {
  const eleIframe = document.createElement('iframe')
  eleIframe.width = '365px'
  eleIframe.height = '400px'
  eleIframe.frameBorder = '0'
  eleIframe.scrolling = 'no'
  // @ts-ignore
  eleIframe.allowTransparency = 'true'
  Object.keys(attrs || {}).forEach(key => {
    // @ts-ignore
    eleIframe[key] = attrs[key]
  })
  const container = document.getElementById(elId)
  // @ts-ignore
  container.innerHTML = ''
  // @ts-ignore
  container.appendChild(eleIframe)
  return eleIframe
}

export function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
  // eslint-disable-next-line no-undef
  // @ts-ignore
  let timer
  return (...args: Params) => {
    // @ts-ignore
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

// @ts-ignore
export const compactObject = (val) => {
  const data = Array.isArray(val) ? val.filter(n => n) : val
  return Object.keys(data).reduce(
    (acc : Record<string, any>, key) => {
      const value = data[key]
      // @ts-ignore
      if (value) {
        acc[key] = typeof value === 'object' ? compactObject(value) : value
      }
      return acc
    },
    Array.isArray(val) ? [] : {}
  )
}

export const download = (imageUrl: string, name: string): void => {
  fetch(imageUrl, {
    method: 'get',
    mode: 'cors'
  })
    .then((response) => response.blob())
    .then((data) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    })
}

export function baseMerge(obj: Record<string, any> = {}, source: Record<string, any>): Record<string, any> {
  if (source === undefined) {
    return obj
  }
  const result :Record<string, any> = {}

  Object.keys(obj).forEach((key) => {
    let val = source[key]
    if (val === undefined) {
      val = obj[key]
    }
    result[key] = cloneDeep(val)
  })
  return result
}

export function getArrayDepth(value: any) : number {
  return Array.isArray(value)
    ? 1 + Math.max(...value.map(getArrayDepth))
    : 0
}

export function isHidden(el: HTMLElement) {
  const style = window.getComputedStyle(el)
  return (style.display === 'none')
}

export function diffKey(newVal : Record<string, any>, oldVal: Record<string, any>): Array<string> {
  const diff : Array<string> = []
  Object.keys(newVal).forEach(key => {
    if (newVal[key] !== oldVal[key]) {
      diff.push(key)
    }
  })
  return diff
}

export const effectDataTrans = function(keys: undefined|string|Array<string>|Record<string, string>, row: Record<string, any>) : Record<string, any> {
  if (!keys) {
    return {}
  }
  if (keys === '*') {
    return row
  }
  if (isString(keys)) { return { [keys as string]: row[keys as string] } }
  if (isArray(keys)) {
    const tmp : Record<string, any> = {};
    (keys as Array<string>).forEach(item => {
      tmp[item] = row[item]
    })
    return tmp
  }
  if (isObject(keys)) {
    const tmp : Record<string, any> = {}
    Object.keys(keys as Record<string, string>).forEach(item => {
      tmp[item] = row[(keys as Record<string, string>)[item]]
    })
    return tmp
  }

  return {}
}

export function copyToClipboard(value: any) {
  navigator.clipboard.writeText(value).then(_ => {
    Message({
      message: '已复制到剪贴板',
      type: 'success',
      duration: 1000
    })
  }).catch(err => {
    Message({
      message: '复制到剪贴板失败' + err,
      type: 'error',
      duration: 1000
    })
  })
}
