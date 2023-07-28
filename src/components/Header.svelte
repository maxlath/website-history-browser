<script>
  import { setUrl } from '../lib/url'

  export let url

  async function onClick () {
    await setUrl()
    url = null
  }
</script>

<div class="header">
  <button on:click={onClick}>
    <img src="history.svg" alt="logo">
    <h1>Website History Browser</h1>
  </button>
</div>

<style>
  .header, button{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .header{
    margin: 0.5rem;
  }
  button{
    margin: 0;
    padding: 0;
    font-size: 1.4rem;
  }
  h1{
    font-size: 1.4rem;
    line-height: 1rem;
    margin: 0;
    color: #ddd;
  }
  img{
    height: 2rem;
    width: 2rem;
    margin: 0 1rem;
  }
</style>
