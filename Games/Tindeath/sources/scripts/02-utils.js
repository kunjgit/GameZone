// alias functions
var $ = (id) => document.getElementById(id);
var $$ = (selector) => document.querySelector(selector);
var $$$ = (selector) => document.querySelectorAll(selector);
var createElement = (type) => document.createElement(type);
var random = () => Math.random();
var getFromLS = (item) => JSON.parse(window.localStorage.getItem(item));
var setToLS = (item, value) =>
  window.localStorage.setItem(item, JSON.stringify(value));

// Get a random item from an array
function getRandomItem(array) {
  return array[~~(random() * array.length)];
}

// Get a random int in a range
function getRandomNumber(min, max) {
  return ~~(random() * (max - min + 1)) + min;
}

// Get a random int in a range
function getRandomGaussian(min, max) {
  return ~~(gaussianRandom() * (max - min)) + min;
}

function gaussianRandom() {
  let u = 0;
  let v = 0;
  //Converting [0,1) to (0,1)
  while (u === 0) {
    u = random();
  }
  while (v === 0) {
    v = random();
  }
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    return gaussianRandom();
  } // resample between 0 and 1
  return num;
}

function createSvg(width, height, pathList, properties = {}) {
  let props = "";
  Object.entries(properties).forEach(([property, value]) => {
    props += ` ${property}="${value}"`;
  });
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" ${props}>${pathList
    .map(createSvgPath)
    .join("")}</svg>`;
}

function createSvgPath(properties) {
  let props = "";
  Object.entries(properties).forEach(([property, value]) => {
    props += ` ${property}="${value}"`;
  });
  return `<${props.includes("cx=") ? "circle" : "path"} ${props}/>`;
}
