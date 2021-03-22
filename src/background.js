import { getCurrentTabUrl } from './lib/tabs'

function openPopup () {
  browser.browserAction.openPopup()
}

async function openTab () {
  let url = '/index.html'
  const currentUrl = await getCurrentTabUrl()
  if (currentUrl) url += `?url=${encodeURIComponent(currentUrl)}`
  browser.tabs.create({ url })
}

browser.commands.onCommand.addListener(command => {
  if (command === 'open-website-history-browser-popup') openPopup()
  else if (command === 'open-website-history-browser-tab') openTab()
})

browser.browserAction.onClicked.addListener(openTab)
