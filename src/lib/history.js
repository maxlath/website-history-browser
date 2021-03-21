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
    item.sections = getSections(item.url)
  }

  const sections = getSectionsTree(historyItems)

  return { historyItems, globalTitle, sections }
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

const getSections = url => {
  const { pathname } = new URL(url)
  return pathname
  .slice(1)
  .replace(/\/$/, '')
  .split('/')
  .slice(0, -1)
}

const getSectionsTree = items => {
  const sectionsTree = { subsections: {}, path: [] }
  for (const item of items) {
    const { sections } = item
    let parentSection = sectionsTree
    for (const section of sections) {
      if (section !== '') {
        parentSection.subsections[section] = parentSection.subsections[section] || { items: [], subsections: {} }
        parentSection.subsections[section].items.push(item)
        parentSection.subsections[section].path = parentSection.path.concat(section)
        parentSection = parentSection.subsections[section]
      }
    }
  }
  console.log('subsections', sectionsTree.subsections)
  return sectionsTree.subsections
}
