export const testJson = [
  {
    logic: '',
    field: '1',
    operator: '<',
    value: 1.0,
    children: [{
      logic: 'and',
      field: '1',
      operator: '>',
      value: 1.1
    }, {
      logic: 'and',
      field: '1',
      operator: '>',
      value: 1.2
    }]
  },
  {
    logic: 'or',
    field: '2',
    operator: '',
    value: ''
  },
  {
    logic: 'and',
    field: '3',
    operator: '<=',
    value: 4.6
  },
  {
    logic: 'and',
    field: '4',
    operator: '<=',
    value: 4.6,
    children: [{
      logic: 'and',
      field: '1',
      operator: '>',
      value: 4.4
    }]
  }
]
