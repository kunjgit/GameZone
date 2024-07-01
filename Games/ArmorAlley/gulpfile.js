/**
 * To be used with `gulp-cli` - e.g., running `gulp` will use this file for the build process.
 * https://www.npmjs.com/package/gulp-cli
 * For more details, see README_DEVEL.md.
 * 
 * Setup:
 *  npm install
 *  gulp
 * 
 * NOTE: fsevents@1.2.13 may be required to fix `"ReferenceError: primordials is not defined" in Node.js` error.
 * https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node-js/58394828#58394828
 * This "patch" works as of 05/2023, but introduces security warnings of its own.
 * This section applies to package.json.
 * 
 * "overrides": {
 *  "graceful-fs": "^4.2.11"
 * }
 */

// npmjs.com/package/[name] unless otherwise specified
const { gulp, src, dest, series } = require('gulp');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const { rollup } = require('rollup');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const imageInliner = require('postcss-image-inliner');

const imageInlinerOpts = {
  assetPaths: ['image'],
  maxFileSize: 2048
};

// https://github.com/dtao/gulp-esprima
const esprima = require('gulp-esprima');

var fs = require('fs');

// common paths / patterns
const jsPath = 'script';
const cssPath = 'css';

// "libraries" under script/
const lib = 'lib';

// minified postfix
const min = '_min';

const headerFile = 'build/aa_header.txt';

const css = (file) => `${cssPath}/${file}.css`; 
const js = (file) => `${jsPath}/${file}.js`;

// note: these have path + extensions added via js() / css().
const mainJSFile = js('aa');
const bundleFile = js('aa_main');
const mainCSSFile = css('aa');

async function bundleJS() {

  const bundle = await rollup({ input: mainJSFile });
  return bundle.write({ file: bundleFile });

}

function minifyJS() {

  return src(bundleFile)
    .pipe(terser({
      // https://github.com/terser/terser#minify-options
      compress: true,
      ecma: '2016'
    }))
    .pipe(dest(jsPath))

}

function concatJS() {

  return src(bundleFile)
    .pipe(concat(bundleFile))
    .pipe(header(fs.readFileSync(headerFile, 'utf8')))
    .pipe(dest('.'));

}

function minifyCSS() {

  return src(mainCSSFile)
    .pipe(postcss([imageInliner(imageInlinerOpts)]))
    // https://github.com/clean-css/clean-css#constructor-options
    .pipe(cleanCSS({ level: 2 }))
    .pipe(header(fs.readFileSync(headerFile, 'utf8')))
    .pipe(rename((path) => path.basename += min))
    .pipe(dest(cssPath));

}

exports.default = series(bundleJS, minifyJS, concatJS, minifyCSS);