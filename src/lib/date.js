import { keyBy } from './utils'

const oneDay = 24 * 60 * 60 * 1000

export const daysAgo = epochTime => Math.floor((Date.now() - epochTime) / oneDay)

export const periods = [
  { thresold: 1, label: 'today', selector: 'last 24 hours' },
  { thresold: 2, label: 'yesterday', selector: 'last 48 hours' },
  { thresold: 7, label: 'last week' },
  { thresold: 30, label: 'last month' },
  { thresold: 365, label: 'last year' },
  { thresold: 365 * 2, label: 'last 2 year' },
  { thresold: 365 * 5, label: 'last 5 year' },
  { thresold: 365 * 10, label: 'last 10 year' },
  { thresold: Infinity, label: 'a while ago', selector: 'all times' },
].map(period => {
  period.className = period.label.replace(/\s/g, '-')
  return period
})

const periodByLabel = keyBy(periods, 'label')

export const daysAgoText = epochTime => {
  const numberOfDaysAgo = daysAgo(epochTime)
  for (const period of periods) {
    if (numberOfDaysAgo < period.thresold) return period.label
  }
}

const currentYear = new Date().getFullYear()

export const localDate = time => {
  const date = new Date(time)
  if (date.getFullYear() === currentYear) {
    return date.toLocaleDateString(navigator.language, { month: 'long', day: 'numeric' })
  } else {
    return date.toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export const getItemPeriod = itemLastVisitTime => {
  const periodLabel = daysAgoText(itemLastVisitTime)
  return periodByLabel[periodLabel]
}
