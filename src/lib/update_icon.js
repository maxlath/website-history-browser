import { getVisitsCountStyle } from './visits_color'

export async function updateIcon ({ tabId, url }) {
  if (isNonSpecialUrl(url)) {
    const visits = await browser.history.getVisits({ url })
    const visitCount = visits.length
    const { color, backgroundColor } = getVisitsCountStyle(visitCount)
    await Promise.all([
      browser.browserAction.setBadgeText({ tabId, text: visitCount.toString() }),
      browser.browserAction.setBadgeTextColor({ tabId, color }),
      browser.browserAction.setBadgeBackgroundColor({ tabId, color: backgroundColor }),
    ])
  } else {
    await browser.browserAction.setBadgeText({ tabId, text: '' })
  }
}

// Filter-out URLs such as (about|chrome|file|data):*
// See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
export const isNonSpecialUrl = url => url?.startsWith('http')

