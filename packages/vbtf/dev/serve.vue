<template>
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
  <VTable />
  <el-divider />
  <MonacoEditor class="editor" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VButtonGroup, VForm, VTable, MonacoEditor } from '@'

const base = {
  text: '常规按钮',
  props: {
    type: 'primary'
  },
  onClick() {
    alert('onClick')
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

// {
//   when: "1",
//   set: {
//     test: {
//       value: 1
//     }
//   }
// }

const buttons = [
  base, jump, api, form
]

const form1Data = ref({})
const form1 = {
  formItems: [
    {
      field: 'test'
    },
    {
      field: 'test333',
      depend: {
        field: 'test',
        value: '1'
      }
    },
    {
      field: 'sub-form',
      type: 'sub-form',
      props: {
        formItems: [
          {
            field: 'ok',
            depend: {
              field: '.test',
              value: '1'
            }
          }
        ]
      }
    },
    {
      field: 'test1',
      computed: [
        {
          when: '1',
          set: {
            test: {
              value: 1
            }
          }
        },
        {
          when: '2',
          set: {
            test: {
              value: 2
            }
          }
        }
      ]
    },
    {
      field: 'image',
      type: 'image'
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
