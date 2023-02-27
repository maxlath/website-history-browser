import { getCurrentTabUrl } from './lib/tabs'
import { updateIcon } from './lib/update_icon'

async function openTab ({ selectCurrentWebsite }) {
  let url = '/index.html'
  if (selectCurrentWebsite) {
    const currentUrl = await getCurrentTabUrl()
    if (currentUrl) url += `?url=${encodeURIComponent(currentUrl)}`
  }
  browser.tabs.create({ url })
}

browser.commands.onCommand.addListener(async command => {
  if (command === 'open-website-history-browser-tab') {
    openTab({ selectCurrentWebsite: true })
  } else if (command === 'open-website-history-browser-tab-without-selecting-current-website') {
    openTab({ selectCurrentWebsite: false })
  }
})

browser.browserAction.onClicked.addListener(openTab)

async function onTabUpdated (tabId, changeInfo, tab) {
  const { url } = await browser.tabs.get(tabId)
  await updateIcon({ tabId, url })
}

// When a tab becomes the active tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
async function onTabActivated (activeTab) {
  const { tabId } = activeTab
  const { url } = await browser.tabs.get(tabId)
  await updateIcon({ tabId, url })
}

browser.tabs.onUpdated.addListener(onTabUpdated)
browser.tabs.onActivated.addListener(onTabActivated)
