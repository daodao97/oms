const age = 30 * 24 * 60 * 60 * 1000

interface RelValue {
    value: any,
    expireAt: number,
    createAt: number
}

const Cache = {
  set(key: string, value: any, ttl: number) { // ttl 单位秒
    localStorage.removeItem(key)
    const _time = new Date().getTime()
    const _age = ttl ? ttl * 1000 : age
    const _value = {
      value: value,
      createAt: _time,
      expireAt: _time + _age
    }
    localStorage.setItem(key, JSON.stringify(_value))
    return this
  },
  exist(key: string) {
    return localStorage.getItem(key) !== null
  },
  isExpire(key: string) {
    const value = localStorage.getItem(key)
    if (!value) {
      return false
    }
    const now = new Date().getTime()
    const realValue: RelValue = JSON.parse(value)
    return now > realValue.expireAt
  },
  get(key: string) {
    const isExpire = this.isExpire(key)
    if (isExpire) {
      this.remove(key)
      return null
    }
    const value = localStorage.getItem(key)
    const tmpValue: RelValue = JSON.parse(value || '{}')
    return tmpValue.value
  },
  remove(key: string) {
    return localStorage.removeItem(key)
  }
}

export default Cache
