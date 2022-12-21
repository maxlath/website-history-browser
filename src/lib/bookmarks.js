export const getBookmarksPerUrl = async origin => {
  const bookmarksPerUrl = {}
  const bookmarks = await browser.bookmarks.search(origin)
  for (const bookmark of bookmarks) {
    const { url } = bookmark
    bookmarksPerUrl[url] = bookmarksPerUrl[url] || []
    bookmarksPerUrl[url].push(bookmark)
    bookmark.timeCapsule = getBookmarkTimeCapsule(bookmark.title)
  }
  return bookmarksPerUrl
}

const timeCapsuleMetadataSeparator = '/ᐒ/'

const getBookmarkTimeCapsule = title => {
  if (!title.includes(timeCapsuleMetadataSeparator)) return
  const timeCapsuleMetadata = title.split(timeCapsuleMetadataSeparator)[1].trim()
  const legacyMatch = timeCapsuleMetadata.match(legacyTimeCapsuleStringDataPattern)
  if (legacyMatch) {
    const [ , periodicity, nextOpenTime ] = legacyMatch
    return { periodicity, nextOpenTime }
  } else if (timeCapsuleMetadata.includes('=')) {
    const parsedMetadata = timeCapsuleMetadata.split(' ').reduce(parseMetadata, {})
    const { freq: frequency, next: nextVisit } = parsedMetadata
    return { periodicity: frequency, nextOpenTime: nextVisit }
  }
}

const legacyTimeCapsuleStringDataPattern = /^(\d+[A-Z]) (.*)/

function parseMetadata (obj, part) {
  const [ key, value ] = part.split('=')
  obj[key] = value
  return obj
}
