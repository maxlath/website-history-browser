<script>
  import { createEventDispatcher } from 'svelte'
  export let textFilter, placeholder = ''

  const dispatch = createEventDispatcher()

  $: dispatch('change', textFilter)
</script>

<div class="input-wrapper">
  <!-- TODO: replace with input[type="search"] once Firefox implements the close button-->
  <input type="text" {placeholder} bind:value={textFilter}>
  <button
    class="close"
    on:click={() => textFilter = null}
    on:keyup={({ key }) => key === 'Enter' ? textFilter = null : null}
    >
    <span class="cross">✕</span>
  </button>
</div>


<style>
  .input-wrapper{
    position: relative;
    display: flex;
  }
  input{
    flex: 1;
    margin: 0.5em;
    border-radius: 2px;
    padding: 0.5em;
    border: none;
  }
  .close{
    position: absolute;
    top: 0;
    right: 0.8em;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .cross{
    background-color: inherit;
    transition: background-color 0.3s ease;
    border-radius: 3px;
    padding: 0.2em 0.5em;
  }
  .close:hover .cross, .close:focus .cross{
    background-color: #e2e2e2;
  }
</style>
