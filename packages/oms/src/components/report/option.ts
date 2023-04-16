// @ts-nocheck
import { cloneDeep, merge } from 'lodash'
import { isObject, isString } from '@okiss/utils'

const pie = {
  title: {
    text: 'Referer of a Website',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'bottom'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const lienOption = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  legend: {
    data: []
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: []
}

export function makeOption(id: string, config: Object|string, data: Array<Record<string, any>>) {
  if (data.length === 0) {
    return {}
  }
  let opt = merge({}, lienOption)
  opt.title.text = id
  if (isString(config)) {
    const xAxisData = []
    const keys = Object.keys(data[0])
    let xkey = keys[0]
    let ykeys = keys.filter((v, i) => i > 0)
    let type = config
    if (config.indexOf(':') > -1) {
      const token = config.split(':')
      const _keys = token[1].split(',')
      type = token[0]
      xkey = _keys[0]
      ykeys = _keys.filter((v, i) => i > 0)
    }
    ykeys.forEach(key => {
      const seriesData = []
      data.forEach(each => {
        seriesData.push(each[key])
      })
      opt.series.push({
        name: key,
        type: type,
        smooth: true,
        data: seriesData
      })
      opt.legend.data.push(key)
    })

    data.forEach(each => {
      xAxisData.push(each[xkey])
    })

    opt.xAxis.data = xAxisData
  }

  if (isObject(config)) {
    opt = merge(opt, config)
  }
  // const _pie = cloneDeep(pie)
  // _pie.title.text = id
  // _pie.series[0].data = data
  //
  // return _pie
  console.log(111, opt)
  return opt
}
