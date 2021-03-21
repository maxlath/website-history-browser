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

export const property = attribute => obj => obj[attribute]

export const sum = array => array.reduce(add, 0)

export const add = (a, b) => a + b

export const hide = ({ target }) => {
  target.style.display = 'none'
}
