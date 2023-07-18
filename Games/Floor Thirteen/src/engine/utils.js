// DOM
// ---

/**
 * Return a DOM element.
 *
 * @param  {String} id
 * @return {DOMElement}
 */
function $(id) {
  return document.getElementById(id);
}

// Array
// -----

/**
 * Convert arguments object to an Array.
 *
 * @param  {arguments} args
 * @return {Array}
 */
function argumentsToArray(args) {
  return Array.apply([], args);
}

/**
 * Computes the intersection of two arrays.
 *
 * @param  {Array} a An array to compare values against
 * @param  {Array} b The array with master values to check
 * @return {Array}
 */
function intersect(a, b) {
  var results = [], i = b.length;
  while (i--) {
    a.indexOf(b[i]) >= 0 && results.push(b[i]);
  }

  return results;
}

// Math
// ----

/**
 * Clamp a number.
 *
 * @param  {int} x
 * @param  {int} min
 * @param  {int} max
 * @return {int}
 */
function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

/**
 * Return a random integer.
 *
 * @param  {int} min
 * @param  {int} max
 * @return {int}
 */
function getRandomInt(min, max) {
  return min + Math.random() * (max - min + 1) | 0;
}

/**
 * Return a random element of an array.
 *
 * @param  {Array} arr
 * @return {Object}
 */
function getRandomElement(arr) {
  var n = arr.length;
  return (n > 1) ? arr[getRandomInt(0, n - 1)] :arr[0];
}

// Geom
// ----

/**
 * Creates a rectangle, specifying its properties
 *
 * @param  {float} x
 * @param  {float} y
 * @param  {float} w
 * @param  {float} h
 */
function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

__define(Rectangle, {
  /**
   * Returns whether the specified point is inside this rectangle.
   *
   * @param  {Rectangle} other
   * @return {Boolean}
   */
  c: function contains(x, y) {
    var that = this;
    return x >= that.x && x < (that.x + that.w) &&
      y >= that.y && y < (that.y + that.y);
  },
  /**
   * Returns whether or not another rectangle overlaps this one.
   *
   * @param  {Rectangle} other
   * @return {Boolean}
   */
  o: function overlap(other) {
    var that = this;
    return that.x < (other.x + other.w) && other.x < (that.x + that.w) &&
      that.y < (other.y + other.h) && other.y < (that.y + that.h);
  }
});
