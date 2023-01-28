import { getCurrentTabUrl } from './lib/tabs'

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
