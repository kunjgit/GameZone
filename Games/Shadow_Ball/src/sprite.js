/**
 * Creates a new Sprite. This is the base class for all Sprites. All Sprites are spheres.
 *
 * @constructor
 * @param {number} size The size of the Sprite in pixels. Used for size in all three dimensions.
 * @param {string} colour The base colour of the Sprite. Used when rendering the background image sprite sheet.
 * @param {number} texture The amount of random variation in the surface colour of the Sprite.
 * @param {number} xzstep The step size for the x and z directions. This is the max number of pixels to move every frame.
 * @param {number} ystep The step size for the y direction. This is the max number of pixels to move every frame.
 * @param {number} g The gravity acceleration. This can be different for different sprites. Currently used by Enemy only.
 */
$.Sprite = function(size, colour, texture, xzstep, ystep, g) {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.cx = 0;
  this.cy = 0;
  this.cz = 0;
  this.top = 0;
  this.moved = false;
  this.positions = [];
  this.size = size;
  this.radius = size / 2;
  this.colour = colour;
  this.texture = texture;
  this.room = $.Game.room.slice(0);
  this.shadowOffset = (this.size / 10);
  this.shadow = $.Util.renderShadow(this.size);
  this.sprite = document.createElement('span');
  this.sprite.classList.add('sprite');
  this.surfaceShadow = document.createElement('span');
  this.sprite.appendChild(this.surfaceShadow);
  
  var style = this.sprite.style;
  style.width = style.height = (this.size + 'px');
  
  this.canvas = this.buildCanvas();
  
  if (this.canvas) {
    style.backgroundImage = 'url(' + this.canvas.toDataURL("image/png") + ')';
  } else {
    style.backgroundColor = colour;
    this.shadow.style.opacity = 0.5;
  }
  
  this.maxStep = xzstep;
  this.yStep = this.maxYStep = ystep || 10;
  this.step = this.stepInc = (this.maxStep / 10);
  this.g = g;
  this.direction = 0;
  this.directionLast = 1;
  this.maxY = 200;
  this.backgroundX = 0;
  this.backgroundY = 0;
  this.facing = 1;
};

/**
 * Builds the background image canvas for this Sprite. This is the default implementation,
 * which renders a sphere using the colour and texture of the Sprite.
 */
$.Sprite.prototype.buildCanvas = function() {
  return $.Util.renderSphere(this.size, -1, this.colour, this.texture);
};

/**
 * Adds this Sprite into the current room.
 */
$.Sprite.prototype.add = function() {
  $.screen.appendChild(this.sprite);
  $.shadow.appendChild(this.shadow);
};

/**
 * Removes this Sprite from the current room.
 */
$.Sprite.prototype.remove = function() {
  $.screen.removeChild(this.sprite);
  $.shadow.removeChild(this.shadow);
};

/**
 * Tests whether the given Sprite is touching this Sprite. There is an optional gap 
 * parameter, which provides more of a "close too" check rather than actually touching.
 *
 * @param {Sprite} obj Another Sprite with which to test whether this Sprite is touching it.
 * @param {number} gap If provided, then if the two Sprites are within this distance, the method returns true.
 * @returns {boolean} true if this Sprite is touching the given Sprite; otherwise false.
 */
$.Sprite.prototype.touching = function(obj, gap) {
  if (obj) {
    var dx = this.cx - obj.cx;
    var dy = (this.cy - obj.cy);
    var dz = Math.abs(this.z - obj.z) + 15;
    var dist = (dx * dx) + (dy * dy) + (dz * dz);
    var rsum = (this.radius + obj.radius + (gap | 0));
    return (dist <= (rsum * rsum));
  } else {
    return false;
  }
};

/**
 * Calculates the distance between this Sprite and the given Sprite.
 *
 * @param {Sprite} obj The Sprite to calculate the distance to.
 */
$.Sprite.prototype.distance = function(obj) {
  var dx = this.cx - obj.cx;
  var dz = this.cz - obj.cz;
  return Math.sqrt((dx * dx) + (dz * dz));
};

/**
 * Resets this Sprite's position to its previous position.
 */
$.Sprite.prototype.reset = function() {
  var pos = this.positions.pop();
  
  if (pos) {
    this.setPosition(pos.x, pos.y, pos.z);
    this.positions.pop();
  }

  // We need to switch to small steps when we reset position so we can get as close
  // as possible to other Sprites.
  this.step  = this.yStep = 1;
  
  return pos;
};

/**
 * Returns the Sprite's previous position.
 *
 * @returns {number} The Sprites previous position.
 */
