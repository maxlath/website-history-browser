<div align="center">
  <h1>Website History Browser</h1>
  <img src="https://raw.githubusercontent.com/maxlath/website-history-browser/main/extension/history.svg" alt="logo" width="50%">
</div>
<br>

A WebExtension to browse your history per website, with different kinds of filters not available in the native history browser

## Features
* text search through the history of a single website
<div><a title="text search through the history of a single website" href="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/per_website_text_filter.jpg" target="_blank"><img src="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/per_website_text_filter.jpg" alt="text search through the history of a single website"></a></div>

* browse through sub-parts of a website
<div><a title="browse through sub-parts of a website" href="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/tree.jpg" target="_blank"><img src="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/tree.jpg" alt="browse through sub-parts of a website"></a></div>

* browse through a website's bookmarks only, and display [Time Capsules](https://addons.mozilla.org/firefox/addon/time-capsule/) as special bookmarks
<div><a title="browse through a website&#39;s bookmarks only" href="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/time_capsules_integration.jpg" target="_blank"><img src="https://raw.githubusercontent.com/maxlath/website-history-browser/main/img/screenshots/time_capsules_integration.jpg" alt="browse through a website&#39;s bookmarks only"></a></div>

## Default shortkeys
Default shortkeys
* `Ctrl+Alt+H`: display history browser in a popup
* `Ctrl+Alt+J`: display history browser in a new tab

## Install
* [Firefox](https://addons.mozilla.org/firefox/addon/website-history-browser/)

## Development setup
```sh
git clone https://github.com/maxlath/website-history-browser
cd website-history-browser
npm install

# Rebuild extension files on source file changes
npm run watch
# In another terminal, run this command to open a firefox instance with the extension installed
# as a temporary extension, auto-reloading on file changes
npm run auto-reload-extension
```

## Build
```sh
# Builds the extension zip file in ./web-ext-artifacts
npm run build
```

## License
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
