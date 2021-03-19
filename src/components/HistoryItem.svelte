<script>
  import { daysAgo, daysAgoText, localDate } from '../lib/date'
  import Star from './Star.svelte'
  export let item, origin

  const getHighlightClass = visitCount => `highlight-${Math.trunc(Math.log10(visitCount))}`

  const daysAgoCount = daysAgo(item.lastVisitTime)
  const daysAgoLabel = daysAgoCount >= 2 ? `${daysAgoCount} days ago` : item.period.label
  const title = `${item.title}\n${item.url}
last visit: ${daysAgoText(item.lastVisitTime)}, ${localDate(item.lastVisitTime)}
total visits: ${item.visitCount}`
</script>

<a href="{item.url}" title="{title}" class="{item.period.className}">
  <div class="info">
    <span class="bookmarks"><Star bookmarks={item.bookmarks} /></span>
    <h3 class="title">{item.shortTitle}</h3>
    <p class="url">{item.url.replace(origin, '')}</p>
  </div>
  <p class="last-visit-absolute-date">{localDate(item.lastVisitTime)}</p>
  <p class="last-visit-relative-date">{daysAgoLabel}</p>
  <div class="visit-count-wrapper">
    <p class="visit-count {getHighlightClass(item.visitCount)}">{item.visitCount}</p>
  </div>
</a>

<style>
  a{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    margin: 0.1em 0;
    border-radius: 2px;
    text-decoration: none;
    color: #222;
    background-color: #eee;
    transition: background-color 0.3s ease;
  }
  a:hover{
    background-color: #fafafa;
  }
  .info{
    margin-right: auto;
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
  .highlight-0{ background-color: #bbb; }
  .highlight-1{ background-color: #175365; }
  .highlight-2{ background-color: #4aa; }
  .highlight-3{ background-color: yellowgreen; }
  .highlight-4{
    background-color: yellow;
    color: #222;
  }
  h3, p{
    padding: 0;
    margin: 0;
    line-height: 1rem;
    font-size: 1rem;
  }
  h3{
    color: #222;
  }
  .last-visit-absolute-date{
    color: #444;
    margin: 0 0.5em;
  }
  .last-visit-relative-date{
    color: #777;
    width: 6em;
    text-align: right;
  }
  .today .last-visit-relative-date{
    color: greenyellow;
  }
  .yesterday .last-visit-relative-date{
    color: lightgreen;
  }
  .this-last-week .last-visit-relative-date{
    color: yellow;
  }
  .this-last-month .last-visit-relative-date{
    color: blueviolet;
  }
  .this-last-year .last-visit-relative-date{
    color: lightskyblue;
  }
  .this-last-2-year .last-visit-relative-date{
    color: orange;
  }
  .this-last-5-year .last-visit-relative-date{
    color: orangered;
  }
  .this-last-10-year .last-visit-relative-date{
    color: darkred;
  }
  .a-while-ago .last-visit-relative-date{
    color: darkslateblue;
  }
  /*Large screens*/
  @media screen and (min-width: 800px) {
    .title{
      max-width: 50em;
      margin: 0 0.2em;
    }
    .title:not(:empty) + .url{
      margin-left: 0.5em;
    }
    .info{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .visit-count-wrapper{
      width: 2em;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
  /*Small screens*/
  @media screen and (max-width: 800px) {
    .last-visit-relative-date, .last-visit-absolute-date{
      display: none;
    }
  }
</style>
