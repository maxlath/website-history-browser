# Website History Browser

A WebExtension to browse your history per website, with different kinds of filters not available in the native history browser

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
