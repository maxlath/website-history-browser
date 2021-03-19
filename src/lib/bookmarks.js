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

const getBookmarkTimeCapsule = title => {
  if (!title.includes('/ᐒ/')) return
  const timeCapsuleStringData = title.split('/ᐒ/')[1].trim()
  const match = timeCapsuleStringData.match(timeCapsuleStringDataPattern)
  if (match) {
    const [ , periodicity, nextOpenTime ] = match
    return { periodicity, nextOpenTime }
  }
}

const timeCapsuleStringDataPattern = /^(\d+[A-Z]) (.*)/
