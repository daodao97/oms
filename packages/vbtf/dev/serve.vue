<template>
  <div>
    <VButton v-bind="base" />
    <el-divider />
    <VButton v-bind="jump" />
    <el-divider />
    <VButton v-bind="api" />
    <el-divider />
    <VButton v-bind="form" />
    <el-divider />
    <VButtonGroup :buttons="buttons" />
    <el-divider />
    <VForm
      v-model="form1Data"
      v-bind="form1"
    />
    <el-divider />
    <VForm
      v-model="form2Data"
      v-bind="form2"
    />
    <el-divider />
    <VTable />
    <el-divider />
    <MonacoEditor class="editor" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VButtonGroup, VForm, VTable, MonacoEditor, regCustomFormComps } from '@'
import VTest from './VTest.vue'

regCustomFormComps({ VTest })

const base = {
  text: '常规按钮',
  props: {
    type: 'primary'
  },
  onClick() {
    alert('我被点了')
  }
}

const jump = {
  type: 'jump',
  text: '跳转GitHub',
  target: 'http://github.com/daodao97'
}

const api = {
  type: 'api',
  text: '调用API删除',
  target: '/del',
  props: {
    type: 'danger'
  },
  extra: {
    method: 'DELETE',
    url: '/delete'
  },
  confirm: true
}

const form = {
  type: 'form',
  text: '模态框/表单',
  extra: {
    formItems: [
      {
        field: 'name'
      }
    ]
  }
}

const buttons = [
  base, jump, api, form
]

const form1Data = ref({})
const form1 = {
  formItems: [
    {
      field: 'test2'
    },
    {
      field: 'test1',
      computed: [
        {
          when: '1',
          set: {
            test: {
              value: 'now test1 value is 1'
            }
          }
        },
        {
          when: '2',
          set: {
            test: {
              value: 'now test1 value is 2',
              type: 'select'
            }
          }
        }
      ]
    },
    {
      field: 'test',
      depend: {
        field: 'test2',
        value: '1'
      }
    },
    {
      field: 'test3',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' }
      ],
      info: '字段提示, 可以写html, <a target="_blank" href="https://github.com/daodao97/oms">点我跳转</a>'
    }
  ]
}

const form2Data = ref({})
const form2 = {
  saveApi: '/test',
  options: {
    inline: true,
    labelWidth: 0
  },
  formItems: [
    {
      field: 'test1',
      rules: 'required',
      info: 'oksssssssssss'
    },
    {
      field: 'test2',
      type: 'daterange'
    }
  ]
}
</script>

<style>
.editor {
  max-height: 200px;
  overflow: hidden;
}
</style>
