<script>
  import HistoryItem from './HistoryItem.svelte'
  export let period, periodHistoryItems, shownPeriods, origin
</script>

<li class="period">
  <button>
    <h2>{period}</h2>
    <span class="sign">⌃</span>
  </button>
  {#if shownPeriods[period]}
    <ul>
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
    background-color: blue;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .period:first-letter{
    text-transform: uppercase;
  }
  button{
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background-color: red;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    cursor: pointer;
  }
  h2{
    padding: 0;
    line-height: 1rem;
    font-size: 1rem;
    color: #ddd;
    margin: 0.5em 0;
    text-align: center;
  }
</style>
