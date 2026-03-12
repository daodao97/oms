import {
  CellEnum,
  CellHtml,
  CellImage,
  CellJson,
  CellLink,
  CellSpan,
  CellRichText,
  CellIcon,
  CellTpl,
  CellView,
  CellChart,
  CellPlayer,
  CellSortIndex,
  CellTime
} from './cell'

const builtinTableComps: Record<string, any> = {
  'cell-enum': CellEnum,
  'cell-html': CellHtml,
  'cell-image': CellImage,
  'cell-json': CellJson,
  'cell-link': CellLink,
  'cell-span': CellSpan,
  'cell-rich': CellRichText,
  'cell-icon': CellIcon,
  'cell-tpl': CellTpl,
  'cell-view': CellView,
  'cell-chart': CellChart,
  'cell-player': CellPlayer,
  'cell-sort-index': CellSortIndex,
  'cell-time': CellTime,
  CellEnum,
  CellHtml,
  CellImage,
  CellJson,
  CellLink,
  CellSpan,
  CellRichText,
  CellIcon,
  CellTpl,
  CellView,
  CellChart,
  CellPlayer,
  CellSortIndex,
  CellTime
}

export const customTableComps: Record<string, any> = {
  ...builtinTableComps
}

export const regCustomTableComps = (comps: Record<string, any>) => {
  Object.keys(comps).forEach(key => {
    customTableComps[key] = comps[key]
  })
}

export const getTableCellType = (name: any) => {
  if (typeof name !== 'string') {
    return 'cell-span'
  }

  let type = name || 'span'
  type = type === 'input' ? 'span' : type

  if (customTableComps[type] !== undefined) {
    return type
  }

  const cellType = /^cell-/.test(type) ? type : `cell-${type}`
  if (customTableComps[cellType] !== undefined) {
    return cellType
  }

  return cellType
}

export const getTableCellComp = (name: any) => {
  if (typeof name !== 'string') {
    return name || customTableComps['cell-span']
  }

  const cellType = getTableCellType(name)
  return customTableComps[cellType] || cellType
}
