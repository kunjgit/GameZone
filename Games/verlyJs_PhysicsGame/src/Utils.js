/**
 * @method normalizedRandom
 */
export const normalizedRandom = function () {
  return Math.random() * 2 - 1;
};

/**
 * @method clamp
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export const clamp = function (value, min, max) {
  return Math.max(min, Math.min(value, max));
}
/**
 * @method random
 */
export const random = function (rand, min, max) {
  //one param
  if (arguments.length === 1) {
    return Math.random() * arguments[0];
  } else if (arguments.length == 2) {
    //min and max
    max = min;
    min = rand;
    rand = Math.random;
  }
  if (!min && !max) {
    return Math.random();
  } else if (!max) {
    //if only one is provided, then thats actually the max
    max = min;
    return rand() * max;
  }
  return rand() * (max - min) + min;
};
/**
 * @method lerp
 * @param {number} a
 * @param {number} b
 * @param {number} p
 */
export const lerp = function (a, b, p) {
  return (b - a) * p + a;
}

/**
 * Convert from degrees to radians.
 * @method radians
 * @param {number} degrees
 */
export const radians = function(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Convert from radians to degrees.
 * @method degrees
 * @param {number} radians
 */
export const degrees = function(radians) {
	return radians * 180 / Math.PI;
}