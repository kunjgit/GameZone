/**
 * @class Vector
 * @version v1.0.0
 * @author Anurag Hazra
 * @param {number} x
 * @param {number} y
 */
class Vector {

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * get distance from two vectors
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @return {number}
   */
  static dist(v1, v2) {
    return v1.dist(v2);
  }

  /**
   * get distance squared from two vectors 
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @return {number}
   */
  static distSq(v1, v2) {
    return v1.distSq(v2);
  }

  /**
   * subtract two vectors
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @return {Vector}
   */
  static sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * add two vectors
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @return {Vector}
   */
  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * create vector from angle
   * @param {number} angle 
   */
  static fromAngle(angle) {
    let v = new Vector(0, 0);
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    return v;
  }

  /**
   * create random2d vector
   * @return {Vector}
   */
  static random2D() {
    return Vector.fromAngle(Math.random() * Math.PI * 180);
  }

  /**
   * adds random jitter motion
   * @param {number} a 
   * @param {number} b 
   * @return {Vector}
   */
  jitter(a, b) {
    var v = new Vector(a, b);
    this.x += normalizedRandom() * v.x;
    this.y += normalizedRandom() * v.y;
    return this;
  }

  /**
   * add this vector to another vector
   * @param {Vector|number} x 
   * @param {Number} y 
   * @return {Vector}
   */
  add(x, y) {
    if (arguments.length === 1) {
      this.x += x.x;
      this.y += x.y;
    } else if (arguments.length === 2) {
      this.x += x;
      this.y += y;
    }
    return this;
  }

  /**
   * subtracts this vector to another vector
   * @param {Vector|number} x 
   * @param {Number} y 
   * @return {Vector}
   */
  sub(x, y) {
    if (arguments.length === 1) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (arguments.length === 2) {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }

  /**
   * multiply this vector to a scalar value or a vector
   * @param {Vector|number} v 
   * @return {Vector}
   */
  mult(v) {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this;
  }

  /**
   * divide this vector to a scalar value or a vector
   * @param {Vector|number} v 
   * @return {Vector}
   */
  div(v) {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
    }
    return this;
  }

  /**
   * set this vectors angle
   * @param {number} angle 
   */
  setAngle(angle) {
    var len = this.mag();
    this.x = Math.cos(angle) * len;
    this.y = Math.sin(angle) * len;
  }

  /**
   * get the angle thia and given vector
   * @param {Vector} v 
   * @returns {number}
   */
  angle(v) {
    return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
  }

  /**
   * @param {Vector} vLeft 
   * @param {Vector} vRight
   * @returns {Vector} 
   */
  angle2(vLeft, vRight) {
    return Vector.sub(vLeft, this).angle(Vector.sub(vRight, this));
  }

  /**
   * rotate this vector by some origin and angle
   * @param {Vector} origin 
   * @param {theta} theta 
   * @returns {Vector}
   */
  rotateBy(origin, theta) {
    var x = this.x - origin.x;
    var y = this.y - origin.y;
    return new Vector(
      x * Math.cos(theta) - y * Math.sin(theta) + origin.x,
      x * Math.sin(theta) + y * Math.cos(theta) + origin.y
    );
  }


  /**
   * get the magnitude of this vector
   * @return {number}
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * get the magnitude sqr of this vector
   * @return {number}
   */
  magSq() {
    return (this.x * this.x + this.y * this.y);
  }

  /**
   * set x, y of this vector
   * @param {number} x 
   * @param {number} y 
   * @return {Vector}
   */
  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * set the magnitude of this vector
   * @param {number} value 
   * @return {Vector}
   */
  setMag(value) {
    this.normalize();
    this.mult(value);
    return this;
  }

  /**
   * normalize this vector 
   * @return {Vector}
   */
  normalize() {
    let m = this.mag();
    if (m > 0) {
      this.div(m);
    }
    return this;
  }

  /**
   * normalize this vector to a specific length
   * @param {number} length 
   * @return {Vector}
   */
  normalizeTo(length) {
    var mag = this.mag();
    if (mag > 0) {
      mag = length / mag;
      this.mult(mag);
    }
    return this;
  }

  /**
   * limit this vector
   * @param {number} max 
   * @return {Vector}
   */
  limit(max) {
    if (this.mag() > max) {
      this.normalize();
      this.mult(max);
    }
    return this;
  }

  /**
   * get heading of this vector in radians
   * @return {number}
   */
  heading() {
    return (-Math.atan2(-this.y, this.x));
  }

  /**
   * get distance between this and specific vector
   * @param {Vector} v 
   * @return {number}
   */
  dist(v) {
    let dx = this.x - v.x;
    let dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * get distance sqr between this and specific vector
   * @param {Vector} v 
   * @return {number}
   */
  distSq(v) {
    let dx = this.x - v.x;
    let dy = this.y - v.y;
    return (dx * dx + dy * dy);
  }

  /**
   * copy this vector
   * @return {Vector}
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * revert this vector
   * @return {Vector}
   */
  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * return an array representation of this vector
   * @return {Array}
   */
  array() {
    return [this.x, this.y];
  }

  /**
   * return a string representation of this vector
   * @return {String}
   */
  toString() {
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  }

  /**
   * 
   * @param {Vector} v 
   * @return {Vector}
   */
  project(v) {
    var coeff = ((this.x * v.x) + (this.y * v.y)) / ((v.x * v.x) + (v.y * v.y));
    this.x = coeff * v.x;
    this.y = coeff * v.y;
    return this;
  }

  /**
   * rotate this vector
   * @param {number} a 
   */
  rotate(a) {
    var b = this.heading() + a;
    var c = this.mag();
    this.x = Math.cos(b) * c;
    this.y = Math.sin(b) * c;
  }
}

export default Vector;