import { getItemPeriod } from './date'
import { getBookmarksPerUrl } from './bookmarks'
import { findGlobalTitle, getShortTitle } from './title'
import { getPathnameSections } from './utils'

const theBeginningOfTimes = new Date(0)

export async function getHistoryItems ({ origin }) {
  const [ historyItems, bookmarksPerUrl ] = await Promise.all([
    getHistoryItem(origin),
    getBookmarksPerUrl(origin),
  ])

  const globalTitle = findGlobalTitle(historyItems)

  const globalTitlePattern = new RegExp(`${globalTitle}$`)
  for (const item of historyItems) {
    item.shortTitle = getShortTitle(item.title, globalTitlePattern)
    item.cleanedUrl = decodeURIComponent(item.url.replace(origin, ''))
    item.bookmarks = bookmarksPerUrl[item.url]
    item.period = getItemPeriod(item.lastVisitTime)
    item.sections = getSections(item.url)
  }

  const sections = getSectionsTree(historyItems)

  return { historyItems, globalTitle, sections }
}

const getHistoryItem = async origin => {
  const historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: Number.MAX_SAFE_INTEGER
  })
  return historyItems.filter(item => item.url.startsWith(origin))
}

export const hasBookmarks = item => item.bookmarks != null

const getSections = url => {
  const { pathname } = new URL(url)
  return getPathnameSections(pathname)
}

const getSectionsTree = items => {
  const sectionsTree = { subsections: {}, path: [], bookmarksCount: 0 }
  for (const item of items) {
    const { sections } = item
    let parentSection = sectionsTree
    for (let section of sections) {
      if (section !== '') {
        section = decodeURIComponent(section)
        if (parentSection.subsections[section] == null) {
          parentSection.subsections[section] = { items: [], subsections: {}, bookmarksCount: 0 }
        }
        const subsection = parentSection.subsections[section]
        subsection.items.push(item)
        subsection.path = parentSection.path.concat(section)
        if (item.bookmarks != null) subsection.bookmarksCount++
        parentSection = subsection
      }
    }
  }
  return sectionsTree.subsections
}

export function getSectionItemsFromPath (sections, path) {
  let selectedSection = sections
  let i = 0
  while (i < path.length) {
    const sectionName = path[i++]
    if (!(sectionName && selectedSection)) return []
    if (selectedSection[sectionName]) {
      selectedSection = selectedSection[sectionName]
    } else if (selectedSection.subsections?.[sectionName]) {
      selectedSection = selectedSection.subsections[sectionName]
    } else {
      return []
    }
    if (!selectedSection) return []
  }
  return selectedSection.items
}
