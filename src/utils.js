const oneDay = 24 * 60 * 60 * 1000

export const daysAgo = epochTime => Math.floor((Date.now() - epochTime) / oneDay)

export const daysAgoText = epochTime => {
  const numberOfDaysAgo = daysAgo(epochTime)
  if (numberOfDaysAgo < 1) return 'today'
  if (numberOfDaysAgo < 2) return 'yesterday'
  if (numberOfDaysAgo < 7) return 'this last week'
  if (numberOfDaysAgo < 30) return 'this last month'
  if (numberOfDaysAgo < 365) return 'this last year'
  if (numberOfDaysAgo < 365 * 2) return 'this last 2 year'
  if (numberOfDaysAgo < 365 * 5) return 'this last 5 year'
  if (numberOfDaysAgo < 365 * 10) return 'this last 10 year'
  return 'a while ago'
}
