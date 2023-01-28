<script>
  import { periods } from '../lib/date'
  import { sortModes } from '../lib/sort'
  import SearchBox from './SearchBox.svelte'

  export let sortMode
  export let maxAge
  export let bookmarksOnly
  export let ignoreQueryStrings
  export let ignoreHashes
  export let textFilter
  export let bookmarksCount
  export let allItemsShown

  export let filteredItems
  export let allItems
  export let resetSection

  function showAll () {
    bookmarksOnly = false
    ignoreQueryStrings = false
    ignoreHashes = false
    textFilter = null
    resetSection()
    maxAge = Infinity
  }
</script>

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

  <label class="checkbox-input">
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


<style>
  p{
    line-height: 1rem;
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
  .checkbox-input{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0.5em;
  }
  input[type="checkbox"]{
    margin-right: 0.5em;
  }
  label .count{
    margin-left: 0.5em;
    color: #777;
  }
</style>
