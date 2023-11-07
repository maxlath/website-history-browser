<script>
  import debounce from 'lodash.debounce'
  import { getLastVisitedHosts, searchHistoryItems } from '../lib/history'
  import { getWebsiteHistoryUrl, setUrl } from '../lib/url'
  import { isOpenedOutside, onChange, uniq } from '../lib/utils'
  import { getHistory, lastSelectedFirst, resetHistory } from '../lib/history_browser_history'
  import PreviouslySelectedHost from './PreviouslySelectedHost.svelte'

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

  let history, lastSelectedHosts, lastVisitedHosts

  const waitingForHistory = Promise.all([ getLastVisitedHosts(), getHistory() ])
    .then(res => {
      ;[ lastVisitedHosts, history ] = res
      lastSelectedHosts = history.sort(lastSelectedFirst)
    })

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

  async function clearHistory () {
    lastSelectedHosts = []
    await resetHistory()
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
          href={getWebsiteHistoryUrl(origin)}
          on:click={e => selectUrl(e, origin)}
        >
          {host}
        </a>
      </li>
    {/each}
  </ul>
</div>

{#await waitingForHistory then}
  {#if lastVisitedHosts.length > 0}
    <section>
      <div class="list-header">
        <h3>Last visited</h3>
      </div>

      <ul>
        {#each lastVisitedHosts as hostEntry}
          <PreviouslySelectedHost entry={hostEntry} on:select={e => selectUrl(null, e.detail)} />
        {/each}
      </ul>
    </section>
  {/if}

  {#if lastSelectedHosts.length > 0}
    <section>
      <div class="list-header">
        <h3>Previously selected</h3>
        <button class="clear-history" on:click={clearHistory}>Clear</button>
      </div>

      <ul>
        {#each lastSelectedHosts as hostEntry}
          <PreviouslySelectedHost entry={hostEntry} on:select={e => selectUrl(null, e.detail)} />
        {/each}
      </ul>
    </section>
  {/if}
{/await}

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
  section{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: #2a2a2a;
    margin: 1rem auto;
    border-radius: 3px;
    padding: 0.5em;
  }
  section ul{
    display: flex;
    flex-direction: row;
    align-items: space-around;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 12em;
    overflow-y: auto;
  }
  .list-header{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
    margin: 0.5em;
  }
  h3{
    margin: 0;
  }
  .clear-history{
    text-decoration: underline;
    color: white;
  }
</style>
