import { property, resilientDecodeURIComponent, sum } from './utils'
import { sortModes } from './sort'
import { addUrlToHistory } from './history_browser_history'

const byLastVisited = sortModes.date.fn

export function ignoreUrlParts ({ filteredItems, ignoreQueryStrings, ignoreHashes, ignoreCase }) {
  if (!ignoreQueryStrings && !ignoreHashes && !ignoreCase) return filteredItems

  const itemsByCleanedUrls = {}
  for (const item of filteredItems) {
    const { search, hash } = new URL(item.url)
    let cleanedUrl = item.cleanedUrl
    if (ignoreQueryStrings) {
      cleanedUrl = cleanedUrl
        .replace(resilientDecodeURIComponent(search), '')
        .replace(/\?$/, '')
    }
    if (ignoreHashes) {
      cleanedUrl = cleanedUrl
        .replace(hash, '')
        .replace(/#$/, '')
    }
    if (ignoreCase) {
      cleanedUrl = cleanedUrl.toLowerCase()
    }
    cleanedUrl = cleanedUrl.replace(/\/$/, '')
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

export async function setUrl (url) {
  if (url) {
    window.location.href += `?url=${encodeURI(url)}`
    await addUrlToHistory(url)
  } else {
    const { origin, pathname } = window.location
    window.location.href = `${origin}${pathname}`
  }
}

export function getWebsiteHistoryUrl (websiteUrl) {
  return `/index.html?url=${encodeURI(websiteUrl)}`
}
