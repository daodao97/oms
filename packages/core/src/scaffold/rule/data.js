export default {
  rules: [
    ['version', '>', '1.3.0'],
    ['ip', '=', '北京'],
    [
      ['version', '>', '1.3.0'],
      ['ip', '=', '北京']
    ],
    [
      ['version', '=', ''],
      ['ip', '=', '']
    ]
  ],
  filters: [
    { label: '版本', field: 'version' },
    { label: 'ip', field: 'ip' }
  ],
  sets: [
    { label: '活动ID', field: 'version' },
    { label: '文案', field: 'ip' },
    { label: '标题', field: 'ip' }
  ]
}
