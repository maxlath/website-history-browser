<script>
  import { getLastVisitedHosts } from '../lib/history'
  import { setUrl } from '../lib/url'
  import { isOpenedOutside } from '../lib/utils'
  import { getHistory, lastSelectedFirst, resetHistory } from '../lib/history_browser_history'
  import PreviouslySelectedHost from './PreviouslySelectedHost.svelte'

  export let url

  let history, lastSelectedHosts, lastVisitedHosts

  const waitingForHistory = Promise.all([ getLastVisitedHosts(), getHistory() ])
    .then(res => {
      ;[ lastVisitedHosts, history ] = res
      lastSelectedHosts = history.sort(lastSelectedFirst)
    })

  async function selectUrl (e, selectedUrl) {
    if (e == null || !isOpenedOutside(e)) {
      url = selectedUrl
      e?.preventDefault()
      await setUrl(selectedUrl)
    }
  }

  async function clearHistory () {
    lastSelectedHosts = []
    await resetHistory()
  }
</script>

{#await waitingForHistory then}
  {#if lastVisitedHosts.length > 0}
    <section>
      <div class="list-header">
        <h3>Last visited</h3>
      </div>

      <ul>
        {#each lastVisitedHosts as hostEntry}
          <PreviouslySelectedHost entry={hostEntry} on:select={e => selectUrl(null, e.detail)} />
        {/each}
      </ul>
    </section>
  {/if}

  {#if lastSelectedHosts.length > 0}
    <section>
      <div class="list-header">
        <h3>Previously selected</h3>
        <button class="clear-history" on:click={clearHistory}>Clear</button>
      </div>

      <ul>
        {#each lastSelectedHosts as hostEntry}
          <PreviouslySelectedHost entry={hostEntry} on:select={e => selectUrl(null, e.detail)} />
        {/each}
      </ul>
    </section>
  {/if}
{/await}

<style>
  section{
    justify-content: center;
    background-color: #2a2a2a;
    margin: 1rem auto;
    border-radius: 3px;
    padding: 0.5em;
  }
  section ul{
    display: flex;
    flex-direction: row;
    align-items: space-around;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 12em;
    overflow-y: auto;
  }
  .list-header{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
    margin: 0.5em;
  }
  h3{
    margin: 0;
  }
  .clear-history{
    text-decoration: underline;
    color: white;
  }
</style>
