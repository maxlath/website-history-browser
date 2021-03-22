<script>
  import HistoryItem from './HistoryItem.svelte'
  import Sections from './Sections.svelte'
  import { getHistoryItems, filterByText, hasBookmarks, getSectionItemsFromPath } from '../lib/history'
  import { getCurrentTabUrl } from '../lib/tabs'
  import { logErrorAndRethrow, hide } from '../lib/utils'
  import { sortModes } from '../lib/sort'
  import { periods } from '../lib/date'

  export let url

  let protocol, host, origin, globalTitle, textFilter
  let allHistoryItems = [], historyItems = [], sectionItems = [], selectedPath = [], sections = {}
  let initalized = false, sortMode = 'date', bookmarksOnly = false, maxAge = Infinity, bookmarksCount = 0

  const init = async () => {
    url = url || await getCurrentTabUrl()
    ;({ protocol, host, origin } = new URL(url))

    const { settings = {} } = await browser.storage.local.get('settings')
    if (settings.bookmarksOnly != null) bookmarksOnly = settings.bookmarksOnly
    if (settings.textFilter != null) textFilter = settings.textFilter
    if (settings.sortMode != null) sortMode = settings.sortMode
    if (settings.maxAge != null) maxAge = settings.maxAge
    if (origin === settings.origin && settings.selectedPath != null) selectedPath = settings.selectedPath

    ;({ historyItems, globalTitle, sections } = await getHistoryItems({ origin }))
    allHistoryItems = historyItems
    initalized = true
  }

  const waitingForInitialData = init().catch(logErrorAndRethrow)

  function showAll () {
    bookmarksOnly = false
    textFilter = null
    resetSection()
    maxAge = Infinity
  }

  function resetSection () {
    selectedPath = []
    sectionItems = allHistoryItems
  }

  function selectSection (event) {
    const { items, path } = event.detail
    sectionItems = items
    selectedPath = path
  }

  $: {
    if (selectedPath.length === 0) {
      sectionItems = allHistoryItems
    } else {
      try {
        sectionItems = getSectionItemsFromPath(sections, selectedPath)
      } catch (err) {
        // An error may occure if a path was previously selected,
        // but that the corresponding items have been deleted since then
        console.error(err)
        resetSection()
      }
    }
  }

  $: {
    // TODO: optimization: reduce filters to a single loop
    historyItems = filterByText(sectionItems, textFilter)
    historyItems = historyItems.filter(item => item.period.thresold <= maxAge)
    if (bookmarksOnly) historyItems = historyItems.filter(hasBookmarks)
    else bookmarksCount = historyItems.filter(hasBookmarks).length

    historyItems = historyItems.sort(sortModes[sortMode].fn)
  }

  $: {
    if (initalized) {
      const settings = { bookmarksOnly, textFilter, sortMode, maxAge, selectedPath, origin }
      // TODO: debounce
      browser.storage.local.set({ settings })
    }
  }

  $: allItemsShown = historyItems.length === allHistoryItems.length
</script>

{#await waitingForInitialData}
  <p class="loading">Loading history...</p>
{:then}
  <div class="header">
    <button on:click={resetSection} disabled={selectedPath.length === 0}>
      <img src="{protocol}//{host}/favicon.ico" alt="favicon" class="favicon" on:error={hide}>
      {#if globalTitle}<span class="global-title">{globalTitle} - </span>{/if}
      <h1 class="host">{host}</h1>
    </button>
    <Sections
      {sections}
      {selectedPath}
      depth={0}
      on:select={selectSection}
    />
  </div>

  <div class="controls">
    <label for="sort">Sort by:</label>
    <select
      name="sort"
      bind:value={sortMode}
      >
      {#each Object.entries(sortModes) as [ modeKey, { label } ] }
        <option value="{modeKey}">{label}</option>
      {/each}
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

    <select name="period" bind:value={maxAge}>
      {#each periods as period}
        <option value="{period.thresold}">{period.selector || period.label}</option>
      {/each}
    </select>

    {#if bookmarksOnly || bookmarksCount > 0}
      <input name="bookmarks-only" type="checkbox" bind:checked={bookmarksOnly}>
      <label for="bookmarks-only">
        bookmarks only
        <span class="count">({bookmarksCount})</span>
      </label>
    {/if}

    <p class="shown-rate" class:all-shown={allItemsShown}>{historyItems.length} / {allHistoryItems.length}</p>
    <button class="show-all"
      on:click={showAll}
      disabled={allItemsShown}
      >show all</button>
  </div>

  <ul class="history-items">
    {#each historyItems as item (item.id)}
      <li >
        <HistoryItem {item} {origin} />
      </li>
    {:else}
      <p class="empty">nothing found</p>
    {/each}
  </ul>

{:catch error}
  <h1>error</h1>
  <pre>{error.message}
{error.stack}</pre>
  <p>see error logs for a better stack trace</p>
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
    transition: background-color 0.3s ease, opacity 0.3s ease;
  }
  :global(button:disabled){
    cursor: not-allowed;
    opacity: 0.8;
  }
  :global(ul, li, p){
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul, p{
    line-height: 1rem;
  }
  .header{
    padding: 0;
    line-height: 1rem;
    font-size: 1.2rem;
    color: #ddd;
    margin: 0.5em 0;
    color: #aaa;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .header button{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .global-title{
    margin-top: 0.1em;
    margin-right: 0.3em;
    color: #ddd;
  }
  .favicon{
    max-height: 1em;
    margin-right: 0.5em;
  }
  .host{
    color: white;
    padding: 0;
    line-height: 1rem;
    font-size: 1.2rem;
  }
  .loading, .empty{
    text-align: center;
    padding: 1em;
  }
  .empty{
    font-style: italic;
  }
  .controls{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 1em;
  }
  select, input[type="text"]{
    margin: 0 0.5em;
  }
  .shown-rate{
    margin-left: auto;
    color: #bbb;
  }
  .shown-rate:not(.all-shown){
    color: yellow;
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
  pre{
    padding: 1em;
    background-color: #111;
    border-radius: 3px;
  }
  label .count{
    color: #777;
  }
  /*Small screens*/
  @media screen and (max-width: 800px) {
    .shown-rate, .show-all{
      display: none;
    }
  }
</style>
