import debounce from 'lodash.debounce'

export const getSettings = () => browser.storage.local.get('settings')

const saveSettings = settings => {
  console.time('save settings')
  browser.storage.local.set({ settings })
  console.timeEnd('save settings')
}

export const lazySaveSettings = debounce(saveSettings, 500)
