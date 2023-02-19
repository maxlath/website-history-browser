export const getHighlightClass = visitCount => Math.trunc(Math.log10(visitCount))

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

export function getVisitsCountStyle (visitCount) {
  const highlightClass = getHighlightClass(visitCount)
  return styleByHighlightClass[highlightClass]
}
