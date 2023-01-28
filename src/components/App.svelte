<script>
  import Header from './Header.svelte'
  import WebsiteHistoryBrowser from './WebsiteHistoryBrowser.svelte'
  import WebsitePicker from './WebsitePicker.svelte'

  export let url
</script>

<Header bind:url />

{#if url}
  <WebsiteHistoryBrowser {url} />
{:else}
  <WebsitePicker bind:url />
{/if}
