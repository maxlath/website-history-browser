export function reorderObject (obj, fn) {
  const newObj = {}
  Object.keys(obj).sort(fn).forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj
}

export function keyBy (array, keyAttribute) {
  const obj = {}
  array.forEach(value => {
    const key = value[keyAttribute]
    obj[key] = value
  })
  return obj
}
