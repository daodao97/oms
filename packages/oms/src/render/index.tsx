import { h, getCurrentInstance, Component } from 'vue'
import { ElRow, ElCol, ElCard } from 'element-plus'
import { merge } from 'lodash'
import { VForm, VTable } from '@okiss/vbtf'
import { isObject, isArray } from '@okiss/utils'

import './index.scss'

type CompProps = Record<string, any>

const test = (props: CompProps) => <div>{props.test}</div>

const components: Record<string, any> = {
  'card': ElCard,
  'form': VForm,
  'table': VTable,
  'test': test,
  'row': ElRow,
  'col': ElCol
}

export function regComponents(comps: Record<string, any>) {
  Object.keys(comps).forEach(k => {
    components[k] = comps[k]
  })
}

const defaultSchema: Record<string, Node> = {
  'card': {
    type: 'card',
    props: {
      class: 'render-card',
      shadow: 'never'
    }
  },
  'form': {
    type: 'form',
    props: {
      afterReset: ''
    }
  },
  'table': {
    type: 'table',
    props: {
      syncUrl: false
    }
  }
}

export interface Node {
  type: string,
  props?: Record<string, string | number | boolean | any>
  children?: Node[] | Node
  span?: number
}

export interface Props {
  schema: Node[]
}

function pathNodeParse(node: Node): Node[] {
  const _node = Object.assign({}, node)
  const part = _node.type.split('.').reverse()
  const span = _node.span || 24
  delete _node.span
  let tmp = { ..._node, type: part[0] }
  for (let i = 1; i < part.length; i++) {
    const item = part[i]
    tmp = { type: item, children: [tmp] }
  }
  tmp.span = span

  return nodesParse([tmp])
}

function nodesParse(_nodes: Node[]): Node[] {
  const root: Node = { type: 'row', props: { gutter: 20, class: 'render-row' }, children: [] }
  _nodes.forEach(_node => {
    let node = Object.assign({}, _node)
    if (isObject(node.props?.style)) {
      let style = ''
      Object.keys(node.props?.style).forEach(k => {
        style += k + ':' + node.props?.style[k] + ';'
      })
      node.props!.style = style
    }
    const colProps = { span: node.span ?? 24, class: 'render-col' }
    delete node.span
    if (node.type.indexOf('.') > 0) {
      (root.children! as Node[]).push({
        type: 'col',
        props: colProps,
        children: pathNodeParse(node)
      })
      return
    }
    node = merge({ props: {}}, defaultSchema[node.type] || {}, node)
    const children = transChildren(node.children)
    if (children.length) {
      node.children = nodesParse(children)
    }
    (root.children! as Node[]).push({
      type: 'col',
      props: colProps,
      children: [
        node
      ]
    })
  })

  return [root]
}

function transChildren(children : Node[] | Node | undefined) : Node[] {
  const _children : Node[] = isArray(children) ? children! as Node[] : (isObject(children) ? [children! as Node] : [])
  return _children
}

let globalComps : Record<string, Component> = {}

const createVNode = (node: Node) => {
  const comp = components[node.type] || globalComps[node.type] || node.type
  return h(comp, node.props, { default: () => transChildren(node.children).map(item => createVNode(item)) })
}

export const render = (props: Props) => {
  if (Object.keys(globalComps).length === 0) {
    globalComps = getCurrentInstance()!.appContext.components
  }
  const nodes: Node[] = nodesParse(Object.values(props.schema))
  return nodes.map(item => createVNode(item))
}
