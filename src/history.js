import { daysAgoText } from './utils'
const theBeginningOfTimes = new Date(0)

export async function getHistoryByPeriod ({ origin }) {
  const [ historyItems, bookmarksPerUrl ] = await Promise.all([
    getHistoryItem(origin),
    getBookmarksPerUrl(origin),
  ])

  const globalTitle = findGlobalTitle(historyItems)
  setShortTitle(historyItems, globalTitle)

  const historyItemsByPeriod = {}
  for (const historyItem of historyItems) {
    const period = daysAgoText(historyItem.lastVisitTime)
    historyItemsByPeriod[period] = historyItemsByPeriod[period] || []
    historyItemsByPeriod[period].push(historyItem)
    historyItem.bookmarks = bookmarksPerUrl[historyItem.url]
  }

  return { historyItemsByPeriod, globalTitle }
}

export function findPeriodsToShow (historyItemsByPeriod, limit) {
  let total = 0
  const shownPeriod = {}
  for (const period in historyItemsByPeriod) {
    shownPeriod[period] = total < limit
    total += historyItemsByPeriod[period].length
  }
  return shownPeriod
}

export function filterByText (historyItemsByPeriod, text) {
  if (!text || text === '') return historyItemsByPeriod
  const filteredItemsByPeriod = {}
  const pattern = new RegExp(text, 'i')
  const titleOrUrlMatch = item => pattern.test(item.title) || pattern.test(item.url)
  for (const [ period, items ] of Object.entries(historyItemsByPeriod)) {
    const filteredItems = items.filter(titleOrUrlMatch)
    if (filteredItems.length > 0) filteredItemsByPeriod[period] = filteredItems
  }
  return filteredItemsByPeriod
}

const getHistoryItem = async origin => {
  const historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: Number.MAX_SAFE_INTEGER
  })
  return historyItems.filter(item => item.url.startsWith(origin))
}

const getBookmarksPerUrl = async origin => {
  const bookmarksPerUrl = {}
  const bookmarks = await browser.bookmarks.search(origin)
  for (const bookmark of bookmarks) {
    const { url } = bookmark
    bookmarksPerUrl[url] = bookmarksPerUrl[url] || []
    bookmarksPerUrl[url].push(bookmark)
  }
  return bookmarksPerUrl
}

const findGlobalTitle = items => {
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

const setShortTitle = (items, globalTitle) => {
  items.forEach(item => {
    item.shortTitle = item.title
      .replace(globalTitle, '')
      .replace(endSeparators, '')
  })
}

const partSeparators = /\s*[-—\|]{1}\s*/g
const endSeparators = /(\s*[-—\|]{1}\s*)*$/
