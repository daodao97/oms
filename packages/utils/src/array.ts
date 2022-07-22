/**
 * 数组移位
 * @param arr
 * @param old_index
 * @param new_index
 * @returns
 */
export function movePosition(arr: Array<any>, old_index: number, new_index: number) {
  if (!arr || arr.length === 0) {
    return arr
  }
  while (old_index < 0) {
    old_index += arr.length
  }
  while (new_index < 0) {
    new_index += arr.length
  }

  // 临界索引补位
  if (new_index >= arr.length) {
    let k = new_index - arr.length
    while (k-- + 1) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}
