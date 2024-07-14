<template>
  <!--  筛选条件  -->
  <el-card
    v-if="showFilter && showFilterCard"
    shadow="never"
    class="table-filter"
  >
    <slot name="filter">
      <v-form
        v-if="tableFilter.length > 0"
        :key="formKey"
        ref="filter"
        v-model="filterForm"
        :dev="dev"
        class="filter-form"
        prefix-path="filter"
        :options="filterFormOptions"
        :form-items="tableFilter"
        :init-query-params="syncUrl"
        @submit="searchAction"
        @reset="resetFilter"
      />
    </slot>
  </el-card>
  <!--   批量按钮/其他按钮   -->
  <slot name="action">
    <el-row
      :gutter="20"
      style="margin-bottom: 20px"
    >
      <el-col
        v-if="showBatchButton"
        :span="batchButtonCol"
      >
        <v-button
          :buttons="makeBatchButton(tableBatchButton)"
          prefix-path="batchButton"
          @action="batchBtnAction"
        />
        <div
          v-if="tableBatchButton.length > 0 && selectedInfoPosition === 'afterBatchButton'"
          class="selected-info"
        >
          <span v-html="selectedInfo" />
        </div>
      </el-col>
      <el-col
        v-if="showNormalButton"
        :span="24 - batchButtonCol"
        class="normal-button"
      >
        <v-button
          :buttons="makeNormalButton(tableNormalButton)"
          prefix-path="normalButton"
          @action="load"
        />
        <export-add-button
          v-if="tableExportAble"
          :get-info="getExportInfo"
        />
        <el-button
          v-if="tableExportCurrentPageAble"
          type="primary"
          :loading="exporting"
          @click="exportCurrentTable"
        >导出</el-button>
      </el-col>
    </el-row>
  </slot>
  <slot name="before_table" />
  <!--  列表  -->
  <el-tabs
    v-if="tableTabs.length > 0"
    v-model="activeTab"
    type="card"
    @tab-click="changeTab"
  >
    <el-tab-pane
      v-for="(item, index) in tableTabs"
      :key="index + '-pane'"
      :name="item.value + ''"
      :lazy="true"
    >
      <template #label>
        <span><v-icon :name="item.icon || ''" />{{ item.label }}</span>
      </template>
      <slot name="table">
        <table-style
          ref="table"
          :key="tableKey"
          v-loading="loading"
          :headers="tableHeaders"
          :data-list="tableList"
          :drag-sort="dragSortEnable"
          :props="tableTableProps"
          :selection="enableSelection"
          :cell-type="cellType"
          :cell-props="cellProps"
          :row-button="tableRowButton"
          :show-row-button="showRowButton"
          :make-row-button="makeRowButton"
          :load-children="loadChildren"
          :local-sort-handler="localSortHandler"
          @select-change="handleSelectionChange"
          @sort-change="sortTable"
          @cell-change="cellChange"
          @btn-action="btnAction"
          @mounted="load"
          @drag-sort="dragSortHandle"
        />
      </slot>
    </el-tab-pane>
  </el-tabs>
  <slot
    v-else
    name="table"
  >
    <table-style
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :headers="tableHeaders"
      :data-list="tableList"
      :drag-sort="dragSortEnable"
      :props="tableTableProps"
      :selection="enableSelection"
      :cell-type="cellType"
      :cell-props="cellProps"
      :row-button="tableRowButton"
      :show-row-button="showRowButton"
      :make-row-button="makeRowButton"
      :load-children="loadChildren"
      :local-sort-handler="localSortHandler"
      @select-change="handleSelectionChange"
      @sort-change="sortTable"
      @cell-change="cellChange"
      @btn-action="btnAction"
      @drag-sort="dragSortHandle"
    />
  </slot>
  <el-button
    v-if="listIncreaseConf.state && listIncreaseConf.location === 'afterList'"
    class="list-incr-button"
    @click="listIncreaseRecord"
  >添加</el-button>
  <el-row style="display: flex">
    <el-col
      :span="12"
      style="min-height: 15px"
    >
      <div
        v-if="tableBatchButton.length > 0 && selectedInfoPosition === 'beforePagination'"
        class="selected-info"
      >
        <span v-html="selectedInfo" />
      </div>
    </el-col>
    <el-col :span="12">
      <slot name="page">
        <div
          v-if="tableShowPagination"
          class="table-pagination"
        >
          <el-pagination
            :key="paginationKey"
            background
            layout="total, sizes, prev, pager, next"
            :page-size="tablePage.ps"
            :page-sizes="tablePage.sizes"
            :current-page="tablePage.pn"
            :total="tablePage.total"
            @size-change="pssChange"
            @current-change="(page) => pnChange(page)"
          />
        </div>
      </slot>
    </el-col>
  </el-row>
