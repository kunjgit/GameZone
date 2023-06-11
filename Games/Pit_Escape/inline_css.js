#!/usr/bin/env node
var fs = require('fs')
var html = fs.readFileSync('./min/0.html', {encoding: 'utf8'})
var css = fs.readFileSync('./min/0.css', {encoding: 'utf8'})
html = html.replace(/<link.*?>/, '<style>' + css + '</style>')
html = html.replace(/(<script.*?><\/script>)+/,
    '<script src=./script.js></script>')
console.log(html)
