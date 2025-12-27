# BTF

BTF (Better Table Form) 是一套用于快速构建后台管理界面的表格和表单组件库。

## Table Cell 组件

### Span 组件

基础文本显示组件，支持掩码(mask)模式用于敏感数据展示。

#### 基本用法

```javascript
{
  field: 'name',
  type: 'span'
}
```

#### 掩码模式

用于隐藏敏感信息，如手机号、身份证号、密钥等。默认显示前3后3字符。

```javascript
// 简单启用（默认前3后3）
{
  field: 'phone',
  type: 'span',
  mask: true
}
// 示例: 13812345678 → 138******678
```

#### 自定义掩码配置

```javascript
{
  field: 'idCard',
  type: 'span',
  mask: {
    prefix: 4,  // 显示前4位
    suffix: 4,  // 显示后4位
    char: '*'   // 掩码字符，默认 *
  }
}
// 示例: 310123199001011234 → 3101******1234
```

#### Mask 模式功能

- 自动显示复制图标，点击可复制完整原始值
- 短文本会智能处理，保留首尾字符
- 使用等宽字体显示，便于阅读

---

### Time 组件

时间格式化组件，支持智能格式化、相对时间、自定义格式。

#### 基本用法（智能格式化）

```javascript
{
  field: 'created_at',
  type: 'time'
}
```

**智能格式化规则：**
- 今天: `今天 14:30`
- 昨天: `昨天 09:15`
- 今年内: `12-18 15:31`
- 更早: `2024-12-18 15:31`

鼠标悬停时显示完整时间格式。

#### 自定义格式

```javascript
{
  field: 'created_at',
  type: 'time',
  format: 'YYYY年MM月DD日 HH:mm'
}
```

支持的格式化占位符（基于 dayjs）：
- `YYYY` - 四位年份
- `MM` - 两位月份
- `DD` - 两位日期
- `HH` - 24小时制小时
- `mm` - 分钟
- `ss` - 秒

#### 相对时间模式

显示"几分钟前"、"几小时前"、"几天前"等友好格式。

```javascript
{
  field: 'updated_at',
  type: 'time',
  relative: true,
  relativeDays: 7  // 7天内显示相对时间，超过则显示日期
}
```

#### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| format | string | '' | 自定义格式字符串 |
| relative | boolean | false | 是否启用相对时间模式 |
| relativeDays | number | 7 | 相对时间的天数阈值 |