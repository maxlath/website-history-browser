<script>
  import debounce from 'lodash.debounce'
  import { searchHistoryItems } from '../lib/history'
  import { setUrl } from '../lib/url'
  import { isOpenedOutside, onChange, uniq } from '../lib/utils'

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
      hosts = uniq(searchItems.map(getHistoryItemHost))
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
        setUrl(origin)
        url = origin
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

  function selectUrl (e, url) {
    if (!isOpenedOutside(e)) {
      setUrl(url)
      url = url
      e.preventDefault()
    }
  }

  $: onChange(inputValue, lazyUpdateSuggestions)
</script>

<div class="website-picker">
  <label for="search">
    Select a website
  </label>

  <input
    id="search"
    type="search"
    placeholder="example.org"
    bind:value={inputValue}
    on:keydown={onKeyDown}
    use:autofocus
  >

  <ul>
    {#each hosts as host (host)}
      {@const origin = getHostOrigin(host)}
      <li class:selected={host === selectedHost}>
        <a
          href="/index.html?url={encodeURI(origin)}"
          on:click={e => selectUrl(e, origin)}
        >
          {host}
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .website-picker{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 40em;
    margin: 2em auto;
  }
  label{
    font-size: 1.4rem;
  }
  input{
    align-self: stretch;
    padding: 0.5em;
    margin: 1em 0;
  }
  ul{
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    border-radius: 3px;
    overflow: hidden;
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
