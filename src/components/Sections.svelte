<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { add } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'

  export let sections, selectedSections, depth

  $: depthSelectedSection = selectedSections[depth]

  const dispatch = createEventDispatcher()

  const sectionsTotal = Object.values(sections)
    .map(section => section.items.length)
    .reduce(add, 0)
</script>

{#if sectionsTotal > 0}
  <span class="chevron">&gt;</span>

  <div class="section-selector">
    {#if depthSelectedSection}
      <button class="selected">{depthSelectedSection}</button>
    {:else}
      <button class="suggestion">
        <span class="name">all</span>
        <span class="count">{sectionsTotal}</span>
      </button>
    {/if}
    <ul class="options">
      {#each Object.entries(sections).sort(entriesByNumberOfItems) as [ sectionName, sectionData ]}
        <li class="option">
          <button on:click={() => {
            console.log('select', { sectionName, sectionData })
            dispatch('select', { sectionName, sectionData, depth })
            }}>
            <span class="name">{sectionName}</span>
            <span class="count">{sectionData.items.length}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{#if depthSelectedSection && sections[depthSelectedSection].subsections != null}
  <svelte:self
    sections={sections[depthSelectedSection].subsections}
    {selectedSections}
    depth={depth + 1}
    on:select={event => {
      console.log('pass', event.detail)
      dispatch('select', event.detail)
    }}
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
  .option{
    display: flex;
  }
  .option button{
    flex: 1;
    padding: 0.2em 0.5em;
    background-color: #222;
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
  .name{
    color: white;
    margin-right: 0.5em;
  }
  .count{
    margin-left: auto;
    color: #777;
  }
  .section-selector:hover .options, .section-selector:focus .options{
    visibility: visible;
  }
</style>
