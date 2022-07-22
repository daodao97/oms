export default {
  type: 'code',
  name: 'Code',
  default: {
    type: 'code',
    label: 'label',
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
