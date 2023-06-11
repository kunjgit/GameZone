/**
 * Factor for converting degree values into radian.
 */
Math.TO_RAD = Math.PI/180;


/**
 * return the angle between two points.
 *
 * @param {number} x1		x position of first point
 * @param {number} y1		y position of first point
 * @param {number} x2		x position of second point
 * @param {number} y2		y position of second point
 * @return {number} 		angle between two points (in radian)
 */
Math.getAngle = function( x1, y1, x2, y2 ) {
	
	var	dx = x1 - x2,
		dy = y1 - y2;
	
	return Math.atan2(dy,dx);
};


/**
 * return the degree between two points.
 *
 * @param {number} x1		x position of first point
 * @param {number} y1		y position of first point
 * @param {number} x2		x position of second point
 * @param {number} y2		y position of second point
 * @return {number} 		angle between two points (in degree)
 */
Math.getDegree = function( x1, y1, x2, y2 ) {

	var radian = Math.getAngle( x1, y1, x2, y2 );
	
	return radian / Math.TO_RAD;
};


/**
 * return a random number within given boundaries.
 *
 * @param {number} min		the lowest possible number
 * @param {number} max		the highest possible number
 * @param {boolean} round	if true, return integer
 * @return {number} 		a random number
 */
Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	
	if( round ) val = Math.round( val );
	
	return val;
};