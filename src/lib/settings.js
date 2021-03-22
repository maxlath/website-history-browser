import debounce from 'lodash.debounce'

export const getSettings = () => browser.storage.local.get('settings')

const saveSettings = settings => {
  browser.storage.local.set({ settings })
}

export const lazySaveSettings = debounce(saveSettings, 500)
