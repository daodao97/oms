<template>
  <el-row
    class="tree-box"
    :gutter="20"
  >
    <el-col
      :span="8"
      class="tree-tree"
    >
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>列表</span>
            <el-button
              type="text"
              @click="() => appendNew()"
            >添加</el-button>
          </div>
        </template>
        <el-tree
          v-if="(treeData || []).length > 0"
          style="height: 100vh"
          :data="treeData"
          node-key="id"
          v-bind="localTreeProps"
          draggable
          :allow-drag="allowDrap"
          :allow-drop="allowDrop"
          @node-drag-end="handleDragEnd"
        >
          <template #default="{ node, data }">
            <span class="tree-action">
              <span v-if="data[localTreeProps.props.label]">{{ data[localTreeProps.props.label] }}</span>
              <span
                v-else
                style="color: #E6A23C"
              >请在右侧表单中修改 --> </span>
              <span>
                <el-button
                  v-if="data[localTreeProps.props.label]"
                  class="button"
                  type="text"
                  @click="() => onclick(data)"
                >编辑</el-button>
                <el-button
                  v-if="canAppend(data, node)"
                  class="button"
                  type="text"
                  @click="() => append(data, node)"
                >添加</el-button>
                <el-button
                  v-if="data.children === undefined || data.children.length === 0"
                  class="button"
                  type="text"
                  @click="() => remove(data)"
                >删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>
    </el-col>
    <el-col
      :span="16"
      class="tree-form"
    >
      <el-card
        v-if="type"
        shadow="never"
      >
        <template #header>
          <div class="card-header">
            <span>{{ formType }}</span>
          </div>
        </template>
        <v-form
          :key="formkey"
          v-model="formData"
          v-bind="formProps"
          @submit="submit"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="js">
import { VForm } from '@okiss/vbtf'
import { strVarReplace, effectDataTrans } from '@okiss/utils'
import { merge } from 'lodash'

export default defineComponent({
  name: 'VTree',
  components: {
    VForm
  },
  props: {
    treeApi: {
      type: String,
      default: '',
      require: true
    },
    getApi: {
      type: String,
      default: '',
      require: true
    },
    saveApi: {
      type: String,
      default: '',
      require: true
    },
    createApi: {
      type: String,
      default: '',
      require: true
    },
    deleteApi: {
      type: String,
      default: '',
      require: true
    },
    formItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeProps: {
      type: Object,
      default: () => {}
    },
    maxDepth: {
      type: Number,
      default: 3
    },
    props: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      type: 0, // 1 新增, 2 编辑
      treeData: [],
      formData: {},
      localTreeProps: merge({
        'default-expand-all': true,
        'expand-on-click-node': false,
        props: {
          children: 'children',
          label: 'label'
        }
      }, this.$props.treeProps),
      formkey: 0,
      tablekey: 0,
      menuOptions: {}
    }
  },
  computed: {
    formType() {
      const m = ['', '新建', '编辑']
      return m[this.type]
    },
    formProps() {
      let saveApi = strVarReplace(this.$props.saveApi, this.formData)
      if (this.type === 1) {
        saveApi = this.$props.createApi
      }
      return {
        saveApi: saveApi,
        getApi: this.$props.getApi,
        formItems: this.$props.formItems
      }
    }
  },
  created() {
    this.loadTree()
  },
  methods: {
    loadTree() {
      this.$http.request({
        method: 'GET',
        url: this.$props.treeApi
      }).then(({ data }) => {
        this.treeData = data
      })
    },
    onclick(data) {
      this.type = 2
      this.formData = data
      this.formkey++
    },
    append(data, node) {
      this.type = 1

      const newChild = { pid: data.id, [this.$props.props?.levelKey ?? 'level']: node.level + 1, ...effectDataTrans(this.$props.props?.effectData, data) }
      console.log(111, newChild)
      if (!data.children) {
        data.children = []
      }
      this.formData = newChild
      this.formkey++
      data.children.push(newChild)
      this.treeData = [...this.treeData]
    },
    canAppend(data, node) {
      if (!data[this.localTreeProps.props.label]) {
        return false
      }
      return node.level < this.$props.maxDepth
    },
    appendNew() {
      this.type = 1
      const newChild = { pid: 0, [this.$props.props?.levelKey ?? 'level']: 1 }
      this.formData = newChild
      this.formkey++
      this.tablekey++
      this.treeData = [...this.treeData, newChild]
    },
    remove(data) {
      this.$http.request({
        method: 'DELETE',
        url: strVarReplace(this.$props.deleteApi, data)
      }).then(({ code }) => {
        if (code !== 0) {
          this.$message.error('操作失败')
        } else {
          this.loadTree()
        }
      })
    },
    submit() {
      setTimeout(() => {
        this.loadTree()
        this.formData = {}
        this.tablekey++
        this.type = 0
      }, 200)
    },
    allowDrap(draggingNode) {
      return true
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(type)
      return type === 'inner'
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      const form = draggingNode.data
      form.pid = dropNode.data.id
      this.$http.request({
        method: 'POST',
        url: strVarReplace(this.$props.saveApi, form),
        data: form
      }).then(({ code }) => {
        if (code !== 0) {
          this.$message.error('操作失败')
        }
      })
    }
  }
})
</script>
<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tree-box {
  height: 100%;
}
.tree-tree .tree-form {
  height: 100%;
}
.tree-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>