$.Sprite.prototype.lastPosition = function() {
  return this.positions[this.positions.length-1];
};

/**
 * Sets the Sprite's position to the given x, y, and z position.
 * 
 * @param {number} x The x part of the new position.
 * @param {number} y The y part of the new position.
 * @param {number} z The z part of the new position.
 */
$.Sprite.prototype.setPosition = function(x, y, z) {
  // If we have a previous position then z will have a non-zero value. We don't
  // want to push the initially undefined position.
  if (this.z) {
    // Remember the last 5 positions.
    this.positions.push({x: this.x, y: this.y, z: this.z});
    if (this.positions.length > 5) {
      this.positions = this.positions.slice(-5);
    }
  }

  // Set the new position and calculate the centre point of the Sprite sphere.
  this.x = x;
  this.y = y;
  this.z = z;
  this.cx = x + this.radius;
  this.cy = y + this.radius;
  this.cz = z - this.radius;

  // Update the style of the sprite and shadow elements to reflect the new position.
  var top = this.top = Math.floor(this.z / 2) - this.size - Math.floor(this.y);
  this.shadow.style.top = ((this.z / 2) - this.shadowOffset - 235) + 'px';
  this.shadow.style.left = (this.x) + 'px';
  this.shadow.style.opacity = 0.9 - (y * (1.0/400));
  this.sprite.style.top = top + 'px';
  this.sprite.style.left = (this.x) + 'px';
  this.sprite.style.zIndex = Math.floor(this.z);
};

// These are constants use to represent the different directions. They can be ORed 
// together and therefore have bit values that allow for this. For example, a Sprite
// might be moving left, in, and up.
$.Sprite.LEFT  = 0x01;
$.Sprite.RIGHT = 0x02;
$.Sprite.IN    = 0x04;
$.Sprite.OUT   = 0x08;
$.Sprite.UP    = 0x10;
$.Sprite.DOWN  = 0x20;

// A special direction where the Sprite is hovering, i.e. flying.
$.Sprite.UP_DOWN = ($.Sprite.UP | $.Sprite.DOWN);

/**
 * Sets the direction of this Sprite to the new direction provided. The direction is
 * a bit mask, and so might be a composite direction. From the direction, the heading
 * is calculated.
 * 
 * @param {number} direction A bit mask that identifies the new direction of the Sprite.
 */
$.Sprite.prototype.setDirection = function(direction) {
  if (direction != this.direction) {
    this.directionLast = this.direction;
    this.direction = direction;

    // Convert the direction to a facing direction by shifting right until we find
    // a 1. There are only four facing directions.
    for (var facing = 0; facing <= 4 && !((direction >> facing++) & 1););

    // If the canvas width is greater than the Sprite size, it means that the sprite
    // sheet has multiple appearances or costumes, each which relates to a facing direction.
    if (this.canvas && (this.canvas.width > this.size)) {
      // Adjust the background position to show the correct part of the sprite sheet for the direction.
      if ((facing <= 4) && (facing != this.facing)) {
        this.backgroundX = (-((facing - 1) * this.size));
        this.sprite.style.backgroundPosition = this.backgroundX + 'px ' + this.backgroundY + 'px';
        this.facing = facing;
      }
    }
    
    // Convert the direction into a heading, but only if LEFT, RIGHT, IN, or OUT are set.
    if (direction & 0x0F) {
      this.heading = $.Util.dirToHeading(direction);
    } else {
      this.heading = null;
    }
  }
};

/**
 * Gets the last direction, excluding UP and DOWN. This can come from different sources. If the 
 * direction is currently set, then it comes from there. If not then it will come from 
 * directionLast, which usually stores the last direction. But if this is also clear, then 
 * the direction is calculated from the facing direction.
 *
 * @returns {number} The Sprite's last direction.
 */
$.Sprite.prototype.getLastDirection = function() {
  var dir = (this.direction & 0x0F);
  if (!dir) dir = (this.directionLast & 0x0F);
  if (!dir) dir = (1 << (this.facing - 1));
  return dir;
};

/**
 * Moves this Sprite based on its current heading, direction, step size and time delta settings. The
 * bounds are checked, and if in moving the Sprite and edge is hit, then the hitEdge method is invoked
 * so that sub-classes can decide what to do.
 */
