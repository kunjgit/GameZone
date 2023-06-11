/**
 * Creates a new Enemy.
 * 
 * @constructor
 * @extends Actor
 * @param {number} zone Will be either 0, 1, 2 or 3, to represent Earth, Air, Water, Fire.
 */
$.Enemy = function(zone) {
  // The amount of gravity is randomly chosen so that Enemies jump at different heights and 
  // speeds and therefore are usually out of sync with each other.
  var g = (((Math.random() * 3) / 10) + 0.4);
  
  // The Enemy's colour depends on the zone. Earth is brown, Air is very light grey, Fire is red, and Water is blue.
  $.Actor.call(this, 50, ['rgb(139,71,38)','rgb(209,238,238)','rgb(16,78,139)','rgb(220,20,20)'][zone], 0.95, 2, 10, g);
  
  this.sprite.classList.add('enemy');
  this.bombDelay = 0;
  this.zone = zone;
};

$.Enemy.prototype = Object.create($.Actor.prototype);
$.Enemy.prototype.constructor = $.Enemy;

/**
 * Updates the Enemy for the current frame. 
 */
$.Enemy.prototype.update = function() {
  // Mask out left/right/in/out but retain the current jumping directions.
  var direction = (this.direction & $.Sprite.UP_DOWN);
  
  // Work out the distance between the Enemy and Ego.
  var dx = this.x - $.ego.x;
  var dz = this.z - $.ego.z;
  
  // If Ego is too close, then start to run away.
  var run = ((dx * dx + dz * dz) < 5000);

  if (this.x < ($.ego.x - 100)) {
    direction |= (run? $.Sprite.LEFT : $.Sprite.RIGHT);
  }
  if (this.x > ($.ego.x + 100)) {
    direction |= (run? $.Sprite.RIGHT : $.Sprite.LEFT);
  }
  if (this.z < $.ego.z) {
    direction |= (run? $.Sprite.IN : $.Sprite.OUT);
  }
  if (this.z > $.ego.z) {
    direction |= (run? $.Sprite.OUT : $.Sprite.IN);
  }
  
  if (this.y == 0) {
    direction |= $.Sprite.UP;
  }
  
  this.setDirection(direction);
  
  // If the Enemy is not in the run mode, clear the heading so that it doesn't move. In
  // combination with the direction setting above, this makes the Enemy face in the direction
  // of Ego without actually moving towards Ego. This makes it look like the Enemy is looking
  // at Ego when firing glow Bombs.
  if (!run) {
    this.heading = null;
  }
  
  this.move();
  
  // On average, once every 50 frames the Enemy will fire a glow Bomb. There is a small enforced
  // delay of 3 frames to protect against Bombs being fired too quickly.
  if (((Math.random() * 50) < 1) && (this.bombDelay <= 0)) {
    // Calculate the heading and ystep using Ego's position and the Enemy position. This is 
    // exactly accurate, so if Ego isn't continually moving, Ego will be hit.
    var bombHeading = Math.atan2($.ego.z - this.z, $.ego.cx - this.cx);
    var bombYStep = ($.ego.y - this.y) / ((this.distance($.ego) / 20));
    
    // Add the glow Bomb to the game and play the enemy fire sound.
    $.Game.add(new $.Bomb(this.cx, this.cy, this.z-1, this.colour, $.Enemy, $.Ego, bombHeading, bombYStep));
    $.Sound.play('enemy');
    
    // This is the enforced 3 frame delay between Bombs.
    this.bombDelay = 3;
  } else {
    this.bombDelay--;
  }
};

/**
 * Invoked when the Enemy hits another Sprite.
 *  
 * @param {Bomb|Rock|Ego|Enemy} obj
 */
$.Enemy.prototype.hit = function(obj) {
  var enemy = this;
  
  if (obj instanceof $.Bomb) {
    // If the Enemy has hit a bomb and it is targeted at Enemies then Ego has
    // hit this Enemy with a Bomb. 
    if (obj.target == $.Enemy) {
      // Trigger the explode transition, which takes 100ms. Also play the explosion
      // sound and increment the player's score as appropriate for the current level.
      this.sprite.classList.add('explode');
      $.Sound.play('explosion');
      $.Game.addToScore(30 + $.Game.level * 20);
      
      // After the 100ms explode transition, remove the Enemy from the screen.
      setTimeout(function() {
        enemy.stop();
      }, 100);
    }
  } else if (this.moved) {
    // Otherwise for all other types of Sprite, if the Enemy has moved, then reset it's 
    // position. This stops it from moving through obstacles.
    for (;this.reset() && this.touching(obj););
  }
};

/**
 * Invoked when the Enemy has hit an edge.
 *  
 * @param {Array} edge If defined, it will be an array that represents the edge that was hit.
 */
$.Enemy.prototype.hitEdge = function(edge) {
  // If it is one of the four room edges (i.e. not the ground), then reset the Enemy's 
  // position. Enemies cannot leave the room they are in.
  if (edge) this.reset();
};