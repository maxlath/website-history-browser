<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { bubbleUp } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'
  import Star from './Star.svelte'

  const dispatch = createEventDispatcher()
  let displayLimit = 20, windowScrollY = 0, bottomEl

  export let sectionName, sectionData
  const sections = sectionData.subsections
  const displaySubsections = Object.keys(sections).length > 0 && sectionData.items.length < 100

  const allSuboptions = Object.entries(sections).sort(entriesByNumberOfItems)

  $: displayedSuboptions = allSuboptions.slice(0, displayLimit)

  $: {
    if (bottomEl != null) {
      const screenBottom = windowScrollY + window.screen.height
      if (screenBottom + 50 > bottomEl.offsetTop) displayLimit += 50
    }
  }

</script>

<svelte:window bind:scrollY={windowScrollY} />

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
    <span class="chevron">{#if displaySubsections}&gt;{/if}</span>
  </button>
  {#if displaySubsections}
    <ul class="suboptions">
      {#each displayedSuboptions as [ sectionName, sectionData ]}
        <svelte:self
          {sectionName}
          {sectionData}
          on:select={bubbleUp(dispatch, 'select')}
        />
      {/each}
    </ul>
    {#if displayedSuboptions.length < allSuboptions.length}
      <p class="more" bind:this={bottomEl}>...</p>
    {/if}
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
