import type { ObjectDirective } from 'vue'
import bus from '../plugins/eventBus'

function getElementPosition(element: HTMLElement | any, key: 'Top' | 'Left' | 'Right' | 'Botton') {
  let result = element[`offset${key}`]
  let current = element.offsetParent

  while (current) {
    result += current[`offset${key}`]
    current = current.offsetParent
  }

  return result
}

const devtool: ObjectDirective = {
  mounted: (el, binding) => {
    if (el === null || !binding.value.dev) {
      return
    }
    let target : HTMLElement = el
    if (binding.value.parent) {
      for (let i = 0; i < binding.value.parent; i++) {
        if (target.parentElement) {
          target = target.parentElement
        }
      }
    }

    target.classList.add('devtool-hover')

    // button wrapper
    const wrapper = document.createElement('i')
    wrapper.className = 'devtool-item-wrapper'

    target.onmouseover = () => {
      wrapper.style.height = (target.offsetHeight + 30) + 'px'
      wrapper.style.width = (target.offsetWidth + 30) + 'px'
      wrapper.style.top = (getElementPosition(target, 'Top') - 15) + 'px'
      wrapper.style.left = (getElementPosition(target, 'Left') - 15) + 'px'
    }

    // create edit button
    const editBtn = document.createElement('span')
    editBtn.className = 'dev-action-edit'
    editBtn.title = '编辑'
    const editIcon = document.createElement('i')
    editIcon.className = 'iconfont ra-editor1'
    editBtn.appendChild(editIcon)
    editBtn.onclick = (ev) => {
      bus.emit('dev-action', { event: ev, data: { type: 'edit', devId: binding.value.devId }})
    }
    wrapper.appendChild(editBtn)

    // create delete button
    const delBtn = document.createElement('span')
    delBtn.className = 'dev-action-del'
    delBtn.title = '删除'
    const delIcon = document.createElement('i')
    delIcon.className = 'iconfont ra-cut'
    delBtn.appendChild(delIcon)
    delBtn.onclick = (ev) => {
      bus.emit('dev-action', { event: ev, data: { type: 'del', devId: binding.value.devId }})
    }
    wrapper.appendChild(delBtn)

    // append wrapper as first child
    target.insertBefore(wrapper, target.firstChild)

    return
  }
}

export default devtool
