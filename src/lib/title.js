export const findGlobalTitle = items => {
  items = items.filter(item => item.title != null)

  if (items.length < 5) return

  const parts = {}
  items.forEach(({ title }) => {
    title.split(partSeparators).slice(1)
    .forEach(part => {
      parts[part] = parts[part] || 0
      parts[part]++
    })
  })

  const recurrentParts = Object.keys(parts)
    .filter(part => parts[part] > 0.9 * items.length)

  const { title: titleWithRecurrentParts } = items.find(item => {
    return recurrentParts.every(part => item.title.includes(part))
  })

  const firstRecurrentPartIndex = Math.min(...recurrentParts.map(part => titleWithRecurrentParts.indexOf(part)))

  return titleWithRecurrentParts.slice(firstRecurrentPartIndex)
}

export const getShortTitle = (itemTitle, globalTitlePattern) => {
  if (!globalTitlePattern || itemTitle === '') return itemTitle
  const shortTitle = itemTitle
    .replace(endSeparators, '')
    .replace(globalTitlePattern, '')
    .replace(endSeparators, '')
  return shortTitle
}

const partSeparators = /\s*[-—–|/]{1}\s*/g
const endSeparators = /(\s*[-—–|/]{1}\s*)*$/
