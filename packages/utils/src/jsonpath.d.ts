declare module 'jsonpath' {
  export function query(obj: any, path: string, count?: number): any[]
  export function value(obj: any, path: string, newValue?: any): any

  const _default: {
    query: typeof query
    value: typeof value
  }

  export default _default
}
