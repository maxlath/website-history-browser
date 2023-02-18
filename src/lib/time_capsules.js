const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const year = 365.25 * day
const month = year / 12

export function getNextVisitSummary (date) {
  date = new Date(date)
  const timeFromNow = date.getTime() - Date.now()
  if (timeFromNow > 2 * year) {
    const yearsFromNow = Math.round(timeFromNow / year)
    return `${yearsFromNow}Y`
  } else if (timeFromNow > 3 * month) {
    const monthsFromNow = Math.round(timeFromNow / month)
    return `${monthsFromNow}M`
  } else if (timeFromNow > 3 * week) {
    const weeksFromNow = Math.round(timeFromNow / week)
    return `${weeksFromNow}W`
  } else if (timeFromNow > 3 * day) {
    const daysFromNow = Math.round(timeFromNow / day)
    return `${daysFromNow}D`
  } else if (timeFromNow > 1 * hour) {
    const hoursFromNow = Math.round(timeFromNow / hour)
    return `${hoursFromNow}H`
  } else {
    return ''
  }
}
