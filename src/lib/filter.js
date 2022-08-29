export function filterHistoryItemsByText (historyItems, text) {
  if (!text || text === '') return historyItems
  text = text.toLowerCase()
  return historyItems.filter(item => {
    return item.title?.toLowerCase().includes(text) || item.url?.toLowerCase().includes(text)
  })
}

export function filterSectionsEntriesByText (sectionsEntries, text) {
  if (!text || text === '') return sectionsEntries
  text = text.toLowerCase()
  return sectionsEntries.filter(([ sectionName ]) => sectionName.toLowerCase().includes(text))
}
