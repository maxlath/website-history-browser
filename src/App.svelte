<script>
  import { getHistoryByPeriod, findPeriodsToShow } from './history'
  import { getCurrentTabUrl } from './tabs'
  import PeriodHistoryItems from './PeriodHistoryItems.svelte'

  export let url

  let host, origin, historyItemsByPeriod, shownPeriods = {}

  const init = async () => {
    url = url || await getCurrentTabUrl();
    ({ host, origin } = new URL(url))
    historyItemsByPeriod = await getHistoryByPeriod({ origin })
    shownPeriods = findPeriodsToShow(historyItemsByPeriod, 10)
  }

  const historyPromise = init()
</script>

{#await historyPromise}
  Loading history...
{:then}
  <h1>{host}</h1>
  <ul class="history-items-by-period">
    {#each Object.entries(historyItemsByPeriod) as [ period, periodHistoryItems ] (period)}
      <PeriodHistoryItems
        {period}
        {periodHistoryItems}
        {shownPeriods}
        {origin}
        on:toggle={() => shownPeriods[period] = !shownPeriods[period]}
        />
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
</style>
