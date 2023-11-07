import App from './components/App.svelte'

const params = new URLSearchParams(location.search)

const app = new App({
  target: document.querySelector('main'),
  props: {
    url: params.get('url'),
  }
})

export default app
