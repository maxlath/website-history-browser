export async function getCurrentTabUrl () {
  const [ currentTab ] = await browser.tabs.query({ currentWindow: true, active: true })
  if (currentTab) return currentTab.url
}
