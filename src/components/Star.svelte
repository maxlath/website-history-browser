<script>
  export let bookmarks = null, timeCapsule = null

  let fill = '#ffe900'

  if (bookmarks) {
    const bookmarkWithTimeCapsule = bookmarks.find(bookmark => bookmark.timeCapsule != null)
    if (bookmarkWithTimeCapsule) {
      ({ timeCapsule } = bookmarkWithTimeCapsule)
      fill = '#0099d4'
    }
  }
</script>

<div class="wrapper">
  <!-- Borrowed from addons.mozilla.org -->
  <svg viewBox="0 0 64 64" class="IconStar-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g fill="{fill}" fill-rule="nonzero" transform="translate(-140.000000, -607.000000)" fill-opacity="1">
      <path d="M154.994575,670.99995 C153.704598,671.000763 152.477615,670.442079 151.630967,669.468394 C150.784319,668.49471 150.401158,667.201652 150.580582,665.923653 L153.046749,648.259919 L141.193762,635.514481 C140.080773,634.318044 139.711733,632.608076 140.232152,631.058811 C140.752571,629.509546 142.078939,628.369589 143.688275,628.088421 L160.214424,625.130961 L168.013827,609.468577 C168.767364,607.955994 170.3113,607 172.000594,607 C173.689888,607 175.233824,607.955994 175.98736,609.468577 L183.790813,625.130961 L200.329111,628.08437 C201.934946,628.371492 203.25546,629.513805 203.771316,631.062053 C204.287172,632.610301 203.915846,634.316807 202.803377,635.51043 L190.954439,648.26397 L193.420606,665.923653 C193.652457,667.578241 192.93975,669.223573 191.574418,670.185702 C190.209085,671.147831 188.420524,671.265104 186.941351,670.489485 L172.002619,662.698806 L157.047688,670.50569 C156.413201,670.833752 155.708782,671.003331 154.994575,670.99995 Z"></path>
    </g>
  </svg>
  {#if timeCapsule}
    <span class="peridicity">{timeCapsule.periodicity}</span>
  {/if}
</div>

<style>
  .wrapper{
    position: relative;
    height: 1em;
    width: 1em;
    margin-right: 0.4em;
  }
  .peridicity{
    position: absolute;
    top: 1px;
    left: -0.1em;
    height: 1em;
    width: 1em;
    padding: 0 0.2em;
    color: white;
    font-size: 0.8rem;
    border-radius: 3px;
    text-shadow: 1px 0 0 #555, -1px 0 0 #555, 0 1px 0 #555, 0 -1px 0 #555, 1px 1px #555, -1px -1px 0 #555, 1px -1px 0 #555, -1px 1px 0 #555;
  }
</style>
