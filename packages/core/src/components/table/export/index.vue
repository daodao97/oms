<template>
  <el-button @click="execute">导出</el-button>
  <el-dialog
    v-model="dialogVisible"
    title="提示"
    width="30%"
  >
    <el-progress :percentage="percentage" />
  </el-dialog>
</template>
<script lang="ts">
import { exportJson2Excel } from '../../../utils/excel'

export default {
  name: 'ExportAddButton',
  props: {
    getInfo: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      dialogVisible: false,
      task: {
        page: 1,
        size: 20,
        total: 200
      }
    }
  },
  computed: {
    percentage() {
      const compute = (this.task.page / Math.ceil(this.task.total / this.task.size))
      return (compute ? 1 : compute) * 100
    }
  },
  methods: {
    async execute() {
      const task = this.getInfo()
      this.task = Object.assign(this.task, task)
      let data = []
      const header = []
      const fields = []
      task.header.forEach(item => {
        header.push(item.label)
        fields.push(item.field)
      })
      this.dialogVisible = true
      while (this.task.page <= Math.ceil(this.task.total / this.task.size)) {
        const params = Object.assign({ _page: task.page || 1, _size: task.size || 20 }, task.filter || {})
        const { payload } = await this.$http.request({ method: 'GET', url: task.listApi, params })
        const list = [];
        (payload.list || []).forEach(item => {
          const row = []
          fields.forEach(each => {
            row.push(item[each])
          })
          list.push(row)
        })
        data = data.concat(list)
        this.task.page++
        this.task.total = payload.page.count
      }
      exportJson2Excel(
        header,
        data,
        task.name
      )
      this.$message.success('文件导出成功')
      this.dialogVisible = false
    }
  }
}
</script>
