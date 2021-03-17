import { keyBy } from './utils'

const oneDay = 24 * 60 * 60 * 1000

export const daysAgo = epochTime => Math.floor((Date.now() - epochTime) / oneDay)

const periods = [
  { thresold: 1, label: 'today' },
  { thresold: 2, label: 'yesterday' },
  { thresold: 7, label: 'this last week' },
  { thresold: 30, label: 'this last month' },
  { thresold: 365, label: 'this last year' },
  { thresold: 365 * 2, label: 'this last 2 year' },
  { thresold: 365 * 5, label: 'this last 5 year' },
  { thresold: 365 * 10, label: 'this last 10 year' },
  { thresold: Infinity, label: 'a while ago' },
]

export const periodByLabel = keyBy(periods, 'label')

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
