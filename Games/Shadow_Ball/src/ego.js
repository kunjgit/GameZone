/**
 * Creates a new Ego. This is the main character whom the player controls. The
 * name originates with the old Sierra On-Line 3D animated adventure games. There
 * should be only one instance of this class.
 * 
 * @constructor
 * @extends Actor
 * @property {number} power The amount of golden power that Ego currently has.
 * @property {number} rocks The number of rocks that Ego is currently carrying.
 */
$.Ego = function() {
  $.Actor.call(this, 50, 'rgb(197,179,88)', 0.95, 5);
  this.sprite.classList.add('ego');
  this.setDirection($.Sprite.OUT);
  this.power = 0;
  this.rocks = 0;
};

$.Ego.prototype = Object.create($.Actor.prototype);
$.Ego.prototype.constructor = $.Ego;

/**
 * Adjusts the power property by the given amount, which could be either
 * negative or positive. It is invoked whenever Ego absorbs power, and 
 * also when Ego is hit by an enemy Bomb, hits the zone barrier, or fires
 * a Bomb.
 * 
 * @param {number} amount The amount to adjust the power by.
 */
$.Ego.prototype.powerUp = function(amount) {
  this.power += amount;
  
  if (this.power < 0) {
    // If the power goes below 0, it is the end of the game.
    this.power = 0;
    $.Game.gameover();
  } else if (this.power > 694) {
    // If power goes above the upper limit, we cap it. Ego cannot absorb 
    // more than the width of the power bar.
    this.power = 694;
  }
  if (this.power == 0) {
    // If Ego has no power, remove the class that makes Ego glow with power.
    this.sprite.classList.remove('charged');
  } else {
    // Otherwise if Ego has power, then we add the class to make him glow.
    this.sprite.classList.add('charged');
    
    // If the change was positive, Ego must have absorbed power.
    if (amount > 0) $.Sound.play('powerup');
  }
  
  // Removing the style at this point ensures that we clear any previous 
  // transition. We don't what positive changes to use a transition since 
  // the change does't render while the absorb key is pressed down.
  $.power.removeAttribute('style');
  
  if (amount < 0) {
    // If the change was negative, then we apply a CSS transition since the
    // change for a hit is quite larger. This stops the power bar from making
    // quite jarring jumps in value. The transition makes this change smoother.
    $.power.style.transition = 'width 0.5s';
  }
  
  // Adjust the size of the power bar on screen to represent the new power value.
  $.power.style.width = this.power + 'px';
};

/**
 * Invoked when Ego picks up a Rock. It is removed from the screen and added
 * to Ego's rock count.
 * 
 * @param {Rock} rock The rock that is being picked up.
 */
$.Ego.prototype.getRock = function(rock) {
  rock.stop();
  $.Game.setStatus($.rocks, ++this.rocks);
  $.Sound.play('rock');
};

/**
 * Invoked when Ego drops a Rock. The rock count is decremented and a Rock is 
 * added to the current Room in the position where Ego currently is, but only
 * if in doing so it would not be touching anything else in the room. Ego will
 * jump into the air prior to the Rock being added, so Ego doesn't count with
 * regards to the touch test.
 */
$.Ego.prototype.dropRock = function() {
  var rock = new $.Rock(this.cx - 40, this.y, this.z);
  
  if ($.Game.touching(rock)) {
    // If the Rock is touching something else in the current room, then 
    // the Rock is not dropped.
    return false;
  } else {
    // If the Rock is not touching anything, then add it to the screen and
    // decrement the rock count.
    $.Game.add(rock);
    $.Game.setStatus($.rocks, --this.rocks);
    $.Sound.play('rock');
    return true;
  }
};

/**
 * Updates Ego for the current frame. The update method of every Sprite is 
 * invoked once per frame. For Ego, it checks the direction keys to see if
 * Ego's direction and movement needs to change. It also handles jumping,
 * flying, dropping Rocks, firing glow Bombs, and absorbing energy from the
 * Orb. It is where most of the player's control of the game takes place.
 */
