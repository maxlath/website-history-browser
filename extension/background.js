// function openAppPage () {
//   browser.tabs.create({
//     url: '/index.html'
//   })
// }

// function onVisited (historyItem) {
//   if (historyItem.url === browser.extension.getURL('./index.html')) {
//     browser.history.deleteUrl({ url: historyItem.url })
//   }
// }

// browser.browserAction.onClicked.addListener(openAppPage)
// browser.history.onVisited.addListener(onVisited)

browser.commands.onCommand.addListener(command => {
  if (command === 'open-website-history-browser') {
    browser.browserAction.openPopup()
    .catch(console.error)
  }
})
