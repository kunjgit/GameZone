/**
 * Creates a new Rock.
 * 
 * @constructor
 * @extends Sprite
 * @param {Object} x
 * @param {Object} y
 * @param {Object} z
 */
$.Rock = function(x, y, z) {
  $.Sprite.call(this, 80, '#808080', 0.9, 1, 3);
  this.sprite.classList.add('rock');
  
  // The position is set only if fully defined.
  if (z) this.setPosition(x, y, z);
};

$.Rock.prototype = Object.create($.Sprite.prototype);
$.Rock.prototype.constructor = $.Rock;

/**
 * Pushes the rock in the given direction.
 * 
 * @param {number} dir The direction in which to push the Rock.
 */
$.Rock.prototype.push = function(dir) {
  $.Sound.play('push');
  this.setDirection(dir & 0x0F);
  this.move();
  this.setDirection(0);
};

/**
 * Invoked when a Rock hits another Sprite.
 * 
 * @param {Rock|Orb|Enemy} obj The Sprite that the Rock has hit.
 */
$.Rock.prototype.hit = function(obj) {
  // If the Rock has hit another Sprite that is not Ego, and the Rock has
  // moved, then it means that it has been pushed by Ego and has hit into
  // something, i.e. Ego has pushed it into something. The position is 
  // reset so that it effectively stops. Ego cannot push it any further in
  // that direction.
  if ((obj != $.ego) && (this.moved)) {
    this.reset();
  }
};