</template>

<script lang="ts">
// @ts-nocheck
// todo ts
import VForm from '../form/VForm.vue'
import VButton from '../button/VBtn.vue'
import { pipe, ruleCompute, firstUpperCase, isVarTplStr, strVarReplace, isArray, isBool, isFunc, isObject, isString, queryParams, setUrlParamsLikeAxios, showEleByClassName, Cache } from '@okiss/utils'
import { getPageTitle } from './lib'
import ExportAddButton from './export/index.vue'
import TableStyle from './TableSytle.vue'
import { cloneDeep, findIndex, merge, get } from 'lodash'
import { SortableEvent } from 'sortablejs'
import { getComponentValue } from '../form/util'
import { exportJson2Excel } from './excel'
import VIcon from '../VIcon'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'VTable',
  components: {
    VIcon,
    VForm,
    VButton,
    ExportAddButton,
    TableStyle
  },
  provide() {
    return {
      dev: this.dev
    }
  },
  inheritAttrs: false,
  props: {
    dev: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    listApi: {
      type: String,
      default: ''
    },
    infoApi: {
      type: String,
      default: ''
    },
    schemaHandle: {
      type: Function,
      default: e => e
    },
    filter: {
      type: Array,
      default: () => []
    },
    batchButton: {
      type: Array,
      default: () => []
    },
    normalButton: {
      type: Array,
      default: () => []
    },
    rowButton: {
      type: Array,
      default: () => []
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showNormalButton: {
      type: Boolean,
      default: true
    },
    showBatchButton: {
      type: Boolean,
      default: true
    },
    showRowButton: {
      type: Boolean,
      default: true
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    showSelection: {
      type: Boolean,
      default: undefined
    },
    selectedNotice: {
      type: [String, Object],
      default: ''
    },
    listIncrease: {
      type: [Boolean, Object],
      default: false
    },
    tableProps: {
      type: Object,
      default: _ => {
      }
    },
    exportAble: {
      type: Boolean,
      default: false
    },
    exportCurrentPageAble: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default: _ => {
        return []
      }
    },
    rowHandler: {
      type: Function,
      default: (row, index) => row
    },
    dragSort: {
      type: [Object, String, Boolean],
      default: () => ''
    },
    syncUrl: {
      type: Boolean,
      default: true
    }
  },
  emits: ['cell-change', 'unshiftList', 'deleteList', 'updateList', 'topList', 'dragSort', 'selection'],
  data() {
    const tableDefaultProps = {
      border: true,
      stripe: true,
      size: 'default',
      rowKey: 'id',
      lazy: true,
      defaultExpandAll: false,
      expandRowKeys: [1]
    }
    let activeTab = ''
    if (this.$props.tabs.length > 0) {
      activeTab = this.$props.tabs[0].value
    }
    if (this.$route && this.$route.query.tab) {
      activeTab = this.$route.query.tab
    }
    const cacheFilter = Cache.get('table_filter:' + this.$route?.path)
    const query = Object.assign({}, this.$route ? this.$route.query : {}, cacheFilter, this.queryParams())
    Object.keys(query).forEach(key => {
      if (key.indexOf('[]') > -1) {
        query[key.replace('[]', '')] = query[key]
        delete query[key]
      }
    })
    let dragSortEnable = false
    if (isString(this.$props.dragSort) && this.$props.dragSort) {
      dragSortEnable = true
    }
    if (isObject(this.$props.dragSort) && this.$props.dragSort.sortApi) {
      dragSortEnable = true
    }
    if (isBool(this.$props.dragSort)) {
      dragSortEnable = this.$props.dragSort
    }

    const tableProps = { ...this.$props.tableProps }
    if (tableProps['rowKey'] === '__random__') {
      tableProps['rowKey'] = () => (new Date()).getTime() + Math.random()
    }
    if (query['_sort_by'] !== undefined) {
      tableProps.defaultSort = {
        prop: query['_sort_by'],
        order: query['_sort_type'] === 'desc' ? 'descending' : 'ascending'
      }
    }

    return {
      rowKey: 0,
      formKey: 0,
      tableKey: 0,
      tableDefaultProps: tableDefaultProps,
      filterFormOptions: {
        inline: true,
        labelPosition: 'right',
        labelWidth: 0,
        submitButton: {
          innerHTML: '查询'
        },
        cancelButton: {
          innerHTML: '重置'
        }
      },
      tableNormalButton: this.$props.normalButton,
      tableBatchButton: this.$props.batchButton,
      tableRowButton: this.$props.rowButton,
      tableHeaders: this.$props.headers.filter(item => item).filter(item => item.hidden !== true),
      tableFilter: this.$props.filter,
      tableList: this.$props.list,
      tableSelectedNotice: this.$props.selectedNotice,
      tableShowPagination: this.$props.showPagination,
      tableTableProps: Object.assign({}, tableDefaultProps, tableProps),
      selectionRows: [],
      tableExportAble: this.$props.exportAble,
      tableExportCurrentPageAble: this.$props.exportCurrentPageAble,
      tableTabs: this.$props.tabs,
      tableListApi: this.$props.listApi,
      dragSortEnable: dragSortEnable,
      tablePage: Object.assign({
        ps: query['_ps'] ? parseInt(query['_ps']) : 20,
        sizes: [20, 100, 200],
        pn: query['_pn'] ? parseInt(query['_pn']) : 1,
        total: 0
      }, this.$props.tableProps?.page || {}),
      paginationKey: 0,
      filterForm: this.$props.syncUrl ? query : {},
      loading: false,
      sort: null,
      activeTab: activeTab + '',
      exporting: false
    }
  },
  computed: {
    enableSelection() {
      if (this.showSelection === true) {
        return true
      }
      return this.tableBatchButton.length !== 0
    },
    batchButtonCol() {
      if (this.tableBatchButton.length === 0 && this.tableNormalButton.length === 0) {
        return 0
      }
      const batchLen = this.tableBatchButton.length
      let totalLen = this.tableBatchButton.length + this.tableNormalButton.length
      if (this.$props.exportCurrentPageAble) {
        totalLen += 1
      }
      return Math.round((batchLen / totalLen) * 24)
    },
    showFilterCard() {
      return this.tableFilter.length > 0
      // return (this.tableFilter.length > 0 && this.tableBatchButton.length > 0) || this.tableFilter.length > 4
    },
    actionWidth() {
      if (this.tableRowButton.length === 1) {
        return undefined
      }
      let ratio = 0
      this.tableRowButton.forEach((item) => {
        ratio += item.text ? 73 : 60
      })
      return ratio
    },
    listIncreaseConf() {
      if (isBool(this.$props.listIncrease)) {
        if (this.$props.listIncrease === false) {
          return {
            state: false
          }
        } else {
          return {
            state: true,
            type: 'append',
            location: 'beforeList'
          }
        }
      }
      return this.$props.listIncrease
    },
    selectedInfoPosition() {
      return isObject(this.tableSelectedNotice) ? this.tableSelectedNotice.position : 'beforePagination'
    },
    selectedInfo() {
      const data = {
        selectedCount: this.selectionRows.length
      }
      const tpl = isObject(this.tableSelectedNotice) ? this.tableSelectedNotice.text : this.tableSelectedNotice
      const matched = tpl.match(/{([\s\S]*?)}/g)
      if (!matched) {
        return tpl
      }
      const match = matched.map(item => item.replace('{', '').replace('}', ''))
      const fields = this.tableHeaders.map(item => item.field)
      for (const i in match) {
        const tokens = match[i].split('|')
        if (tokens.length === 1) {
          continue
        }
        if (fields.indexOf(tokens[0]) === -1) {
          continue
        }
        const column_data = this.selectionRows.map(item => item[tokens[0]])
        data[match[i]] = pipe.execute(column_data, tokens.slice(1))
      }
      return strVarReplace(tpl, data)
    }
  },
  beforeCreate() {
    if (this.$props.infoApi) {
      this.$http
        .request({ method: 'GET', url: this.$props.infoApi })
        .then(({ data }) => {
          data = this.$props.schemaHandle(data)
          Object.keys(data).forEach(key => {
            if (key === 'tableProps') {
              this['table' + firstUpperCase(key)] = Object.assign({}, this.tableDefaultProps, data[key])
            } else {
              this['table' + firstUpperCase(key)] = data[key]
            }
          }
          )
          let activeTab = ''
          if (this.tableTabs.length > 0) {
            activeTab = this.tableTabs[0].value
          }
          if (this.$route && this.$route.query.tab) {
            activeTab = this.$route.query.tab
          }
          this.activeTab = activeTab + ''
          console.log('beforeCreate')
          this.load()
        })
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('mounted.$nextTick')
      !this.$props.infoApi && this.load()
    })
  },
  methods: {
    changeTab(tab, e) {
      this.activeTab = this.tableTabs[tab.index].value + ''
      console.log('changeTab', tab.index)
      this.load()
    },
    resetFilter() {
      const query = this.queryParams()
      Object.keys(this.filterForm).forEach(k => {
        delete query[k]
        delete query[k + '[]']
      })
      setUrlParamsLikeAxios(query)
      this.filterForm = {}
      this.formKey++
      console.log('resetFilter', this.filterForm)
      this.load()
    },
    cellType(column) {
      let type = column.type || 'span'
      type = type === 'input' ? 'span' : type
      return `cell-${type}`
    },
    cellProps(column, scope) {
      let base = {
        data: get(scope.row, scope.column.property),
        column: column,
        scope: scope
      }
      if (this.cellType(column) === 'cell-sort-index') {
        base['onSortIndexChange'] = ({ from, to }) => {
          if (from !== to && this.tableList?.length > 0) {
            if (to > (this.tableList.length - 1)) {
              to = this.tableList.length - 1
            }
            if (to <= 0) {
              to = 0
            }
            const currRow = this.tableList.splice(from, 1)[0]
            this.tableList.splice(to, 0, currRow)
            this.tableKey++
            setTimeout(() => {
              const el = document.getElementsByClassName(`table-tr-${to}`)[0]
              const list = []
              el.classList.forEach(item => {
                list.push(item)
              });

              (to + 1) % 2 === 0 && el.classList.toggle('el-table__row--striped')
              el.classList.add('table-highlight')
              showEleByClassName('table-highlight')
              setTimeout(() => {
                el.classList.remove(['table-highlight']);
                (to + 1) % 2 === 0 && el.classList.toggle('el-table__row--striped')
              }, 2000)
            }, 60)
          }
        }
      }
      base['row'] = scope.row
      if (column.type === 'tpl') {
        base['tpl'] = column.tpl || ''
      }
      if (column.cellProps !== undefined) {
        base = Object.assign(base, column.cellProps)
      }
      return base
    },
    getAvailableFilter() {
      const available = {}
      if (Object.keys(this.filterForm).length === 0) {
        this.tableFilter?.forEach(item => {
          if (item.value !== undefined) {
            available[item.field] = getComponentValue(item)
          }
        })
      }
      Object.keys(this.filterForm).map((key) => {
        if (this.filterForm[key] !== '' && this.filterForm[key] !== undefined) {
          available[key] = this.filterForm[key]
        }
      })

      return available
    },
    searchAction() {
      const available = this.getAvailableFilter()
      if (Object.keys(available).length === 0) {
        this.$message({ message: '请填写筛选条件', type: 'warning' })
        return
      }
      console.log('searchAction')
      this.load({resetPage: true})
    },
    load(args = {}, extraPrams = {}) {
      if (!this.tableListApi) {
        return
      }
      this.loading = true
      if (args.resetPage !== undefined && args.resetPage !== false) {
        this.tablePage.pn = 1
      }
      const filter = this.getAvailableFilter()
      const page = this.showPagination ? {
        _pn: this.tablePage.pn,
        _ps: this.tablePage.ps
      } : {}
      const params = Object.assign(
        {},
        filter,
        page,
        this.sort,
        extraPrams,
        this.$route ? this.$route.params : {}
      )
      const tabs = cloneDeep(this.tableTabs)?.map(item => {
        item.value = item.value + ''
        return item
      })
      if (this.activeTab) {
        const tabIndex = findIndex(tabs, { value: this.activeTab })
        console.log('activeTab', this.activeTab, tabs, tabIndex)
        if (tabIndex > -1) {
          params[this.tableTabs[tabIndex].field] = this.activeTab
        }
      }
      console.log('query params', params)
      this.syncParamsToUrl(params)
      this.$http
        .request({
          type: 'GET',
          url: this.tableListApi,
          params: params
        })
        .then(({ data }) => {
          this.tableList = (data.list || []).map(this.rowHandler)
          this.tablePage = Object.assign(this.tablePage, data.page || {})
          this.loading = false
          this.tableKey++
          return params
        })
    },
    syncParamsToUrl(params) {
      if (!this.syncUrl) {
        return
      }
      console.log({}, cloneDeep(this.queryParams()), cloneDeep(params))
      const _params = merge({}, cloneDeep(params))
      const defaultParams = {
        _pn: 1,
        _ps: 20
      }
      Object.keys(defaultParams).forEach((k) => {
        if (_params[k] === defaultParams[k]) {
          delete _params[k]
        }
      })
      Cache.set('table_filter:' + this.$route.path, _params, 86400 * 7)
      setUrlParamsLikeAxios(_params)
    },
    handleSelectionChange(rows) {
      this.selectionRows = rows
      this.$emit('selection', rows)
    },
    batchButtonPreCheck() {
      if (this.selectionRows.length === 0) {
        this.$message({ message: '请勾选相应记录', type: 'warning' })
        return false
      }
      return true
    },
    batchMetaData(extra: Record<string, any>) {
      const ids = []
      this.selectionRows.forEach(item => {
        if (item.id !== undefined) {
          ids.push(item.id)
        }
      })

      return { ids: ids, _selection: this.selectionRows, _query: this.queryParams() }
    },
    batchDynamicExtra(extra: Record<string, any>) {
      const ids = []
      const extData = {}
      if (extra && extra.batchApiParamsKey) {
        extra.batchApiParamsKey.forEach(item => {
          extData[item] = []
        })
      }
      this.selectionRows.forEach(item => {
        if (item.id !== undefined) {
          ids.push(item.id)
        }
        Object.keys(extData).forEach(key => {
          if (item[key] !== undefined) {
            extData[key].push(item[key])
          }
        })
      })
      if (ids.length === 0) {
        this.$message({ message: '列表记录缺少主键 id', type: 'warning' })
        return {}
      }
      const idStr = ids.join(',')

      const data = { id: idStr, ids: idStr }
      Object.keys(extData).forEach(k => {
        data[k] = extData[k].join(',')
      })

      extra = extra || {}
      extra.data = extra.data || {}

      extra.data._selected = this.selectionRows

      if (extra.url !== undefined) {
        extra.params = extra.params || {}
        Object.keys(extData).forEach(k => {
          extra.params[k] = extData[k].join(',')
        })
        if (extra.url.indexOf('{id}') === -1) {
          extra.params.id = idStr
        }
        if (isVarTplStr(extra.url)) {
          extra.url = strVarReplace(extra.url, data)
        }
      }

      return extra
    },
    batchBtnAction() {
      console.log('batchBtnAction')
      this.load()
    },
    pssChange(ps) {
      this.tablePage.pn = 1
      this.tablePage.ps = ps
      this.paginationKey += 1
      console.log('pssChange')
      this.load()
    },
    pnChange(pn) {
      if (pn - this.tablePage.pn > 100) {
        this.$message({
          message: '禁止大跨度翻页',
          type: 'error'
        })
        this.paginationKey += 1
        return
      }
      this.tablePage.pn = pn
      this.load({ resetPage: false })
      // window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    isArray(tmp) {
      return isArray(tmp)
    },
    makeBatchButton(arr) {
      return arr.map((item) => {
        if (isArray(item)) {
          item = this.makeBatchButton(item)
        } else {
          item['pre-check'] = this.batchButtonPreCheck
          item['dynamic-extra'] = this.batchDynamicExtra
          item['meta-data'] = this.batchMetaData
          if (item?.extra?.actionHandler) {
            switch (item?.extra?.actionHandler) {
              case '@topList':
                item.extra.actionHandler = () => {
                  this.moveSelectedToTop()
                }
                break
              case '@deleteList':
                item.extra.actionHandler = () => {
                  this.deleteSelected()
                }
                break
            }
          }
        }
        return item
      })
    },
    queryParams() {
      return queryParams(location.hash)
    },
    queryString() {
      const index = location.hash.indexOf('?')
      if (index === -1) {
        return ''
      }
      return location.hash.substring(index + 1)
    },
    makeNormalButton(arr) {
      const data = this.queryParams()
      return arr.filter(item => {
        if (item.when) {
          let tmp = item.when
          if (!isArray(item.when[0])) {
            tmp = [item.when]
          }
          return ruleCompute(data, tmp)
        }
        return true
      }).map((item) => {
        if (isArray(item)) {
          item = this.makeNormalButton(item)
        } else {
          item['meta-data'] = () => { return { ...this.queryParams(), _query: this.queryString(), tableList: this.tableList } }
          if (item?.extra?.initQueryParams === false) {
            item['meta-data'] = {}
          }
          if (item?.extra?.actionHandler) {
            switch (item?.extra?.actionHandler) {
              case '@unshiftList':
                item.extra.actionHandler = (data) => {
                  const _data = isFunc(item.extra?.parseFormData) ? item.extra.parseFormData(data) : data
                  if (_data) {
                    this.tableList?.unshift(_data)
                    this.$emit('unshiftList', data)
                  }
                }
                break
            }
          }
        }
        return item
      })
    },
    fullPath() {
      return { route_full_path: encodeURIComponent(location.hash.replace('#', '')) }
    },
    makeRowButton(arr, row, index) {
      const btn = []
      cloneDeep(arr.filter(each => !!each)).forEach(item => {
        if (item.type === 'group') {
          btn.push(item.subButton)
        } else {
          btn.push(item)
        }
      })

      return btn.filter(item => {
        if (item.when) {
          let tmp = item.when
          if (!isArray(item.when[0])) {
            tmp = [item.when]
          }
          return ruleCompute(row, tmp)
        }
        return true
      }).map((item) => {
        if (isArray(item)) {
          item = this.makeRowButton(item, row)
        } else {
          const metaData = item['metaData'] || {}
          item['inject-data'] = () => merge(this.queryParams(), metaData)
          item['meta-data'] = () => {
            const fullPath = this.fullPath()
            return { ...this.queryParams(), ...row, ...fullPath, ...metaData }
          }
          if (item?.extra?.initQueryParams === false) {
            item['meta-data'] = { ...row, ...metaData }
          }
          if (item?.extra?.actionHandler) {
            switch (item?.extra?.actionHandler) {
              case '@updateList':
                item.extra.actionHandler = (data) => {
                  this.tableList[index] = merge(this.tableList[index], data)
                  this.$emit('updateList', data, index)
                }
                break
              case '@deleteList':
                item.extra.actionHandler = () => {
                  this.tableList.splice(index, 1)
                  this.$emit('deleteList', index)
                }
                break
              case '@unshiftList':
                item.extra.actionHandler = (data) => {
                  this.tableList?.unshift(data)
                  this.$emit('unshiftList', data, index)
                }
                break
              case '@topList':
                item.extra.actionHandler = (data) => {
                  console.log(index)
                  this.moveItemToTop(index)
                  this.$emit('topList', data, index)
                }
                break
            }
          }
        }
        return item
      })
    },
    moveItemToTop(index) {
      const current = this.tableList?.splice(index, 1)
      this.tableList.unshift(current[0])
    },
    moveSelectedToTop() {
      for (let i = 0; i < this.selectionRows.length; i++) {
        const current = this.selectionRows[i]
        const idx = this.tableList.findIndex(v => v.id === current.id)
        if (idx > -1) this.moveItemToTop(idx)
      }
    },
    deleteSelected() {
      for (let i = 0; i < this.selectionRows.length; i++) {
        const current = this.selectionRows[i]
        const idx = this.tableList.findIndex(v => v.id === current.id)
        if (idx > -1) this.tableList?.splice(idx, 1)
      }
    },
    listIncreaseRecord() {
      const record = {}
      Object.keys(this.tableHeaders).forEach(item => {
        record[item.field] = undefined
      })
      if (this.listIncreaseConf.type === 'append') {
        this.tableList.push(record)
      } else if (this.listIncreaseConf.type === 'unshift') {
        this.tableList.unshift(record)
      } else {
        console.warn('unknown listIncrease type')
      }
      this.rowKey++
    },
    cellChange(index, field, value) {
      this.$emit('cell-change', { index, field, value })
    },
    getColumnProps(props) {
      return {
        sortable: props.sortable ? 'custom' : false
      }
    },
    sortTable({ column, order, prop }) {
      if (!(order && prop)) {
        this.sort = null
        return
      }

      this.sort = { _sort_by: prop, _sort_type: order === 'descending' ? 'desc' : 'asc' }
      const defaultSort = { prop, order }
      const preDefaultSort = this.tableTableProps.defaultSort
      if (JSON.stringify(preDefaultSort) === JSON.stringify(defaultSort)) {
        return
      }
      this.tableTableProps.defaultSort = defaultSort
      this.load()
    },
    loadChildren(row, treeNode, resolve) {
      this.$http
        .request({
          type: 'GET',
          url: this.tableListApi.replace('/list', '/children'),
          params: { pid: row.id }
        })
        .then(({ data }) => {
          resolve(data || [])
        })
    },
    btnAction() {
      console.log('btnAction')
      this.load()
    },
    getExportInfo() {
      return {
        listApi: this.tableListApi,
        params: this.filterForm,
        header: cloneDeep(this.tableHeaders),
        name: getPageTitle(this.$route ? this.$route.matched : [], false)
      }
    },
    exportCurrentTable() {
      this.exporting = true
      const headers = []
      const fields = []
      const headersMap = {}
      this.tableHeaders.forEach(item => {
        headers.push(item.label)
        headersMap[item.field] = item
        fields.push(item.field)
      })

      const list = [];
      (this.tableList || []).forEach(item => {
        const row = []
        fields.forEach(each => {
          let val = item[each]
          if (val === undefined) {
            row.push('')
            return
          }
          const column = headersMap[each]
          switch (column.type) {
            case 'enum': {
              const index = findIndex(column.options, {
                value: val
              })
              const obj = column.options ? column.options[index] : false
              val = obj ? obj.label : val
              break
            }
          }

          row.push(val)
        })
        list.push(row)
      })
      const title = document.title || (new Date()).getTime()
      exportJson2Excel(headers, list, title, false)
      this.exporting = false
    },
    dragSortHandle(event: SortableEvent) {
      if (!this.dragSortEnable) {
        return
      }

      this.tableTableProps.defaultSort = {}

      const { newIndex, oldIndex } = event
      console.log('event', event)
      let currRow = {}
      if (this.tableList?.length > 0) {
        currRow = this.tableList.splice(oldIndex, 1)[0]
        this.tableList.splice(newIndex, 0, currRow)
        this.tableKey++
      }

      let dragSortApi = ''
      let needConfirm = false
      let confirmMsg = '此操作将会改变数据顺序, {oldIndex} => {newIndex}, 是否确认此操作?'
      if (isString(this.$props.dragSort) && this.$props.dragSort) {
        dragSortApi = this.$props.dragSort
      }
      if (isObject(this.$props.dragSort) && this.$props.dragSort.sortApi) {
        dragSortApi = this.$props.dragSort.sortApi
        needConfirm = this.$props.dragSort.confirm === true
        if (this.$props.dragSort.confirmMsg) {
          confirmMsg = this.$props.dragSort.confirmMsg
        }
        console.log('need', this.$props.dragSort, needConfirm)
      }

      if (!dragSortApi) {
        return
      }

      const ids = []
      this.tableList?.forEach(item => {
        if (item.id !== undefined) {
          ids.push(item.id)
        }
      })

      if (ids.length === 0) {
        return
      }

      // console.log(dragSortApi, needConfirm, ids)

      const sortHandler = () => this.$http.request({
        method: 'POST',
        url: dragSortApi,
        data: {
          ids: ids.join(',')
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '排序更新成功, 数据将刷新'
        })
        this.$emit('dragSort')
        this.load()
      })

      if (needConfirm) {
        ElMessageBox.confirm(
          strVarReplace(confirmMsg, { ...currRow, oldIndex: oldIndex + 1, newIndex: newIndex + 1 }),
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            sortHandler()
          })
          .catch(() => {
            const currRow = this.tableList.splice(newIndex, 1)[0]
            this.tableList.splice(oldIndex, 0, currRow)
            this.tableKey++
            ElMessage({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        sortHandler()
      }
    },
    getListData() {
      return this.tableList
    },
    localSortHandler(a, b) {
      console.log(a, b)
    }
  }
})
</script>
<style lang="scss" scoped>
.filter-form {
  ::v-deep(.el-form-item__label) {
    /*text-align-last: justify;*/
  }
}

.selected-info {
  padding: 10px 0;
  height: 28px;
  line-height: 28px;
  color: #909399;
  font-size: 13px;
}

.table-pagination {
  float: right;
  padding: 10px 0;

  ::v-deep(.el-pagination) {
    padding-left: 0;
    padding-right: 0;
  }
}

.normal-button {
  text-align: right;
  float: right;
}

.table-filter {
  margin-bottom: 15px;
}

::v-deep(.el-divider--horizontal) {
  margin: 10px 0;
}

::v-deep(.table-header-cell) {
  background-color: #f5f5f5;
}

::v-deep(.el-button + .el-button) {
  margin-left: 0;
}

::v-deep(.el-button) {
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  .el-dropdown {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.list-incr-button {
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
}

::v-deep(.el-card__body) {
  padding-bottom: 0;
}
</style>
<style>
.el-tabs--border-card>.el-tabs__content {
  padding: 0;
}

.table-highlight {
  background: #67C23A;
  animation: tableHighlight 2s;
  animation-iteration-count: infinite;
}

@keyframes tableHighlight {
  0% {
    background: #67C23A;
  }

  25% {
    background: #E6A23C;
  }

  50% {
    background: #F56C6C;
  }

  100% {
    background: #67C23A;
  }
}
</style>
