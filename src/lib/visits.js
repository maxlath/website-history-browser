export const getHighlightClass = visitCount => {
  const powersOfTen = Math.trunc(Math.log10(visitCount))
  return Math.max(Math.min(powersOfTen, 4), 0)
}

const styleByHighlightClass = {
  0: {
    backgroundColor: '#bbb',
    color: '#fff',
  },
  1: {
    backgroundColor: '#175365',
    color: '#fff',
  },
  2: {
    backgroundColor: '#4aa',
    color: '#fff',
  },
  3: {
    backgroundColor: 'yellowgreen',
    color: '#fff',
  },
  4: {
    backgroundColor: 'yellow',
    color: '#222',
  },
}

export function getVisitsCountData (visitCount) {
  const highlightClass = getHighlightClass(visitCount)
  const classData = styleByHighlightClass[highlightClass]
  const formattedVisitCount = getFormattedVisitCount(visitCount)
  return { ...classData, formattedVisitCount }
}

function getFormattedVisitCount (visitCount) {
  if (visitCount > 10 ** 6) return truncToUnit(visitCount, 10 ** 6, 'm')
  if (visitCount > 10 ** 3) return truncToUnit(visitCount, 10 ** 3, 'k')
  return visitCount.toString()
}

function truncToUnit (num, unit, unitLetter) {
  return `${Math.trunc(num / unit)}${unitLetter}`
}
