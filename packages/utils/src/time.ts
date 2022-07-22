import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function stampToTime(stamp: number) {
  return stamp ? dayjs(stamp * 1000).format(DATE_FORMAT) : ''
}

export function timeToStamp(time: string) {
  return time ? dayjs(time).unix() : ''
}

// 1d2h3m4s
export const isDurationStr = (str: string) => /^-?\d+d|-?\d+h|-?\d+m|-?\d+s$/.test(str)
export const duration = (durationStr: string, sourceDate?: Date) : Date => {
  let d = (new Date() || sourceDate).getTime()
  const regex = /(-?\d+)d|(-?\d+)h|(-?\d+)m|(-?\d+)s/gm
  const parts = durationStr.match(regex) || []
  for (let i = 0; i < parts.length; i++) {
    const token = parts[i].match(/(-?\d+)(\w)/)
    if (!token) {
      continue
    }
    switch (token[2]) {
      case 'd':
        d += parseInt(token[1]) * (86400 * 1000)
        break
      case 'h':
        d += parseInt(token[1]) * (3600 * 1000)
        break
      case 'm':
        d += parseInt(token[1]) * (60 * 1000)
        break
      case 's':
        d += parseInt(token[1]) * (1000)
        break
    }
  }
  return new Date(d)
}

export const isDataStr = (str: string): boolean => {
  if (['yesterday', 'yesterday'].indexOf(str) > -1) {
    return true
  }
  if (isDurationStr(str)) {
    return true
  }
  return dayjs(str).isValid()
}
export const strToDate = (str: string): Date | null => {
  const d = new Date()
  switch (str) {
    case 'yesterday':
      d.setDate(new Date().getDate() - 1)
      return d
    case 'tomorrow':
      d.setDate(new Date().getDate() + 1)
      return d
    case 'today':
      return d
  }
  if (isDurationStr(str)) {
    return duration(str)
  }
  return dayjs(str).toDate()
}

export const runRule = (a : any, b: any, o: any) => { const f = (new Function(`return (a, b) => a ${o} b`))(); return f(a, b) }

/** 当前时间 */
export const nowtime = () => {
  return dayjs.unix(Math.floor(new Date().getTime() / 1000)).format(DATE_FORMAT)
}
