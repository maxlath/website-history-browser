<div align="center">
  <h1>Website History Browser</h1>
  <img src="https://raw.githubusercontent.com/maxlath/website-history-browser/main/extension/history.svg" alt="logo">
</div>
<br>

A WebExtension to browse your history per website, with different kinds of filters not available in the native history browser

Features:
* text search through the history of a single website
* browse through sub-parts of a website
* browse through a website's bookmarks only
* display [Time Capsules](https://addons.mozilla.org/firefox/addon/time-capsule/) as special bookmarks

## Screenshots
<div style="display: flex;">
  <a title="text search through the history of a single website" href="https://addons.cdn.mozilla.net/user-media/previews/full/253/253959.png" target="_blank"><img src="https://addons.cdn.mozilla.net/user-media/previews/full/253/253959.png" alt="text search through the history of a single website"></a>
  <a title="browse through sub-parts of a website" href="https://addons.cdn.mozilla.net/user-media/previews/full/253/253960.png" target="_blank"><img src="https://addons.cdn.mozilla.net/user-media/previews/full/253/253960.png" alt="browse through sub-parts of a website"></a>
  <a title="browse through a website&#39;s bookmarks only" href="https://addons.cdn.mozilla.net/user-media/previews/full/253/253961.png" target="_blank"><img src="https://addons.cdn.mozilla.net/user-media/previews/full/253/253961.png" alt="browse through a website&#39;s bookmarks only"></a>
</div>

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
