<script>
  import HistoryItem from './HistoryItem.svelte'
  import Sections from './Sections.svelte'
  import SearchBox from './SearchBox.svelte'
  import { getHistoryItems, hasBookmarks, getSectionItemsFromPath } from '../lib/history'
  import { filterHistoryItemsByText } from '../lib/filter'
  import { getCurrentTabUrl } from '../lib/tabs'
  import { logErrorAndRethrow, hide, getPathnameSections } from '../lib/utils'
  import { sortModes } from '../lib/sort'
  import { periods } from '../lib/date'
  import { ignoreUrlParts } from '../lib/url'
  import { getSettings, lazySaveSettings } from '../lib/settings'

  export let url

  let protocol, host, origin, pathname, globalTitle, textFilter, bottomEl
  let allItems = []
  let sectionItems = []
  let filteredItems = []
  let displayedItems = []
  let selectedPath = []
  let sections = {}
  let initalized = false
  let sortMode = 'date'
  let bookmarksOnly = false
  let ignoreQueryStrings = false
  let ignoreHashes = false
  let maxAge = Infinity
  let bookmarksCount = 0
  let displayLimit = 20
  let windowScrollY = 0

  // The infinite scroll expects that we always start from the top
  window.scrollTo(0, 0)

  const init = async () => {
    url = url || await getCurrentTabUrl()
    ;({ protocol, host, origin, pathname } = new URL(url))

    const { settings = {} } = await getSettings()
    if (settings.bookmarksOnly != null) bookmarksOnly = settings.bookmarksOnly
    if (settings.ignoreQueryStrings != null) ignoreQueryStrings = settings.ignoreQueryStrings
    if (settings.ignoreHashes != null) ignoreHashes = settings.ignoreHashes
    if (settings.sortMode != null) sortMode = settings.sortMode
    if (settings.maxAge != null) maxAge = settings.maxAge
    if (pathname !== '/') selectedPath = getPathnameSections(pathname)
    if (origin === settings.origin) {
      if (settings.textFilter != null) textFilter = settings.textFilter
    }

    ;({ historyItems: allItems, globalTitle, sections } = await getHistoryItems({ origin }))
    filteredItems = allItems
    initalized = true
  }

  const waitingForInitialData = init().catch(logErrorAndRethrow)

  function showAll () {
    bookmarksOnly = false
    ignoreQueryStrings = false
    ignoreHashes = false
    textFilter = null
    resetSection()
    maxAge = Infinity
  }

  function resetSection () {
    selectedPath = []
    sectionItems = allItems
  }

  function selectSection (event) {
    selectedPath = event.detail.path
  }

  $: {
    if (selectedPath.length === 0) {
      sectionItems = allItems
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
    filteredItems = filterHistoryItemsByText(sectionItems, textFilter)
    filteredItems = filteredItems.filter(item => item.period.thresold <= maxAge)
    if (bookmarksOnly) {
      filteredItems = filteredItems.filter(hasBookmarks)
      bookmarksCount = filteredItems.length
    } else {
      bookmarksCount = filteredItems.filter(hasBookmarks).length
    }

    filteredItems = ignoreUrlParts({ filteredItems, ignoreQueryStrings, ignoreHashes })

    filteredItems = filteredItems.sort(sortModes[sortMode].fn)

    // Reset everytime filters are updated
    displayLimit = 20
  }

  $: {
    displayedItems = filteredItems.slice(0, displayLimit)
  }

  $: {
    if (initalized) {
      lazySaveSettings({
        bookmarksOnly,
        ignoreQueryStrings,
        ignoreHashes,
        textFilter,
        sortMode,
        maxAge,
        selectedPath,
        origin,
      })
    }
  }

  $: allItemsShown = filteredItems.length === allItems.length

  $: {
    if (bottomEl != null) {
      const screenBottom = windowScrollY + window.screen.height
      if (screenBottom + 50 > bottomEl.offsetTop) displayLimit += 50
    }
  }
</script>

<svelte:window bind:scrollY={windowScrollY} />

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
    <label>
      Sort by:
      <select
        name="sort"
        bind:value={sortMode}
        >
        {#each Object.entries(sortModes) as [ modeKey, { label } ] }
          <option value="{modeKey}">{label}</option>
        {/each}
      </select>
    </label>

    <SearchBox
      {textFilter}
      placeholder='filter...'
      on:change={({ detail }) => textFilter = detail}
    />

    <select name="period" bind:value={maxAge}>
      {#each periods as period}
        <option value="{period.thresold}">{period.selector || period.label}</option>
      {/each}
    </select>

    <label class="checkbox-input" class:no-bookmarks={bookmarksCount === 0}>
      <input name="bookmarks-only" type="checkbox" bind:checked={bookmarksOnly}>
      bookmarks only
      <span class="count">({bookmarksCount})</span>
    </label>

    <label class="checkbox-input">
      <input type="checkbox" bind:checked={ignoreQueryStrings}>
      ignore query strings
    </label>

    <label class="checkbox-input">
      <input type="checkbox" bind:checked={ignoreHashes}>
      ignore hashes
    </label>

    <p class="shown-rate" class:all-shown={allItemsShown}>{filteredItems.length} / {allItems.length}</p>
    <button class="show-all"
      on:click={showAll}
      disabled={allItemsShown}
      >show all</button>
  </div>

  <ul class="history-items">
    {#each displayedItems as item (item.id)}
      <li><HistoryItem {item} /></li>
    {:else}
      <p class="empty">nothing found</p>
    {/each}
  </ul>

  {#if displayedItems.length < filteredItems.length}
    <p class="page-bottom" bind:this={bottomEl}>Loading more...</p>
  {/if}

{:catch error}
  <h1>error</h1>
  <pre>{error.message}
{error.stack}</pre>
  <p>see error logs for a better stack trace</p>
{/await}

<style>
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
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 1em;
  }
  .controls > *{
    margin: 0.5em 0;
  }
  select{
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
  pre{
    padding: 1em;
    background-color: #111;
    border-radius: 3px;
  }
  .checkbox-input{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0.5em;
  }
  .no-bookmarks{
    opacity: 0.5;
  }
  input[type="checkbox"]{
    margin-right: 0.5em;
  }
  label .count{
    margin-left: 0.5em;
    color: #777;
  }
</style>