$.Sprite.prototype.move = function() {
  this.moved = false;
  
  if (this.direction || this.heading != null) {
    var x = this.x;
    var z = this.z;
    var y = this.y;
    var edge = 0;
    
    // Move the position based on the current heading, step size and time delta.
    if (this.heading != null) {
      x += Math.cos(this.heading) * Math.round(this.step * $.Game.stepFactor);
      z += Math.sin(this.heading) * Math.round(this.step * $.Game.stepFactor);
      
      // Check whether a room edge has been hit.
      if (x < -(this.size)) edge = [-1, 0];
      if (x > 700) edge = [1, 0];
      if (z < 500) edge = [0, -1];
      if (z > 1040) edge = [0, 1];
      
      // Increment the step size the step increment, capping at the max step.
      if ((this.step += this.stepInc) > this.maxStep) this.step = this.maxStep;
    }

    if (edge) {
      // No need to adjust position at all in this case. Ego will enter new room. Rock 
      // and Bomb will disappear. Enemy will stay where it is.
      this.hitEdge(edge);
    } else {
      // If x or z has changed, update the position already. This allows for better 
      // movement over the surface of the Orb or Rocks.
      if ((x != this.x) || (z != this.z)) {
        this.setPosition(x, y, z);
        this.moved = true;
      }
      
      if (this.direction & $.Sprite.DOWN) {
        // If the Sprite is moving down, decrease the y position.
        y -= Math.round(this.yStep * $.Game.stepFactor);
        
        // If g is set, the increase the ystep by g so the Sprite falls quicker.
        if (this.g) this.yStep += this.g;
        
        // Has the Sprite reached the ground?
        if (y < 0) {
          this.direction &= 0x0F;
          this.maxY = 200;
          y = 0;
          this.yStep = this.maxYStep;
          this.hitEdge();
        }
      }
      
      if (this.direction & $.Sprite.UP) {
        // If the Sprite is moving up, increase the y position.
        y += Math.round(this.yStep * $.Game.stepFactor);
        
        // If g is set, then reduce the ystep so the Sprite slows it's upward speed. 
        if (this.g) this.yStep -= this.g;
        
        // If the y position reaches the max, or the ystep value has been reduced below
        // zero, then the Sprite should start to fall. So clear the upward direction and
        // add the downward direction.
        if ((y >= this.maxY) || (this.yStep <= 0)) {
          this.direction = (this.direction & 0x0F) | $.Sprite.DOWN;
          y = Math.min(y, this.maxY);
        }
      }

      // If the calculated y value has changed from the current Sprite's y position, then 
      // update the Sprite position now.
      if (y != this.y) {
        this.setPosition(this.x, y, this.z);
      }
    }
  } else {
    // If stationary then set step size back to 1, which allows closer movement
    // to the props.
    this.step = 1;
  }
};

/**
 * Updates this Sprite for the current animation frame. The default behaviour is to trigger
 * the Sprite's movement for this frame, and then if Ego is on this sprite, to render the 
 * surface shadow. Examples of this shadow are when Ego is sitting on the Orb or a Rock.
 */
$.Sprite.prototype.update = function() {
  if (!this.moved) {
    this.move();
  }
  
  // Move the surface shadow.
  if (this.egoOn) {
    if (($.ego.z + $.ego.radius) >= this.z) {
      if (this.egoOn == 2) {
        this.surfaceShadow.style.left = ($.ego.cx - this.x) + 'px';
        this.surfaceShadow.style.top = (($.ego.top - this.top) + $.ego.size - 5) + 'px';
        this.surfaceShadow.style.display = 'block';
        this.egoOn--;
      } else if (!this.touching($.ego, 10)) {
        this.surfaceShadow.style.display = 'none';
        this.egoOn--;
      }
    } else {
      this.surfaceShadow.style.display = 'none';
    }
  }
};

/**
 * Removes the Sprite from the game. This not only removes it from the current room, but also
 * completely from the game. There shouldn't be any references left to the Sprite anywhere.
 */
$.Sprite.prototype.stop = function() {
  // Removes it from the screen.
  this.remove();

  // Removes it from the World map, which effectively means the game.
  $.Game.remove(this);
};

/**
 * Invokes when this Sprite hits another Sprite. The default behaviour is to simply reset the
 * position. Can be overridden by sub-classes.
 */
$.Sprite.prototype.hit = function(obj) {
  if (this.moved) {
    this.reset();
  }
};

/**
 * Invoked when this Sprite hits and edge. The default behaviour is to kill off the Sprite. Can
 * be overridden by sub classes.
 *
 * @param {Array} edge If defined then this is an Array identifying the edge. Will be null if the edge is the ground.
 */
$.Sprite.prototype.hitEdge = function(edge) {
  // If the edge is not the ground, then kill off the Sprite.
  if (edge) this.stop();
};