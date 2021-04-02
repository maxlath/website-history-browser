import { property, sum } from './utils'
import { sortModes } from './sort'

const byLastVisited = sortModes.date.fn

export function ignoreUrlParts ({ filteredItems, ignoreQueryStrings, ignoreHashes }) {
  if (!ignoreQueryStrings && !ignoreHashes) return filteredItems

  const itemsByCleanedUrls = {}
  for (const item of filteredItems) {
    const { search, hash } = new URL(item.url)
    let cleanedUrl = item.cleanedUrl
    if (ignoreQueryStrings) cleanedUrl = cleanedUrl.replace(search, '')
    if (ignoreHashes) cleanedUrl = cleanedUrl.replace(hash, '').replace(/#$/, '')
    itemsByCleanedUrls[cleanedUrl] = itemsByCleanedUrls[cleanedUrl] || []
    itemsByCleanedUrls[cleanedUrl].push(item)
  }

  return Object.keys(itemsByCleanedUrls)
  .map(cleanedUrl => mergeItems(itemsByCleanedUrls[cleanedUrl], cleanedUrl))
}

const mergeItems = (items, cleanedUrl) => {
  if (items.length === 1) return items[0]
  const aggregatedVisitsCount = sum(items.map(property('visitCount')))
  const mostRecentItem = items.sort(byLastVisited)[0]
  return Object.assign({}, mostRecentItem, {
    id: cleanedUrl,
    visitCount: aggregatedVisitsCount,
    cleanedUrl,
  })
}
