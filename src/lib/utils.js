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

// Use to make reactive statements code more explicit:
// Ex: allows to replace:
//     $: someVariable != null && doSomething()     // Not possible for variables that could actually == null
//     $: if (someVariable != null) doSomething()   // Not possible for variables that could actually == null
//     $: if (someVariable || true) doSomething()
// with:
//     $: onChange(someVariable, doSomething)
//     $: onChange(someVariable, someOtherVariable, doSomething)
// The syntax is tought to invite wrapping other variables
// for which we should NOT watch for change in the callback,
// so that they don't trigger the reactive execution
export const onChange = (...args) => {
  const callback = args.slice(-1)[0]
  callback()
}

export const uniq = array => Array.from(new Set(array))
