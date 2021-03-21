<script>
  import { entriesByNumberOfItems } from '../lib/sort'
  import { bubbleUp } from '../lib/utils'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let sectionName, sectionData
  const sections = sectionData.subsections
</script>

<li class="option">
  <button on:click={() => dispatch('select', { sectionName, sectionData })}>
    <span class="name">{sectionName}</span>
    <span class="count">{sectionData.items.length}</span>
  </button>
  {#if Object.keys(sections).length > 0}
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
    padding: 0.2em 0.5em;
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
  .name{
    color: white;
    margin-right: 0.5em;
  }
  .count{
    margin-left: auto;
    color: #777;
  }
</style>
