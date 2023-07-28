<script>
  import { createEventDispatcher } from 'svelte'
  import { getWebsiteHistoryUrl } from '../lib/url'
  import { hide, isOpenedOutside } from '../lib/utils'

  export let entry

  const { protocol, host } = entry
  const origin = `${protocol}//${host}`

  const dispatch = createEventDispatcher()

  async function select (e) {
    if (!isOpenedOutside(e)) {
      dispatch('select', origin)
    }
  }
</script>

<li>
  <a
    href={getWebsiteHistoryUrl(origin)}
    title="Display {host} history browser"
    on:click={select}
  >
    <img src="{protocol}//{host}/favicon.ico" alt="favicon" class="favicon" on:error={hide}>
    <p class="host">{host}</p>
  </a>
</li>

<style>
  li{
    margin: 0.5em;
  }
  a{
    width: 10em;
    height: 8em;
    border-radius: 6px;
    background-color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-overflow: ellipsis;
    color: white;
    text-decoration: none;
  }
  p{
    display: block;
    max-width: 90%;
    overflow: hidden;
  }
  img{
    width: 4em;
    height: 4em;
    object-fit: cover;
    margin: 0.5em;
  }
</style>
