import { daysAgoText } from './utils'
const theBeginningOfTimes = new Date(0)

export async function getHistoryByPeriod ({ origin }) {
  let historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: Number.MAX_SAFE_INTEGER
  })

  historyItems = historyItems.filter(item => item.url.startsWith(origin))

  const historyItemsByPeriod = {}
  for (const historyItem of historyItems) {
    const period = daysAgoText(historyItem.lastVisitTime)
    historyItemsByPeriod[period] = historyItemsByPeriod[period] || []
    historyItemsByPeriod[period].push(historyItem)
  }

  return historyItemsByPeriod
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
