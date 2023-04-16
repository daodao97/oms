export default {
  type: 'radio',
  name: '单选框',
  default: {
    type: 'radio',
    label: 'label',
    field: 'field_name',
    options: []
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
    },
    {
      type: 'sub-form',
      field: 'options',
      label: '备选项',
      props: {
        formItems: [
          {
            type: 'input',
            field: 'label',
            label: '字段名'
          },
          {
            type: 'input',
            field: 'value',
            label: '字段值'
          }
        ],
        repeat: true
      }
    },
    {
      type: 'input',
      field: 'default',
      label: '默认值'
    }
  ]
}
