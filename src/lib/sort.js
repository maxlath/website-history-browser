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
    fn: (a, b) => b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1,
  },
  titleReverse: {
    label: 'Title (Z-A)',
    fn: (a, b) => b.title.toLowerCase() < a.title.toLowerCase() ? 1 : -1,
  },
}

export function entriesByNumberOfItems (a, b) {
  return b[1].items.length - a[1].items.length
}
