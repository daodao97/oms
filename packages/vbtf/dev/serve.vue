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

const buttons = [
  base, jump, api, form
]

const form1Data = ref({})
const form1 = {
  formItems: [
    {
      field: 'test',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' }
      ],
      info: 'oksssssssssss'
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
        repeat: true,
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
