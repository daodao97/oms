<template>
  <div>
    <!-- <VButton v-bind="base" />
    <el-divider />
    <VButton v-bind="jump" />
    <el-divider />
    <VButton v-bind="api" />
    <el-divider /> -->
    <!-- <VButton v-bind="form" />
    <VButton v-bind="api" />
    <VButtonGroup v-bind="btnGroup" />
    <VForm v-model="form1Data" v-bind="form.extra" />-->

    <VForm v-model="form1Data" v-bind="form1" /> 

    <el-form :inline="true" :model="formInline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select
        v-model="formInline.region"
        placeholder="Activity zone"
        clearable
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-date-picker
        v-model="formInline.date"
        type="date"
        placeholder="Pick a date"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
    </el-form-item>
  </el-form>

    <!-- <el-divider />
    <VButtonGroup :buttons="buttons" />
    <el-divider />
    <VForm v-model="form1Data" v-bind="form1" />
    <el-divider />
    <VForm v-model="form2Data" v-bind="form2" />
    <el-divider />
    <el-divider />
    <MonacoEditor class="editor" /> -->
    <VTable v-bind="tableOpt" :table-props="{ emptyText: '~没有了~' }" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VButtonGroup, VForm, VTable, MonacoEditor, regCustomFormComps } from '@'
import VTest from './VTest.vue'

import { reactive } from 'vue'

const formInline = reactive({
  user: '',
  region: '',
  date: '',
})

const onSubmit = () => {
  console.log('submit!')
}


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
    method: 'POST',
    url: '/delete',
    data: {
      a: 1
    }
  },
  confirm: true
}

const btnGroup = {
  text: '按钮组',
  buttons: [
    api,
  ]
}

const form = {
  type: 'form',
  text: '模态框/表单',
  extra: {
    formItems: [
      {
        "field": "deprecated",
        "label": "弃用",
        "type": "select",
        "options": [
          { "value": "12", "label": "已弃用" },
          { "value": '123', "label": "正常使用" },
        ],
        "value": '123',
        // "valueType": "number",
      },
      {
        section: 'xxx',
        field: 'test',
        value: 'default'
        // type: 'VTest'
      },
      {
        field: 'switch',
        type: 'switch'
      },
      {
        field: 'name',
        rules: 'required',
        depend: {
          field: 'test',
          value: '1'
        }
      },
      {
        section: 'bbb',
        field: 'subform',
        type: 'sub-form',
        depend: {
          field: 'test',
          value: '1'
        },
        props: {
          formItems: [
            {
              field: 'name',
              rules: 'required'
            },
            {
              field: 'select',
              type: 'select',
              props: {
                'filterable': true,
                selectApi: '/api?name={{ $.name }}'
              }
            }
          ]
        }
      },
      {
        field: 'test',
        type: 'select',
        options: () => {
          return [
          ]
        },
        info: '字段提示, 可以写html, <a target="_blank" href="https://github.com/daodao97/oms">点我跳转</a>'
      },
      {
        field: 'test3',
        type: 'select',
        options: () => {
          return [
            {
              value: '1', label: '1',
              previewHtml: "<img style='width: 200px' src='https://tva4.sinaimg.cn/large/87c01ec7gy1frmry165k5j21hc0u0n6b.jpg'>"
            },
            { value: '2', label: '2' }
          ]
        },
        info: '字段提示, 可以写html, <a target="_blank" href="https://github.com/daodao97/oms">点我跳转</a>'
      }
    ]
  }
}

const buttons = [
  base, jump, api, form
]

const form1Data = ref({
  // 'test': 'model'
})
const form1 = {
  options: {
    inline: false,
  },
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
    },
    {
      "field": "auth_url",
      "label": "授权地址",
      "type": "VShow",
      "props": {
        "auto": false,
        "text": "点击生成授权地址",
        "dataApi": "/test",
        "tpl": "<a href='{{auth_url}}' target='_blank' class='el-link el-link--primary'>点我打开</a>"
      },
      "tips": "请在浏览器中打开授权地址，登录后复制授权码"
    },
    {
      "field": "session_id",
      "label": "会话ID"
    },
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

const tableOpt = {
  filter: form.extra.formItems
}
</script>

<style>
.editor {
  max-height: 200px;
  overflow: hidden;
}
</style>
