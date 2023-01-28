import { property, resilientDecodeURIComponent, sum } from './utils'
import { sortModes } from './sort'

const byLastVisited = sortModes.date.fn

export function ignoreUrlParts ({ filteredItems, ignoreQueryStrings, ignoreHashes }) {
  if (!ignoreQueryStrings && !ignoreHashes) return filteredItems

  const itemsByCleanedUrls = {}
  for (const item of filteredItems) {
    const { search, hash } = new URL(item.url)
    let cleanedUrl = item.cleanedUrl
    if (ignoreQueryStrings) cleanedUrl = cleanedUrl.replace(resilientDecodeURIComponent(search), '')
    if (ignoreHashes) cleanedUrl = cleanedUrl.replace(hash, '').replace(/#$/, '')
    itemsByCleanedUrls[cleanedUrl] = itemsByCleanedUrls[cleanedUrl] || []
    itemsByCleanedUrls[cleanedUrl].push(item)
  }

  return Object.keys(itemsByCleanedUrls)
  .map(cleanedUrl => mergeItems(itemsByCleanedUrls[cleanedUrl], cleanedUrl))
}

const mergeItems = (items, cleanedUrl) => {
  let aggregatedVisitsCount, mostRecentItem
  if (items.length === 1) {
    mostRecentItem = items[0]
    aggregatedVisitsCount = mostRecentItem.visitCount
  } else {
    aggregatedVisitsCount = sum(items.map(property('visitCount')))
    mostRecentItem = items.sort(byLastVisited)[0]
  }
  return Object.assign({}, mostRecentItem, {
    id: cleanedUrl,
    visitCount: aggregatedVisitsCount,
    cleanedUrl,
  })
}

export function setUrl (url) {
  if (url) {
    window.location.href += `?url=${encodeURI(url)}`
  } else {
    const { origin, pathname } = window.location
    window.location.href = `${origin}${pathname}`
  }
}
