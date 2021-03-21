<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { add, bubbleUp } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'
  import SelectorOption from './SelectorOption.svelte'

  export let sections, selectedPath, depth

  $: depthSelectedSectionName = selectedPath[depth]

  const dispatch = createEventDispatcher()

  const sectionsTotal = Object.values(sections)
    .map(section => section.items.length)
    .reduce(add, 0)
</script>

{#if sectionsTotal > 0}
  <span class="chevron">&gt;</span>

  <div class="section-selector">
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
    <ul class="options">
      {#each Object.entries(sections).sort(entriesByNumberOfItems) as [ sectionName, sectionData ]}
        <SelectorOption
          {sectionName}
          {sectionData}
          on:select={bubbleUp(dispatch, 'select')}
        />
      {/each}
    </ul>
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
    padding-top: 0.1em;
  }
  .section-selector{
    min-width: 3em;
    max-height: 1.2em;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 0.4em;
  }
  .selected, .suggestion{
    padding: 0.2rem 0.5rem;
    text-align: left;
    border-radius: 3px;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .suggestion{
    background-color: #111;
    opacity: 0.5;
  }
  .suggestion:hover{
    opacity: 1;
  }
  .options{
    background-color: #eee;
    z-index: 1;
    visibility: hidden;
  }
  .section-selector:hover .options, .section-selector:focus .options{
    visibility: visible;
  }
</style>
