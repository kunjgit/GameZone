/**
 * Creates a new Orb. This represents the power Orb in the starting screen 
 * from which Ego absorbs power.
 * 
 * @constructor
 * @extends Sprite
 * @param {Object} x The x position of the Orb.
 * @param {Object} z The y position of the Orb.
 */
$.Orb = function(x, z) {
  $.Sprite.call(this, 175, '#C5B358', 1.0, 1, 2);
  this.sprite.classList.add('orb');
  this.setPosition(x, 0, z);
};

$.Orb.prototype = Object.create($.Sprite.prototype);
$.Orb.prototype.constructor = $.Orb;
