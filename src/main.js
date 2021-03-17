import App from './App.svelte'

const app = new App({
  target: document.querySelector('main'),
  props: {
    url: new URLSearchParams(location.search).get('url')
  }
})

export default app
