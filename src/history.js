import { daysAgoText, periodByLabel } from './date'
import { reorderObject } from './utils'
import { getBookmarksPerUrl } from './bookmarks'
const theBeginningOfTimes = new Date(0)

export async function getHistoryItems ({ origin }) {
  const [ historyItems, bookmarksPerUrl ] = await Promise.all([
    getHistoryItem(origin),
    getBookmarksPerUrl(origin),
  ])

  const globalTitle = findGlobalTitle(historyItems)

  for (const item of historyItems) {
    item.shortTitle = getShortTitle(item.title, globalTitle)
    item.bookmarks = bookmarksPerUrl[item.url]
  }

  return { historyItems, globalTitle }
}

export function spreadItemsByPeriod (historyItems) {
  const historyItemsByPeriod = {}
  for (const historyItem of historyItems) {
    const period = historyItem._period || daysAgoText(historyItem.lastVisitTime)
    historyItem._period = period
    historyItemsByPeriod[period] = historyItemsByPeriod[period] || []
    historyItemsByPeriod[period].push(historyItem)
  }
  return reorderObject(historyItemsByPeriod, byPeriodThreshold)
}

const byPeriodThreshold = (a, b) => periodByLabel[a].threshold - periodByLabel[b].threshold

export function findPeriodsToShow (historyItemsByPeriod, limit) {
  let total = 0
  const shownPeriod = {}
  for (const period in historyItemsByPeriod) {
    shownPeriod[period] = total < limit
    total += historyItemsByPeriod[period].length
  }
  return shownPeriod
}

export function filterByText (historyItems, text) {
  if (!text || text === '') return historyItems
  const pattern = new RegExp(text, 'i')
  return historyItems.filter(item => {
    return pattern.test(item.title) || pattern.test(item.url)
  })
}

const getHistoryItem = async origin => {
  const historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: Number.MAX_SAFE_INTEGER
  })
  return historyItems.filter(item => item.url.startsWith(origin))
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

const getShortTitle = (itemTitle, globalTitle) => {
  if (!globalTitle) return itemTitle
  return itemTitle
  .replace(globalTitle, '')
  .replace(endSeparators, '')
}

const partSeparators = /\s*[-—\|]{1}\s*/g
const endSeparators = /(\s*[-—\|]{1}\s*)*$/

export const hasBookmarks = item => item.bookmarks != null
