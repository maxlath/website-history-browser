<script>
  import { getHistoryByPeriod } from './history'
  import { daysAgo, daysAgoText } from './utils'

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
            <li class="history-item">
              <a href="{item.url}" title="{item.title} (total visits: {item.visitCount}, last visit: {daysAgoText(item.lastVisitTime)}, {new Date(item.lastVisitTime).toLocaleDateString()})">
                <div class="info">
                  <h3 class="title">{item.title}</h3>
                  <p class="url">{item.url.replace(origin, '')}</p>
                </div>
                <span class="visit-count" class:highlight={item.visitCount > 10}>{item.visitCount}</span>
              </a>
            </li>
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
  h1, h2, h3{
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
  h3{
    margin: 0;
  }
  .period:first-letter{
    text-transform: uppercase;
  }
  .history-item a{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.2em;
    margin: 0.1em 0;
    border-radius: 3px;
    text-decoration: none;
    background-color: #eee;
    transition: background-color 0.3s ease;
  }
  .history-item a:hover{
    background-color: #fafafa;
  }
  .url{
    color: #777;
    overflow: hidden;
    font-size: 0.8em;
  }
  .visit-count{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 1.4em;
    width: 1.4em;
    font-size: 0.8em;
    line-height: 0;
    background-color: #bbb;
    border-radius: 1em;
    color: white;
  }
  .visit-count.highlight{
    background-color: #123456;
  }
</style>
