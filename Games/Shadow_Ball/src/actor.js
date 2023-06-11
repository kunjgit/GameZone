/**
 * Creates a new Actor, a special type of Sprite that is rendered differently 
 * depending on what direction it is moving. Not instantiated directly, but 
 * rather extended by Ego and Enemy.
 * 
 * @constructor
 * @extends Sprite
 */
$.Actor = function() {
  $.Sprite.apply(this, arguments);
  this.sprite.classList.add('actor');
};

$.Actor.prototype = Object.create($.Sprite.prototype);
$.Actor.prototype.constructor = $.Actor;

/**
 * Builds the background image canvas for the Actor. Ego and Enemy are visually 
 * similar. It is only the colour that differs. The colour, size, and texture
 * are already defined on the object as part of the object instantiation.
 */
$.Actor.prototype.buildCanvas = function() {
  // Create a single canvas to render the sprite sheet for the four directions.
  var ctx = $.Util.create2dContext(this.size * 4, this.size);
  
  // For each direction, render the Actor facing in that direction.
  for (var d = 0; d < 4; d++) {
    ctx.drawImage($.Util.renderSphere(this.size, d + 1, this.colour, this.texture, 'black'), d * this.size, 0);
  }
  
  return ctx.canvas;
};
