# VBTF 组件库

VBTF (Vue Better Table Form) 是一套用于快速构建后台管理界面的表格和表单组件库,基于 Vue 3 和 Element Plus 构建。

## 安装

```bash
pnpm add @okiss/vbtf
```

## 快速开始

```javascript
import { createApp } from 'vue'
import vbtf from '@okiss/vbtf'
import '@okiss/vbtf/style.css'

const app = createApp(App)
app.use(vbtf)
```

## 核心组件

### 表单组件 (Form Components)

#### VForm - 动态表单

核心表单组件,支持通过配置动态生成表单。

**基本用法:**

```vue
<template>
  <VForm
    :form-items="formItems"
    :form-options="formOptions"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { VForm } from '@okiss/vbtf'

const formItems = [
  { field: 'name', label: '姓名', type: 'input', required: true },
  { field: 'age', label: '年龄', type: 'number' },
  { field: 'email', label: '邮箱', type: 'input' }
]

const formOptions = {
  labelWidth: '100px',
  inline: false
}

const handleSubmit = (data) => {
  console.log('提交数据:', data)
}
</script>
```

**支持的表单项类型:**

- `input` - 文本输入框 (VInput)
- `number` - 数字输入框 (VNumber)
- `select` - 下拉选择器 (VSelect)
- `radio` - 单选框 (VRadio)
- `checkbox` - 多选框 (VCheckbox)
- `date` - 日期选择器 (VDate)
- `upload` - 文件上传 (VUpload)
- `cascader` - 级联选择器 (VCascader)
- `switch` - 开关 (VSwitch)
- `json` - JSON 编辑器 (VJson)
- `duration` - 时长选择器 (VDuration)
- `subform` - 子表单 (VSubForm)

#### VInput - 输入框

支持掩码输入的文本输入框。

```javascript
{
  field: 'phone',
  type: 'input',
  mask: '999-9999-9999'  // 输入掩码
}
```

#### VSelect - 下拉选择器

支持远程数据加载的下拉选择器。

```javascript
{
  field: 'category',
  type: 'select',
  options: [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 }
  ],
  // 或使用远程数据
  remote: '/api/options'
}
```

#### VUpload - 文件上传

支持多种文件类型上传。

```javascript
{
  field: 'avatar',
  type: 'upload',
  action: '/api/upload',
  accept: 'image/*',
  limit: 1
}
```

### 表格组件 (Table Components)

#### VTable - 动态表格

核心表格组件,支持通过配置动态生成表格。

**基本用法:**

```vue
<template>
  <VTable
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
  />
</template>

<script setup>
import { VTable } from '@okiss/vbtf'

const columns = [
  { field: 'name', label: '姓名', type: 'span' },
  { field: 'age', label: '年龄', type: 'span' },
  { field: 'created_at', label: '创建时间', type: 'time' }
]

const tableData = ref([])
const pagination = {
  page: 1,
  pageSize: 10,
  total: 0
}
</script>
```

### 表格单元格组件 (Table Cell Components)

#### Span - 文本显示

基础文本显示组件,支持掩码(mask)模式用于敏感数据展示。

**基本用法:**

```javascript
{
  field: 'name',
  type: 'span'
}
```

**掩码模式:**

用于隐藏敏感信息,如手机号、身份证号、密钥等。默认显示前3后3字符。

```javascript
// 简单启用(默认前3后3)
{
  field: 'phone',
  type: 'span',
  mask: true
}
// 示例: 13812345678 → 138******678

// 自定义掩码配置
{
  field: 'idCard',
  type: 'span',
  mask: {
    prefix: 4,  // 显示前4位
    suffix: 4,  // 显示后4位
    char: '*'   // 掩码字符,默认 *
  }
}
// 示例: 310123199001011234 → 3101******1234
```

**Mask 模式功能:**
- 自动显示复制图标,点击可复制完整原始值
- 短文本会智能处理,保留首尾字符
- 使用等宽字体显示,便于阅读

#### Time - 时间格式化

时间格式化组件,支持智能格式化、相对时间、自定义格式。

**基本用法(智能格式化):**

```javascript
{
  field: 'created_at',
  type: 'time'
}
```

**智能格式化规则:**
- 今天: `今天 14:30`
- 昨天: `昨天 09:15`
- 今年内: `12-18 15:31`
- 更早: `2024-12-18 15:31`

鼠标悬停时显示完整时间格式。

**自定义格式:**

```javascript
{
  field: 'created_at',
  type: 'time',
  format: 'YYYY年MM月DD日 HH:mm'
}
```

支持的格式化占位符(基于 dayjs):
- `YYYY` - 四位年份
- `MM` - 两位月份
- `DD` - 两位日期
- `HH` - 24小时制小时
- `mm` - 分钟
- `ss` - 秒

**相对时间模式:**

显示"几分钟前"、"几小时前"、"几天前"等友好格式。

```javascript
{
  field: 'updated_at',
  type: 'time',
  relative: true,
  relativeDays: 7  // 7天内显示相对时间,超过则显示日期
}
```

**配置参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| format | string | '' | 自定义格式字符串 |
| relative | boolean | false | 是否启用相对时间模式 |
| relativeDays | number | 7 | 相对时间的天数阈值 |

#### Enum - 枚举值显示

将枚举值转换为可读文本,支持标签样式。

```javascript
{
  field: 'status',
  type: 'enum',
  enum: {
    1: { label: '启用', type: 'success' },
    0: { label: '禁用', type: 'danger' }
  }
}
```

#### Image - 图片显示

图片展示组件,支持预览。

```javascript
{
  field: 'avatar',
  type: 'image',
  width: 50,
  height: 50
}
```

#### Link - 链接

可点击的链接组件。

```javascript
{
  field: 'url',
  type: 'link',
  text: '查看详情'
}
```

#### Json - JSON 显示

格式化显示 JSON 数据。

```javascript
{
  field: 'config',
  type: 'json'
}
```

#### Icon - 图标

显示图标。

```javascript
{
  field: 'icon',
  type: 'icon'
}
```

#### Chart - 图表

在表格单元格中显示小型图表。

```javascript
{
  field: 'trend',
  type: 'chart',
  chartType: 'line'
}
```

#### Player - 视频播放器

视频播放组件。

```javascript
{
  field: 'video_url',
  type: 'player'
}
```

#### SortIndex - 排序索引

显示可拖拽排序的索引。

```javascript
{
  field: 'sort',
  type: 'sortIndex'
}
```

### 其他组件

#### VIcon - 图标组件

图标显示组件。

```vue
<VIcon name="el-icon-edit" />
```

#### VChart - 图表组件

基于 ECharts 的图表组件。

```vue
<VChart :option="chartOption" />
```

#### JsonView - JSON 查看器

JSON 数据可视化查看器。

```vue
<JsonView :data="jsonData" />
```

## 工具函数

### regCustomFormComps

注册自定义表单组件。

```javascript
import { regCustomFormComps } from '@okiss/vbtf'

regCustomFormComps({
  'my-custom-input': MyCustomInput
})
```

### setUploadHeaderHandle

设置上传请求的请求头处理函数。

```javascript
import { setUploadHeaderHandle } from '@okiss/vbtf'

setUploadHeaderHandle(() => {
  return {
    'X-Token': getToken()
  }
})
```

## TypeScript 支持

VBTF 提供完整的 TypeScript 类型定义。

```typescript
import type { FormProps } from '@okiss/vbtf'

const formProps: FormProps = {
  formItems: [],
  formOptions: {}
}
```
