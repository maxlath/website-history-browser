import { getVisitsCountData } from './visits'
const defaultTitle = 'Website History Browser'

export async function updateIcon ({ tabId, url }) {
  if (isNonSpecialUrl(url)) {
    const visits = await browser.history.getVisits({ url })
    const visitCount = visits.length
    const { color, backgroundColor, formattedVisitCount } = getVisitsCountData(visitCount)
    const visitsTitle = `Visited ${visitCount} time${visitCount > 1 ? 's' : ''}`
    await Promise.all([
      browser.browserAction.setTitle({ tabId, title: `${visitsTitle} - ${defaultTitle}` }),
      browser.browserAction.setBadgeText({ tabId, text: formattedVisitCount }),
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

