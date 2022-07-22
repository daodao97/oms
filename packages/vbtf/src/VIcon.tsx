import * as Icons from '@element-plus/icons-vue'
import { snakeToCamel } from '@okiss/utils'
import { Component } from 'vue'

interface Props {
  name: string
}

const _icons = Icons as Record<string, Component>

export default defineComponent({
  name: 'VIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props: Props) {
    const _null = () => null
    if (props.name === undefined) {
      return _null
    }
    if (props.name.indexOf('el-') === 0) {
      const name = snakeToCamel(props.name.replace('el-icon-', ''), '-')
      const com = _icons[name]
      if (!com) {
        return _null
      }
      const comStyle = { height: '1em', width: '1em' }
      return () => <com style={comStyle}/>
    }
    if (_icons[props.name]) {
      const com = _icons[props.name]
      const comStyle = { height: '1em', width: '1em' }
      return () => <com style={comStyle}/>
    }
    if (props.name.indexOf('ra-') === 0) {
      return () => (<i class={'iconfont ' + props.name}/>)
    }
    return _null
  }
})
