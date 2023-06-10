#! /bin/bash
coffee -c game.coffee
uglifyjs game.js -mc -o game.min.js
zip -r9 pack.zip img/ game.min.js index.html
wc -c pack.zip
