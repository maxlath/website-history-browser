<script>
  import { getHistoryByPeriod } from './history'
  import HistoryItem from './HistoryItem.svelte'

  let host, origin

  let historyPromise = browser.tabs.query({currentWindow: true, active: true})
    .then(([ currentTab ]) => {
      ({ host, origin } = new URL(currentTab.url))
      return getHistoryByPeriod({ origin })
    })
</script>

{#await historyPromise}
  Loading history...
{:then historyItemsByPeriod}
  <h1>{host}</h1>
  <ul class="history-items-by-period">
    {#each Object.entries(historyItemsByPeriod) as [ period, periodHistoryItems ]}
      <li>
        <h2 class="period">{period}</h2>
        <ul>
          {#each periodHistoryItems as item (item.id)}
            <HistoryItem {item} {origin} />
          {/each}
        </ul>
      </li>
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
  }
  .history-items-by-period:not(:empty){
    min-width: 40em;
  }
  ul, li, p{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  h1, h2{
    padding: 0;
    line-height: 1rem;
    font-size: 1rem;
    color: #222;
  }
  h1, h2{
    margin: 0.5em 0;
  }
  h1{
    color: #777;
    text-align: center;
  }
  h2{
    text-align: center;
  }
  .period:first-letter{
    text-transform: uppercase;
  }
</style>
