<script>
  import HistoryItem from './HistoryItem.svelte'
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'

  export let period, periodHistoryItems, shownPeriods, origin

  const dispatch = createEventDispatcher()
</script>

<li class="period" class:shown={shownPeriods[period]}>
  <button on:click={() => dispatch('toggle')}>
    <span class="sign">⌃</span>
    <h2>{period}</h2>
    <div class="count-wrapper"><span class="count">{periodHistoryItems.length}</span></div>
  </button>
  {#if shownPeriods[period]}
    <ul in:slide={{ duration: 100 }} out:slide={{ duration: 100 }}>
      {#each periodHistoryItems as item (item.id)}
        <HistoryItem {item} {origin} />
      {/each}
    </ul>
  {/if}
</li>

<style>
  ul, li{
    display: flex;
    flex-direction: column;
    align-items: stretch;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button{
    padding: 0;
    margin: 1em 0 0.2em 0;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: white;
    background-color: #175365ee;
    transition: background-color 0.3s ease;
    border-radius: 3px;
  }
  button:hover{
    background-color: #175365;
    border-radius: 3px;
  }
  h2{
    padding: 0;
    line-height: 1rem;
    font-size: 1rem;
    margin: 0.5em 0;
    text-align: center;
    width: 10em;
  }
  h2:first-letter{
    text-transform: uppercase;
  }
  .sign{
    font-size: 2rem;
    font-weight: bold;
    margin-left: auto;
    margin-right: 1rem;
  }
  .period.shown .sign{
    margin-bottom: -0.5em;
  }
  .period:not(.shown) .sign{
    margin-top: -0.5em;
    transform: rotate(180deg);
  }
  .count-wrapper{
    margin-left: auto;
    margin-right: 0.4em;
    width: 3em;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .count{
    background-color: #ddd;
    border-radius: 3px;
    padding: 0 0.2em;
    color: #222;
    opacity: 0.9;
    font-size: 0.8rem;
  }
</style>
