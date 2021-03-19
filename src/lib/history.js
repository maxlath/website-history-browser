import { getItemPeriod } from './date'
import { getBookmarksPerUrl } from './bookmarks'
import { findGlobalTitle, getShortTitle } from './title'

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
    item.period = getItemPeriod(item.lastVisitTime)
  }

  return { historyItems, globalTitle }
}

export function filterByText (historyItems, text) {
  if (!text || text === '') return historyItems
  text = text.toLowerCase()
  return historyItems.filter(item => {
    return item.title.toLowerCase().includes(text) || item.url.toLowerCase().includes(text)
  })
}

const getHistoryItem = async origin => {
  const historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: 10000
  })
  return historyItems.filter(item => item.url.startsWith(origin))
}

export const hasBookmarks = item => item.bookmarks != null
