/**
 * Creates a new Bomb. Known as "glow" bombs, these can be fired by either
 * Ego or a Enemy. The target determines which one. The Bomb will not be
 * harmful to other enemies if the target is Ego, or harmful to Ego himself
 * if the target is Enemy. The combined heading and ystep allows the Bomb
 * freedom to be fired through any point within the 3D space of the room.
 * 
 * @constructor
 * @extends Sprite
 * @param {number} x The x position of the Bomb.
 * @param {number} y The y position of the Bomb (height above the ground).
 * @param {number} z The z position of the Bomb (i.e. z-index)
 * @param {string} colour The base colour of the Bomb.
 * @param {Ego|Enemy} shooter The Actor that has fired the glow Bomb.
 * @param target The constructor function of the target Actor type.
 * @param {number} heading The heading that the Bomb is moving in.
 * @param {number} ystep The vertical speed of the Bomb.
 */
$.Bomb = function(x, y, z, colour, shooter, target, heading, ystep) {
  $.Sprite.call(this, 8, $.Util.rgbToRgba(colour, 0.5), 1.0, 20, Math.abs(ystep));
  this.sprite.classList.add('bomb');
  this.heading = heading;
  
  // Adjust x position in relation to the heading. When facing left or right, the
  // Bomb will start from the left or right side of the Actor. This is where that 
  // adjustment happens.
  x = (heading == Math.PI? x - 25 : heading == 0? x + 25 : x);
  
  this.setPosition(x, y, z);
  this.target = target;
  this.shooter = shooter;
  
  // Set's the color property so that it is picked up by the box-shadow. The box
  // shadow is slightly more transparent to give a glowing effect.
  this.sprite.style.color = $.Util.rgbToRgba(colour, 0.3);
  
  this.step = 20;
  this.maxY = 1000;
  
  // If the ystep is negative, direction is down; otherwise it's up.
  if (ystep) this.direction |= (ystep < 0? $.Sprite.DOWN : $.Sprite.UP);
};

$.Bomb.prototype = Object.create($.Sprite.prototype);
$.Bomb.prototype.constructor = $.Bomb;

/**
 * Invoked when the Bomb hits another Sprite.
 * 
 * @param obj The Sprite that the Bomb has hit. Could be Ego, Enemy, Rock.
 */
$.Bomb.prototype.hit = function(obj) {
  // If this is not the shooter, then remove the Bomb from the screen. The
  // main processing for Bomb hits is handled within the hit method of the
  // object that was hit.
  if (obj.constructor != this.shooter) {
    this.stop();
  }
};

/**
 * Invoked by the Sprite constructor to render the background image, but 
 * a Bomb has no background image, so it renders nothing.
 */
$.Bomb.prototype.buildCanvas = function() {};
