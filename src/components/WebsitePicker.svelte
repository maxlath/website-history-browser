<script>
  import debounce from 'lodash.debounce'
  import { searchHistoryItems } from '../lib/history'
  import { setUrl } from '../lib/url'
  import { onChange, uniq } from '../lib/utils'

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

  async function onKeyDown (e) {
    if (e.key === 'Enter') {
      const searchItem = searchItems.find(isSelectedHostItem)
      if (searchItem) {
        url = new URL(searchItem.url).origin
        setUrl(url)
      }
    }
  }

  const isSelectedHostItem = item => {
    return getHistoryItemHost(item) === selectedHost
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
      <li class:selected={host === selectedHost}>{host}</li>
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
  }
  li{
    background-color: #eee;
    padding: 0.5em;
    color: #222;
  }
  .selected{
    background-color: #22aaee;
  }
</style>
