export const sortModes = {
  date: {
    label: 'Last visit date',
    fn: (a, b) => b.lastVisitTime - a.lastVisitTime,
  },
  visits: {
    label: 'Number of visits',
    fn: (a, b) => b.visitCount - a.visitCount,
  },
  title: {
    label: 'Title (A-Z)',
    fn: (a, b) => {
      a.title ??= ''
      b.title ??= ''
      if (a.title === '' && b.title === '') return b.url.toLowerCase() < a.url.toLowerCase() ? 1 : -1
      if (a.title === '') return 1
      if (b.title === '') return -1
      return b.title.toLowerCase() < a.title.toLowerCase() ? 1 : -1
    },
  },
  titleReverse: {
    label: 'Title (Z-A)',
    fn: (a, b) => {
      if (a.title === '' && b.title === '') return b.url.toLowerCase() > a.url.toLowerCase() ? 1 : -1
      if (a.title === '') return 1
      if (b.title === '') return -1
      return b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1
    },
  },
}

export function entriesByNumberOfItems (a, b) {
  if (a[1].bookmarksCount > 0 || b[1].bookmarksCount > 0) {
    // First come entries with bookmarks
    return b[1].bookmarksCount * 100 - a[1].bookmarksCount * 100
  } else if (b[1].items.length !== a[1].items.length) {
    // Then with the highest number of items
    return b[1].items.length * 10 - a[1].items.length * 10
  } else {
    // Then alphabetically
    const aSectionName = a[0]
    const bSectionName = b[0]
    if (isIntegerString(a) && isIntegerString(b)) {
      return parseInt(bSectionName) - parseInt(aSectionName)
    } else {
      return aSectionName > bSectionName ? 1 : -1
    }
  }
}

const numberStringPattern = /^\d+$/
const isIntegerString = str => numberStringPattern.test(str)
