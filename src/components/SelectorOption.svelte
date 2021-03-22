<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { bubbleUp } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'
  import Star from './Star.svelte'

  const dispatch = createEventDispatcher()

  export let sectionName, sectionData
  const sections = sectionData.subsections
  const hasSubsections = Object.keys(sections).length > 0
</script>

<li class="option">
  <button on:click={() => dispatch('select', sectionData)}>
    <span class="name">{sectionName}</span>
    <div class="bookmarks-count">
      {#if sectionData.bookmarksCount > 0}
        <p>{sectionData.bookmarksCount}</p>
        <Star />
      {/if}
    </div>
    <span class="count">{sectionData.items.length}</span>
    <span class="chevron">{#if hasSubsections}&gt;{/if}</span>
  </button>
  {#if hasSubsections}
    <ul class="suboptions">
      {#each Object.entries(sections).sort(entriesByNumberOfItems) as [ sectionName, sectionData ]}
        <svelte:self
          {sectionName}
          {sectionData}
          on:select={bubbleUp(dispatch, 'select')}
        />
      {/each}
    </ul>
  {/if}
</li>

<style>
  .option{
    display: flex;
  }
  .option button{
    flex: 1;
    padding: 0.5em 1em;
    background-color: #111;
    white-space: nowrap;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .option:not(:last-child) button{
    margin-bottom: 1px;
  }
  .option button:hover{
    background-color: #333;
  }
  .option{
    position: relative;
  }
  .suboptions{
    background-color: #111;
    position: absolute;
    top: 0;
    left: 100%;
    visibility: hidden;
  }
  .option:hover > .suboptions, .option:focus > .suboptions{
    visibility: visible;
  }
  .bookmarks-count{
    width: 3em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }
  .bookmarks-count p{
    margin: 0 0.3em 0 0.5em;
    color: #ffe900;
  }
  .name{
    color: white;
    margin-right: 0.5em;
  }
  .count{
    color: #777;
  }
  .chevron{
    width: 1em;
    text-align: right;
    color: #777;
  }
</style>
