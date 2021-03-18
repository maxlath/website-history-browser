<script>
  import { getHistoryItems, spreadItemsByPeriod, findPeriodsToShow, filterByText, hasBookmarks } from './history'
  import { getCurrentTabUrl } from './tabs'
  import PeriodHistoryItems from './PeriodHistoryItems.svelte'
  import HistoryItem from './HistoryItem.svelte'

  export let url

  let host, origin, historyItemsByPeriod, globalTitle, historyItemsSortedByVisits, textFilter
  let allHistoryItems = [], historyItems = [], shownPeriods = {}, sortMode = 'date', bookmarksOnly = false
  let initalized = false

  const init = async () => {
    const { settings = {} } = await browser.storage.local.get('settings')
    console.log('recovered settings', settings)
    if (settings.bookmarksOnly != null) bookmarksOnly = settings.bookmarksOnly
    if (settings.textFilter != null) textFilter = settings.textFilter
    if (settings.sortMode != null) sortMode = settings.sortMode

    url = url || await getCurrentTabUrl()
    ;({ host, origin } = new URL(url))
    ;({ historyItems, globalTitle } = await getHistoryItems({ origin }))
    allHistoryItems = historyItems
    initalized = true
  }

  const waitingForInitialData = init()

  function showAll () {
    bookmarksOnly = false
    textFilter = null
  }

  $: {
    historyItems = filterByText(allHistoryItems, textFilter)
    if (bookmarksOnly) historyItems = historyItems.filter(hasBookmarks)

    if (sortMode === 'date') {
      historyItemsByPeriod = spreadItemsByPeriod(historyItems)
      shownPeriods = findPeriodsToShow(historyItemsByPeriod, 50)
    } else if (sortMode === 'visits') {
      historyItemsSortedByVisits = historyItems.sort((a, b) => b.visitCount - a.visitCount)
    }
  }

  $: {
    if (initalized) {
      const settings = { bookmarksOnly, textFilter, sortMode }
      console.log('saving settings', settings)
      browser.storage.local.set({ settings })
    }
  }

</script>

{#await waitingForInitialData}
  <p class="loading">Loading history...</p>
{:then}
  <h1>
    {#if globalTitle}{globalTitle} - {/if}
    <span class="host">{host}</span>
  </h1>

  <div class="controls">
    <label for="sort">Sort by:</label>
    <select
      name="sort"
      bind:value={sortMode}
      >
      <option value="date" selected>Date</option>
      <option value="visits" selected>Number of visits</option>
    </select>

    <div class="input-wrapper">
      <input type="text" placeholder="filter..." bind:value={textFilter}>
      <button
        class="close"
        on:click={() => textFilter = null}
        on:keyup={({ key }) => key === 'Enter' ? textFilter = null : null}
        >
        <span class="cross">✕</span>
      </button>
    </div>

    <input name="bookmarks-only" type="checkbox" bind:checked={bookmarksOnly}>
    <label for="bookmarks-only">bookmarks only</label>

    <p class="shown-rate">{historyItems.length} / {allHistoryItems.length}</p>
    <button class="show-all" on:click={showAll}>show all</button>
  </div>

  {#if sortMode === 'date'}
    <ul class="history-by-date">
      {#each Object.entries(historyItemsByPeriod) as [ period, periodHistoryItems ] (period)}
        <PeriodHistoryItems
          {period}
          {periodHistoryItems}
          {shownPeriods}
          {origin}
          on:toggle={() => shownPeriods[period] = !shownPeriods[period]}
          />
      {:else}
        <p class="empty">nothing found</p>
      {/each}
    </ul>
  {:else if sortMode === 'visits'}
    <ul class="history-by-visits">
      {#each historyItemsSortedByVisits as item (item.id)}
        <HistoryItem {item} {origin} />
      {:else}
        <p class="empty">nothing found</p>
      {/each}
    </ul>
  {/if}

{:catch error}
  <p>{error}</p>
{/await}

<style>
  :global(body){
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color: #222;
    color: white;
  }
  /* Reset */
  :global(button){
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    cursor: pointer;
    background: inherit;
    transition: background-color 0.3s ease;
  }
  ul, p{
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 1rem;
  }
  h1{
    padding: 0;
    line-height: 1rem;
    font-size: 1.2rem;
    color: #ddd;
    margin: 1em 0 0.5em 0;
    color: #aaa;
    text-align: center;
  }
  .host{
    color: white;
  }
  .loading, .empty{
    text-align: center;
    padding: 1em;
  }
  .empty{
    font-style: italic;
  }
  .history-by-visits{
    margin-top: 1em;
  }
  .controls{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  select, input[type="text"]{
    margin: 0 0.5em;
  }
  .shown-rate{
    margin-left: auto;
    color: #bbb;
  }
  .show-all{
    background-color: #bbb;
    padding: 0.2em;
    border-radius: 3px;
    margin-left: 0.5em;
  }
  .show-all:hover{
    background-color: #ccc;
  }
  .input-wrapper{
    position: relative;
  }
  .close{
    position: absolute;
    top: 0;
    right: 0.8em;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .cross{
    background-color: inherit;
    transition: background-color 0.3s ease;
    border-radius: 3px;
    padding: 0.2em 0.5em;
  }
  .close:hover .cross, .close:focus .cross{
    background-color: #e2e2e2;
  }
  /*Small screens*/
  @media screen and (max-width: 800px) {
    .shown-rate, .show-all{
      display: none;
    }
  }
</style>
