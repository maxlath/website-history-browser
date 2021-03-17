<script>
  import { getHistoryByPeriod, findPeriodsToShow, filterByText } from './history'
  import { getCurrentTabUrl } from './tabs'
  import PeriodHistoryItems from './PeriodHistoryItems.svelte'

  export let url

  let host, origin, historyItemsByPeriod, allHistoryItemsByPeriod, shownPeriods = {}

  const init = async () => {
    url = url || await getCurrentTabUrl();
    ({ host, origin } = new URL(url))
    historyItemsByPeriod = await getHistoryByPeriod({ origin })
    allHistoryItemsByPeriod = historyItemsByPeriod
    shownPeriods = findPeriodsToShow(historyItemsByPeriod, 50)
  }

  const historyPromise = init()

  const filter = event => {
    historyItemsByPeriod = filterByText(allHistoryItemsByPeriod, event.target.value)
    shownPeriods = findPeriodsToShow(historyItemsByPeriod, 50)
  }

</script>

{#await historyPromise}
  <p class="loading">Loading history...</p>
{:then}
  <h1>{host}</h1>
  <input type="text" placeholder="filter..." on:keyup={filter}>
  <ul class="history-items-by-period">
    {#each Object.entries(historyItemsByPeriod) as [ period, periodHistoryItems ] (period)}
      <PeriodHistoryItems
        {period}
        {periodHistoryItems}
        {shownPeriods}
        {origin}
        on:toggle={() => shownPeriods[period] = !shownPeriods[period]}
        />
    {:else}
      <p class="empty">nothing found</p>
    {/each}
  </ul>
{:catch error}
  <p>{error}</p>
{/await}

<style>
  :global(body){
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color: #222;
    color: white;
  }
  ul, p{
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 1rem;
  }
  h1{
    padding: 0;
    line-height: 1rem;
    font-size: 1.2rem;
    color: #ddd;
    margin: 1em 0 0.5em 0;
    color: #aaa;
    text-align: center;
  }
  .loading, .empty{
    text-align: center;
    padding: 1em;
  }
  .empty{
    font-style: italic;
  }
</style>
