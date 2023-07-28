export async function addUrlToHistory (url) {
  try {
    const { history = {} } = await browser.storage.local.get('history')
    const { protocol, host } = new URL(url)
    const entry = history[host] = history[host] || { selectCount: 0 }
    entry.protocol = protocol
    entry.selectCount = entry.selectCount || 0
    entry.selectCount++
    entry.lastSelectionTime = Date.now()
    await browser.storage.local.set({ history })
  } catch (err) {
    console.error('history error', err)
    // Reseting to come back to a known state
    await resetHistory()
  }
}

export async function getHistory () {
  const { history = {} } = await browser.storage.local.get('history')
  return Object.entries(history)
  .map(([ host, entry ]) => ({ host, ...entry }))
}

export const lastSelectedFirst = (a, b) => b.lastSelectionTime - a.lastSelectionTime
// export const mostSelectedFirst = (a, b) => b.selectCount - a.selectCount

export async function resetHistory () {
  await browser.storage.local.remove('history')
}
