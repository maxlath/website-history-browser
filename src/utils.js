export function keyBy (array, keyAttribute) {
  const obj = {}
  array.forEach(value => {
    const key = value[keyAttribute]
    obj[key] = value
  })
  return obj
}

export function logErrorAndRethrow (err) {
  console.error(err)
  throw err
}
