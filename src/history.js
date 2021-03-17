import { daysAgoText } from './utils'
const theBeginningOfTimes = new Date(0)

export async function getHistoryByPeriod ({ origin }) {
  let historyItems = await browser.history.search({
    text: origin,
    startTime: theBeginningOfTimes,
    maxResults: 5000
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
