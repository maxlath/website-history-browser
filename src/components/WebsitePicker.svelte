<script>
  import debounce from 'lodash.debounce'
  import { searchHistoryItems } from '../lib/history'
  import { getWebsiteHistoryUrl, setUrl } from '../lib/url'
  import { isOpenedOutside, onChange, uniq } from '../lib/utils'
  import WebsitePickerLists from './WebsitePickerLists.svelte'

  export let url

  let inputValue = ''
  let hosts = []
  let searchItems = []
  let selectedHost = ''

  function autofocus (el) {
    el.focus()
  }

  async function updateSuggestions () {
    selectedHost = ''
    if (inputValue.length > 0) {
      searchItems = await searchHistoryItems({ text: inputValue, limit: 1000 })
      hosts = uniq(searchItems.map(getHistoryItemHost)).filter(host => host !== '')
      selectedHost = hosts[0]
    }
  }

  const lazyUpdateSuggestions = debounce(updateSuggestions, 200)

  const getHistoryItemHost = ({ url }) => new URL(url).host

  const getHostOrigin = host => {
    const searchItem = searchItems.find(isHostItem(host))
    if (searchItem) {
      return new URL(searchItem.url).origin
    }
  }

  async function onKeyDown (e) {
    const { key } = e
    if (key === 'Enter') {
      const origin = getHostOrigin(selectedHost)
      if (origin) {
        url = origin
        await setUrl(origin)
      }
    } else if (key === 'ArrowDown') {
      const currentIndex = hosts.indexOf(selectedHost)
      const nextIndex = Math.min(currentIndex + 1, hosts.length - 1)
      selectedHost = hosts[nextIndex]
      e.preventDefault()
    } else if (key === 'ArrowUp') {
      const currentIndex = hosts.indexOf(selectedHost)
      const nextIndex = Math.max(currentIndex - 1, 0)
      selectedHost = hosts[nextIndex]
      e.preventDefault()
    }
  }

  const isHostItem = host => item => {
    return getHistoryItemHost(item) === host
  }

  async function selectUrl (e, url) {
    if (e == null || !isOpenedOutside(e)) {
      url = url
      e?.preventDefault()
      await setUrl(url)
    }
  }

  $: onChange(inputValue, lazyUpdateSuggestions)
</script>

<div class="website-picker">
  <label for="search">
    Select a website
  </label>

  <div class="input-box">
    <input
      id="search"
      type="search"
      placeholder="example.org"
      bind:value={inputValue}
      on:keydown={onKeyDown}
      use:autofocus
    >

    <ul class="suggestions">
      {#each hosts as host (host)}
        {@const origin = getHostOrigin(host)}
        <li class:selected={host === selectedHost}>
          <a
            href={getWebsiteHistoryUrl(origin)}
            on:click={e => selectUrl(e, origin)}
          >
            {host}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<WebsitePickerLists bind:url />

<style>
  .website-picker{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2em auto;
  }
  label{
    font-size: 1.4rem;
  }
  .input-box{
    margin: 1em auto;
    position: relative;
  }
  input{
    align-self: stretch;
    padding: 0.5em;
    margin: 0;
    width: min(40em, 95vw);
  }
  .suggestions{
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-radius: 3px;
  }
  li{
    display: flex;
    flex-direction: row;
  }
  li a{
    flex: 1;
    background-color: #eee;
    padding: 0.5em;
    color: #222;
    text-decoration: none;
  }
  .selected a{
    background-color: #22aaee;
  }
</style>
