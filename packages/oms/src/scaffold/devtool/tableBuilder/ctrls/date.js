export default {
  type: 'date',
  name: '日期',
  default: {
    type: 'date',
    label: '时间',
    field: 'field_name'
  },
  builder: [
    {
      type: 'input',
      field: 'label',
      label: '字段名'
    },
    {
      type: 'input',
      field: 'field',
      label: '字段key'
    }
  ]
}
