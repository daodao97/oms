<template>
  <el-table
    id="table"
    ref="tabledome"
    :data="dataList"
    :load="loadChildren"
    style="width: 100%"
    v-bind="props"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    :row-class-name="rowClassName"
    @selection-change="handleSelectionChange"
    @sort-change="sortTable"
  >
    <el-table-column
      v-if="selection"
      type="selection"
    />
    <el-table-column
      v-for="(item, index) in headers.filter(e => e.type !== 'hidden')"
      :key="index + '-table-column'"
      :prop="item.field"
      :label="item.label"
      v-bind="getColumnProps(item)"
    >
      <!-- 表头 -->
      <template #header>
        <span devtool="{devId: `headers[${index}]`, dev: dev, parent: 2}">
          {{ item.label }}
          <el-tooltip
            v-if="item.info"
            effect="dark"
            placement="top-start"
          >
            <el-icon><warning /></el-icon>
            <template #content><span v-html="item.info" /></template>
          </el-tooltip>
        </span>
      </template>
      <!--    单元格    -->
      <template #default="scope">
        <cell-edit
          v-if="item.edit"
          :key="`${index}-${rowKey}`"
          v-model="scope.row[scope.column.property]"
          v-bind="{item: item, disabled: item.props && item.props.disabled}"
          @update:model-value="value => cellChange(scope.index_, item.field, value)"
        />
        <component
          :is="cellType(item)"
          v-else
          v-bind="cellProps(item, scope)"
        />
      </template>
    </el-table-column>
    <!-- 操作 -->
    <el-table-column
      v-if="showRowButton && rowButton.length > 0"
      label="操作"
      fixed="right"
      :width="actionWidth"
    >
      <template #default="scope">
        <v-button
          :key="rowAction + '-' + scope.$index"
          :buttons="makeRowButton(rowButton, scope.row, scope.$index)"
          prefix-path="rowButton"
          @action="btnAction"
        />
      </template>
    </el-table-column>
    <template #empty> {{ props.emptyText || '没有数据' }}</template>
    <el-affix />
  </el-table>
</template>
<script lang="ts">
// @ts-nocheck
// todo ts
import * as Cells from './cell'
import VButton from '../button/VBtn.vue'
import CellEdit from './cell-edit/index.vue'
// import { useAffix } from './affix'
import Sortable, { SortableEvent } from 'sortablejs'
import { Warning } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'TableStyle',
  components: {
    VButton,
    CellEdit,
    Warning,
    ...Cells
  },
  inject: ['dev'],
  props: {
    headers: {
      type: Array,
      default: _ => []
    },
    dataList: {
      type: Array,
      default: _ => []
    },
    props: {
      type: Object,
      default: _ => {}
    },
    selection: {
      type: Boolean,
      default: false
    },
    cellType: {
      type: Function,
      default: () => {}
    },
    cellProps: {
      type: Function,
      default: () => {}
    },
    cellEvent: {
      type: Function,
      default: () => {}
    },
    rowButton: {
      type: Array,
      default: _ => []
    },
    makeRowButton: {
      type: Function,
      default: () => {}
    },
    loadChildren: {
      type: Function,
      default: () => {}
    },
    dragSort: {
      type: Boolean,
      default: false
    },
    localSortHandler: {
      type: Function,
      default: () => {}
    },
    showRowButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-change', 'sort-change', 'cell-change', 'btn-action', 'mounted', 'drag-sort'],
  setup(props, { emit }) {
    onMounted(() => {
      props.dragSort && rowDrop()
    })
    const rowKey = ref(0)
    const actionWidth = computed<number>(() => {
      if (props.rowButton.length === 1) {
        return undefined
      }
      let ratio = 0
      for (let i = 0; i < props.rowButton?.length; i++) {
        const item = props.rowButton[i]
        if (item.ignoreWith === true) {
          continue
        }
        if (item.type === 'group') {
          ratio += 98
        } else {
          const width = item.width || 1
          ratio += (item.text ? (item?.props?.icon ? 90 : 78) : 65) * width
        }
      }
      return ratio
    })
    const handleSelectionChange = (row) => {
      emit('select-change', row)
    }
    const sortTable = (data) => {
      emit('sort-change', data)
    }
    const getColumnProps = (colum) => {
      return {
        sortable: colum.sortable ? 'custom' : false,
        ...colum.props
      }
    }
    const cellChange = (index, field, value) => {
      emit('cell-change', { index, field, value })
    }
    const btnAction = (btn) => {
      emit('btn-action', btn)
      rowAction.value++
    }

    // useAffix('el-table__header-wrapper')
    const tabledom = ref(null)
    const rowAction = ref(0)
    const rowDrop = () => {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody, {
        onEnd(event: SortableEvent) {
          emit('drag-sort', event)
        }
      })
    }
    const indexs = ref([])

    const rowClassName = ({ row, rowIndex }) => {
      return `table-tr-${rowIndex}`
    }

    return {
      rowKey,
      actionWidth,
      handleSelectionChange,
      sortTable,
      getColumnProps,
      cellChange,
      btnAction,
      tabledom,
      rowAction,
      indexs,
      rowClassName
    }
  }
})
</script>