$.Ego.prototype.update = function() {
  // Mask out left/right/in/out but retain the current jumping directions.
  var direction = (this.direction & $.Sprite.UP_DOWN);

  if ($.keys['jump']) {
    if (!$.oldkeys['jump']) {
      // This is the initial press of the jump key.
      direction = $.Sprite.UP;

      // Is Ego above the ground?
      if (this.y > 0) {
        if (this.bounce) {
          // The bounce flag is true if Ego is standing on something that is not the
          // ground, such as a Rock or the power Orb. If this is the case, then it is
          // handled as a normal jump, except that we adjust the maxY, i.e. top of
          // the jump, to cater for the height above ground that Ego is standing.
          $.Sound.play('jump');
          this.maxY = 200 + this.y;
        } else {
          // Pressing jump in mid air will make Ego hover/fly (i.e. we set both
          // UP and DOWN as on).
          direction |= $.Sprite.DOWN;
        }
      } else {
        // Else if y is 0, then Ego is on the ground and so the jump is a normal
        // ground jump.
        $.Sound.play('jump');
      }
    }
  } else if ((this.y > 0) && (direction == $.Sprite.UP_DOWN)) {
    // If Ego was hovering/flying and the jump key no longer pressed then he
    // starts to fall.
    direction = $.Sprite.DOWN;
  }
  
  // Check if the direction keys are pressed and adjust Ego's direction accordingly.
  if (($.keys['w'] || $.keys['nw'] || $.keys['sw']) && !(this.direction & $.Sprite.RIGHT)) {
    direction |= $.Sprite.LEFT;
  }
  else if (($.keys['e'] || $.keys['ne'] || $.keys['se']) && !(this.direction & $.Sprite.LEFT)) {
    direction |= $.Sprite.RIGHT;
  }
  if (($.keys['n'] || $.keys['ne'] || $.keys['nw']) && !(this.direction & $.Sprite.OUT)) {
    direction |= $.Sprite.IN;
  }
  else if (($.keys['s'] || $.keys['se'] || $.keys['sw']) && !(this.direction & $.Sprite.IN)) {
    direction |= $.Sprite.OUT;
  }
  
  // If the rock key is pushed, and Ego is not standing on an object, and Ego has rocks,
  // then attempt to drop a Rock in Ego's current position.
  if (!$.oldkeys['rock'] && $.keys['rock'] && this.rocks && !this.bounce) {
    if (this.dropRock()) {
      // The Rock was successfully dropped, so adjust Ego's position to be above the Rock
      // and in a jumping state. This makes it look like Ego jumped up and dropped at the
      // same time.
      this.setPosition(this.x, this.y + 100, this.z);
      this.maxY = this.y + 40;
      direction |= $.Sprite.UP;
      
      // This is to remember that we processed the rock key as a drop, so that the 
      // logic in the hit method for getting a rock doesn't also fire for this frame.
      $.oldkeys['rock'] = true;
    }
  }
  
  // Update Ego's direction to what was calculated above. The move method will use this 
  // when moving Ego. The direction is converted into a heading within setDirection.
  this.setDirection(direction);

  // If the fire key is pressed, and Ego has power, then fire a glow Bomb.
  if (!$.oldkeys['fire'] && $.keys['fire'] && (this.power > 0)) {
    // Ego's most recent direction is used for determining the Bomb's heading.
    $.Game.add(new $.Bomb(this.cx, this.cy, this.z-1, this.colour, $.Ego, $.Enemy, $.Util.dirToHeading(this.getLastDirection())));
    $.Sound.play('bomb');
    
    // Firing glow Bombs reduces Ego's power.
    this.powerUp(-1);
  }
  
  // Move Ego based on it's direction and heading.
  this.move();
  
  // If Ego is touching the Orb, check for power absorb key.
  if ($.keys['absorb'] && this.touching($.orb)) {
    this.powerUp(3);
  }
  
  // Adjust yStep back to the max on each frame will quickly drop Ego once an obstacle is cleared.
  this.yStep = this.maxYStep;
  
  // The hit method sets the bounce flag, and it is cleared here.
  this.bounce = false;
};

/**
 * Invoked when Ego has hit another Sprite.
 * 
 * @param {Bomb|Rock|Enemy|Orb} obj The Sprite that Ego has hit.
 */
$.Ego.prototype.hit = function(obj) {
  // This flag is set so that the update method knows in an efficient way that 
  // Ego is currently touching something. 
  this.bounce = true;
  
  if ((obj instanceof $.Bomb) && (obj.target == $.Ego)) {
    // An Enemy Bomb has hit Ego. Reduce the power/health and play the hit sound.
    this.powerUp(-50);
    $.Sound.play('hit');
    
  } else if (!(obj instanceof $.Bomb)) {
    // For all other types of Sprite, reset the position to the last one that isn't
    // touching another Sprite. Resetting the position prevents Ego from walking 
    // through obstacles. 
    for (;this.reset() && this.touching(obj););
    
    // If Ego is jumping up and it hits something, then it will immediately start moving down.
    if ((this.direction & $.Sprite.UP) && !(this.direction & $.Sprite.DOWN)) {
      this.direction &= ~($.Sprite.UP);
      this.direction |= $.Sprite.DOWN;
    }
  
    // Putting this check in the hit function is more efficient than invoking touching for every 
    // rock in the room. If it is a Rock that we have hit, then we check if the push or rock 
    // buttons are pressed.
    if (obj instanceof $.Rock) {
      // If the push button is pressed whilst hitting a Rock, then the Rock's position is moved
      // in the same direction as Ego.
      if ($.keys['push']) {
        obj.push(this.direction);
      }
      // If the rock button is pressed whilst hitting a Rock, then Ego picks up the Rock.
      if (!$.oldkeys['rock'] && $.keys['rock']) {
        this.getRock(obj);
      }
    }
    
    // If Ego is above the ground, then we set the egoOn property of the object Ego hit to 
    // inform the other object that Ego is "on" it. This triggers the surface shadow appearing
    // on the surface of the other Sprite.
    if (this.y > 0) {
      obj.egoOn = 2;
    }
  }
};

/**
 * Invoked by the move method when Ego has hit an edge. If the edge is the ground, then the
 * edge parameter is undefined. If the edge is one of the four directions, then Ego is 
 * attempting to exit the current room. 
 *  
 * @param {Array} edge If defined, it will be an array that represents the edge that was hit.
 */
$.Ego.prototype.hitEdge = function(edge) {
  if (edge) {
    // Ego is attempting to exit the room. Check if this is okay and enter the new room 
    // if it is okay.
    $.Game.hitEdge(this, edge);
  }
};
