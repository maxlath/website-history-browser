<script>
  import { daysAgo, daysAgoText, localDate } from '../lib/date'
  import Star from './Star.svelte'
  export let item

  const getHighlightClass = visitCount => `highlight-${Math.trunc(Math.log10(visitCount))}`

  const daysAgoCount = daysAgo(item.lastVisitTime)
  const daysAgoLabel = daysAgoCount >= 2 ? `${daysAgoCount} days ago` : item.period.label
  const title = `${item.title}\n${item.url}
last visit: ${daysAgoText(item.lastVisitTime)}, ${localDate(item.lastVisitTime)} (${new Date(item.lastVisitTime).toISOString()})
total visits: ${item.visitCount}`
</script>

<a href="{item.url}" title="{title}" class="{item.period.className}">
  <div class="info">
    <div class="bookmarks">
      {#if item.bookmarks}<Star bookmarks={item.bookmarks} />{/if}
    </div>
    <h3 class="title">{item.shortTitle}</h3>
    <p class="url">{item.cleanedUrl}</p>
  </div>
  <!-- TODO: display bookmark tags once there is a standard API allowing it https://stackoverflow.com/questions/42294207/get-bookmark-tags  -->
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: true;
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
    color: #119717;
  }
  .yesterday .last-visit-relative-date{
    color: #068561;
  }
  .this-last-week .last-visit-relative-date{
    color: #175365;
  }
  .this-last-month .last-visit-relative-date{
    color: #103335;
  }
  .this-last-year .last-visit-relative-date{
    color: #002020;
  }
  .this-last-2-year .last-visit-relative-date{
    color: #001515;
  }
  .this-last-5-year .last-visit-relative-date{
    color: #001010;
  }
  .this-last-10-year .last-visit-relative-date{
    color: #000505;
  }
  .a-while-ago .last-visit-relative-date{
    color: #000;
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
    .visit-count-wrapper{
      width: 2em;
      margin-left: 0.2em;
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
