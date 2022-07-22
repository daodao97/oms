import { cloneDeep } from 'lodash'
import type { RouteRecordRaw } from 'vue-router'

export function getPageTitle(matched: RouteRecordRaw[], withBase = true) {
  let title = ''
  cloneDeep(matched).reverse().forEach((item, index) => {
    if (index < 2 && item.meta?.title) {
      // @ts-ignore
      title = item.meta.title + (title ? '-' + title : title)
    }
  })
  return title
}
