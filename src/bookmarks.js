export const getBookmarksPerUrl = async origin => {
  const bookmarksPerUrl = {}
  const bookmarks = await browser.bookmarks.search(origin)
  for (const bookmark of bookmarks) {
    const { url } = bookmark
    bookmarksPerUrl[url] = bookmarksPerUrl[url] || []
    bookmarksPerUrl[url].push(bookmark)
    bookmark.timeCapsuleData = getBookmarkTimeCapsuleData(bookmark.title)
  }
  return bookmarksPerUrl
}

const getBookmarkTimeCapsuleData = title => {
  if (!title.includes('/ᐒ/')) return
  const timeCapsuleStringData = title.split('/ᐒ/')[1].trim()
  const [ , periodicty, nextOpenTime ] = timeCapsuleStringData.match(timeCapsuleStringDataPattern)
  return { periodicty, nextOpenTime }
}

const timeCapsuleStringDataPattern = /^(\d+[A-Z]) (.*)/
