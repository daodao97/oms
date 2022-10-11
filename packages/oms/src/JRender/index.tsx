const components : Record<string, any> = {}

export function regComponents(comps: Record<string, any>) {
  Object.keys(comps).forEach(k => {
    components[k] = comps[k]
  })
}

export const jrender = (schema: Array<any>) => {
  return <div>ok</div>
}
