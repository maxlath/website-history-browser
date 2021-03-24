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

export const bubbleUp = (dispatch, eventName) => ({ detail }) => dispatch('select', detail)

export const getPathnameSections = pathname => {
  return pathname
  .slice(1)
  .split('/')
  // Drop last part, be it '' or a file within a folder
  // Ex:
  // - /foo/bar => [ 'foo' ]
  // - /foo/bar/ => [ 'foo', 'bar' ]
  .slice(0, -1)
}

export function resilientDecodeURIComponent (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    console.warn('catched by resilientDecodeURIComponent', err, str)
    return str
  }
}
