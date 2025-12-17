import jsonpath from 'jsonpath'

export function getObjectNodeByKeyTree(keyTree: string, object: Record<string, any>, defaultVal?: any) {
  const normalizedKeyTree = keyTree.replace(/^\.+/, '')
  const jsonPath = normalizedKeyTree
    ? normalizedKeyTree.startsWith('$')
      ? normalizedKeyTree
      : `$.${normalizedKeyTree}`
    : '$'
  let val
  try {
    val = jsonpath.value(object, jsonPath)
  } catch {
    val = undefined
  }
  console.log("getObjectNodeByKeyTree", keyTree, val, object )
  return val === undefined || val === null ? defaultVal : val
}
