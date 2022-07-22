import { getObjectNodeByKeyTree } from './object'
import { isArray, isObject } from './type'
import Handlebars from 'handlebars'

function templateV2(tpl: string, data : Record<string, any>) {
  return Handlebars.compile(tpl)(data)
}

export function isVarTplStrV2(str: string) : boolean {
  return !!str.match(/{{([\s\S]*?)}}/g)
}

export const firstUpperCase = ([first, ...rest]: string[]) => first.toUpperCase() + rest.join('')

export function isVarTplStr(str: string) : boolean {
  return !!str.match(/{([\s\S]*?)}/g)
}

export function strVars(str: string): Array<string> {
  const keys: Array<string> = []
  const match = str.match(/{([\s\S]*?)}/g)
  if (!match) {
    return keys
  }
  match.forEach(item => {
    let key
    key = item.replace('{', '')
    key = key.replace('}', '')
    keys.push(key)
  })
  return keys
}

export function strVarReplace(str: string, obj: Record<string, any>): string {
  if (isVarTplStrV2(str)) {
    return templateV2(str, obj)
  }
  const match = str.match(/{([\s\S]*?)}/g)
  if (!match) {
    return str
  }
  match.forEach(item => {
    let key
    key = item.replace('{', '')
    key = key.replace('}', '')
    let value = getObjectNodeByKeyTree(key, obj)
    if (isArray(value) || isObject(value)) {
      value = encodeURIComponent(JSON.stringify(value))
    }
    if (value === undefined) {
      value = ''
    }
    str = str.replace(item, value)
  })
  return str
}

export function camelToSnake(str: string, connector: string) {
  return str
    .split(/(?=[A-Z])/)
    .join(connector || '_')
    .toLowerCase()
}

export function snakeToCamel(str: string, connector: string) {
  return str
    .split(connector || '_')
    .map(v => firstUpperCase(v.split('')))
    .join('')
}
