<template>
  <div
    ref="dom"
    class="editor"
  />
</template>

<script setup>
import { merge } from 'lodash'
import { showEleByClassName } from '@okiss/utils'
import { inject } from 'vue'

const vsPath = inject('vsPath', '')

const addScript = (src) => {
  if (document.getElementById(src)) {
    return
  }
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = src
  s.id = src
  document.body.append(s)
}

const loader = () => {
  if (window.monaco) {
    return new Promise(r => r(window.monaco))
  }
  const path = vsPath || props.vsPath
  addScript(path + '/loader.js')
  return new Promise((resolve, reject) => {
    const t = setInterval(() => {
      if (window.require) {
        require.config({
          paths: {
            vs: path
          }
        })
        require(['vs/editor/editor.main'],
          () => {
            resolve(window.monaco)
            clearInterval(t)
          },
          () => {
            reject('error')
          })
      }
    }, 50)
  })
}

const props = defineProps({
  mod: {
    type: String,
    default: 'html'
  },
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => {
      return {}
    }
  },
  clearable: {
    type: Boolean,
    default: false
  },
  vsPath: {
    type: String,
    default: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.30.1/min/vs'
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const dom = ref()

let instance
let monaco
let model = null

onMounted(async() => {
  monaco = await loader()
  const { editor } = monaco
  model = editor.createModel(props.modelValue, props.mod)

  if (!dom.value) {
    return
  }

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: true,
    schemaValidation: 'error'
  })

  instance = editor.create(
    dom.value,
    merge(
      {
        model: model,
        tabSize: 4,
        automaticLayout: true,
        foldingStrategy: 'indentation',
        scrollBeyondLastLine: false,
        glyphMargin: false, // 行号左边的占位
        folding: true,
        scrollbar: {
          alwaysConsumeMouseWheel: false // defaults is true, false enables the behavior you describe
        },
        minimap: {
          enabled: false
        }
      },
      props.options
    )
  )

  instance.onDidChangeModelContent(() => {
    const value = instance.getValue()
    emit('update:modelValue', value)
  })

  instance.onDidContentSizeChange(() => {
    const contentHeight = Math.min(1500, instance.getContentHeight())
    dom.value.style.height = `${contentHeight}px`
    instance.layout()
  })

  instance.onDidBlurEditorWidget(() => {
    validate()
    emit('blur', {
      editor: instance,
      markers: monaco.editor.getModelMarkers({})
    })
  })
})

let dec = []

const validate = () => {
  const err = monaco.editor.getModelMarkers({})
  if (err.length > 0) {
    instance.revealLineInCenter(err[0].endLineNumber)
    dec = instance.deltaDecorations(dec, [
      {
        range: new monaco.Range(
          err[0].endLineNumber,
          1,
          err[0].endLineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          className: 'myContentClass',
          glyphMarginClassName: 'myGlyphMarginClass'
        }
      }
    ])
    showEleByClassName('myGlyphMarginClass')
    return false
  }
  instance.deltaDecorations(dec, [])
  return true
}

defineExpose({
  validate
})

onUnmounted(() => {
  instance && instance.dispose()
})
</script>

<style scoped>
.editor {
  height: 100%;
  min-height: 40px;
  width: 100%;
  background-color: var(--el-bg-color);
  font-size: var(--el-font-size-base);
  flex: 1 1 auto;
  /* border: 1px dashed #dcdfe6; */
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>

<style>
.myGlyphMarginClass {
  background: red;
}

.myContentClass {
  background: #f4ebe7;
}
</style>
