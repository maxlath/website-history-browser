<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { filterSectionsEntriesByText } from '../lib/filter'
  import { add, bubbleUp } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'
  import SelectorOption from './SelectorOption.svelte'
  import SearchBox from './SearchBox.svelte'

  export let sections, selectedPath, depth

  let displayLimit = 20, windowScrollY = 0, bottomEl, textFilter, filteredItems = [], displayedSections = [], sectionHovered = false

  $: depthSelectedSectionName = selectedPath[depth]

  const dispatch = createEventDispatcher()

  const sectionsTotal = Object.values(sections)
    .map(section => section.items.length)
    .reduce(add, 0)

  const allSections = Object.entries(sections).sort(entriesByNumberOfItems)

  $: {
    filteredItems = filterSectionsEntriesByText(allSections, textFilter)
    displayedSections = filteredItems.slice(0, displayLimit)
  }

  $: {
    if (bottomEl != null && sectionHovered) {
      const screenBottom = windowScrollY + window.screen.height
      if (screenBottom + 50 > bottomEl.offsetTop) displayLimit += 10
    }
  }
</script>

<svelte:window bind:scrollY={windowScrollY} />

{#if sectionsTotal > 0}
  <span class="chevron">&gt;</span>

  <div
    class="section-selector"
    on:mouseenter={() => sectionHovered = true}
    on:mouseleave={() => sectionHovered = false}
    >
    {#if depthSelectedSectionName}
      <button
        class="selected"
        on:click={() => dispatch('select', sections[depthSelectedSectionName])}
        >{depthSelectedSectionName}</button>
    {:else}
      <button class="suggestion">
        <span class="name">all</span>
      </button>
    {/if}
    <div class="dropdown">
      <SearchBox
        {textFilter}
        placeholder='search...'
        on:change={({ detail }) => textFilter = detail}
      />
      <ul class="options">
        {#each displayedSections as [ sectionName, sectionData ]}
          <SelectorOption
            {sectionName}
            {sectionData}
            on:select={bubbleUp(dispatch, 'select')}
          />
        {/each}
      </ul>
      {#if displayedSections.length < filteredItems.length}
        <p class="more" bind:this={bottomEl}>...</p>
      {/if}
    </div>
  </div>
{/if}

{#if depthSelectedSectionName && sections[depthSelectedSectionName].subsections != null}
  <svelte:self
    sections={sections[depthSelectedSectionName].subsections}
    {selectedPath}
    depth={depth + 1}
    on:select={bubbleUp(dispatch, 'select')}
  />
{/if}

<style>
  .chevron{
    font-weight: bold;
    font-size: 2rem;
    margin: 0 0.5rem;
    /* Center vertically */
    padding-top: 0.2em;
  }
  .section-selector{
    min-width: 3em;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
  }
  .selected, .suggestion{
    padding: 0.2rem 0.5rem;
    text-align: left;
    border-radius: 3px;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .selected{
    color: yellow;
  }
  .suggestion{
    opacity: 0.5;
  }
  .suggestion:hover{
    opacity: 1;
  }
  .section-selector:not(:hover) button:not(:focus) + .dropdown{
    display: none;
  }
  .dropdown{
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #111;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .more{
    padding-bottom: 0.5em;
  }
</style>
