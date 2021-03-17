<script>
  import { daysAgoText } from './utils'
  export let item, origin

  const getHighlightClass = visitCount => `highlight-${Math.trunc(Math.log10(visitCount))}`

</script>

<li class="history-item">
  <a href="{item.url}" title="{item.title} (total visits: {item.visitCount}, last visit: {daysAgoText(item.lastVisitTime)}, {new Date(item.lastVisitTime).toLocaleDateString()})">
    <div class="info">
      <!-- TODO: highlight bookmarked URLs -->
      <!-- TODO: display favicon once https://bugzilla.mozilla.org/show_bug.cgi?id=1315616 is solved -->
      <h3 class="title">{item.title}</h3>
      <p class="url">{item.url.replace(origin, '')}</p>
    </div>
    <span class="visit-count {getHighlightClass(item.visitCount)}">{item.visitCount}</span>
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
    border-radius: 2px;
    text-decoration: none;
    background-color: #eee;
    transition: background-color 0.3s ease;
  }
  .history-item a:hover{
    background-color: #fafafa;
  }
  .url{
    color: #555;
    overflow: hidden;
    font-size: 0.9em;
    margin: 0;
  }
  .visit-count{
    font-size: 0.8em;
    border-radius: 2px;
    padding: 0 0.2em;
    color: white;
  }
  .highlight-0{
    background-color: #bbb;
  }
  .highlight-1{
    background-color: #175365;
  }
  .highlight-2{
    background-color: #4aa;
  }
  .highlight-3{
    background-color: yellowgreen;
  }
  .highlight-4{
    background-color: yellow;
    color: #222;
  }
  h3{
    padding: 0;
    line-height: 1rem;
    font-size: 1rem;
    color: #222;
    margin: 0;
  }
  /*Large screens*/
  @media screen and (min-width: 800px) {
    .title{
      max-width: 50em;
      margin: 0 0.2em;
    }
    .info{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .url{
      margin-left: 0.5em;
    }
  }
</style>
