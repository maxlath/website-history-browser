<script>
  import { daysAgoText } from './utils'
  export let item, origin
</script>

<li class="history-item">
  <a href="{item.url}" title="{item.title} (total visits: {item.visitCount}, last visit: {daysAgoText(item.lastVisitTime)}, {new Date(item.lastVisitTime).toLocaleDateString()})">
    <div class="info">
      <h3 class="title">{item.title}</h3>
      <p class="url">{item.url.replace(origin, '')}</p>
    </div>
    <span class="visit-count" class:highlight={item.visitCount > 10}>{item.visitCount}</span>
  </a>
</li>

<style>
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
  h3{
    padding: 0;
    line-height: 1rem;
    font-size: 1rem;
    color: #222;
    margin: 0;
  }
</style>
