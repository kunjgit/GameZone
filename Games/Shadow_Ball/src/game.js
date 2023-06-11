/**
 * The is the core Game object that manages the starting of the game loop and the
 * core functions of the game that don't relate directly to an individual Sprite.
 */
$.Game = {
  
  /**
   * The display names for each of the zones. The calcZone method calculates a number
   * that represents the zone, and that number acts as an index in to this array. 
   */
  zoneNames: ['Earth', 'Air', 'Water', 'Fire', 'Cleared', 'Neutral'],
  
  /**
   * The time of the last animation frame. 
   */ 
  lastTime: 0,
  
  /**
   * The time difference between the last animation frame and the current animaton frame.
   */  
  delta: 0,
  
  /**
   * Says whether the game currently has focus or not. Is updated by focus/blur listeners.
   */
  hasFocus: true,
  
  /**
   * Says whether the game is currently paused or not.
   */
  paused: true,
  
  /**
   * Says whether the game loop is currently counting down or not.
   */
  counting: false,
  
  /**
   * The countdown time for when the game unpauses.
   */
  countdown: 0,
  
  /**
   * Starts the game. 
   */
  start: function() {
    // Get a reference to each of the elements in the DOM that we'll need to update.
    $.screen = document.getElementById('screen');
    $.shadow = document.getElementById('shadow');
    $.grass = document.getElementById('grass');
    $.sky = document.getElementById('sky');
    $.mist = document.getElementById('mist');
    $.power = document.getElementById('power');
    $.msg1 = document.getElementById('msg1');
    $.msg2 = document.getElementById('msg2');
    $.rocks = document.getElementById('rocks');
    $.enemies = document.getElementById('enemies');
    $.level = document.getElementById('level');
    $.zone = document.getElementById('zone');
    $.score = document.getElementById('score');
    $.hiscore = document.getElementById('hi');
    $.story = document.getElementById('story');
    $.loading = document.getElementById('loading');

    // Build the mappings between the key codes and the action names.
    $.keyMap[33] = $.keyMap[105] = 'ne';
    $.keyMap[34] = $.keyMap[99] = 'se';
    $.keyMap[35] = $.keyMap[97] = 'sw';
    $.keyMap[36] = $.keyMap[103] = 'nw';
    $.keyMap[37] = $.keyMap[100] = $.keyMap[65] = 'w';
    $.keyMap[38] = $.keyMap[104] = $.keyMap[87] = 'n';
    $.keyMap[39] = $.keyMap[102] = $.keyMap[68] = 'e';
    $.keyMap[40] = $.keyMap[98] = $.keyMap[83] = 's';
    $.keyMap[32] = 'jump';
    $.keyMap[66] = 'push';
    $.keyMap[86] = 'rock';
    $.keyMap[77] = 'fire';
    $.keyMap[78] = 'absorb';
    $.keyMap[80] = 'pause';
    
    // Register the event listeners for handling auto pause when the game loses focus.
    window.addEventListener('blur', function(e) {
      $.Game.hasFocus = false;
    });
    
    window.addEventListener('focus', function(e) {
      $.Game.hasFocus = true;
    });

    // Render the favicon and grass.
    this.renderFavicon();
    this.grass1 = this.renderGrass();
    this.grass2 = this.renderGrass();
    this.grassCtx = $.grass.getContext('2d');
    this.grassCtx.drawImage(this.grass2, 0, 0);
    
    // Render sky immediately after the grass is drawn so they appear at the same time.
    $.sky.classList.add('sky');
    
    // Add some mist for the story screen. Will get cleared by the renderMist method when the game starts.
    $.mist.style.boxShadow = 'rgb(209, 238, 238) 0px 0px 60px 30px, rgb(209, 238, 238) 0px 39px 35px -16px inset';
    
    // Fade in the story for the player to read.
    this.fadeIn($.story);
    
    // The sound generation might be a bit time consuming on slower machines.
    $.Sound.init();
    $.loading.innerHTML = 'Press SPACE to continue...';
    $.Game.enableKeys();
    
    var storyWait = setInterval(function() {
      // Check to see if the player has pressed space.
      if ($.keys['jump']) {
        clearInterval(storyWait);
        $.Game.disableKeys();
        $.Game.fadeOut($.story);
        
        setTimeout(function() {
          // Show the title screen.
          $.Game.showText(1, 'Shadow Ball');
          
          // Initialise and then start the game loop.
          $.Game.init();
          $.Sound.play('music');
          $.Game.loop();
          
          // Re-enable keyboard input after a short delay.
          setTimeout(function() {
            $.Game.showText(2, 'Press SPACE to start');
            $.Game.enableKeys();
          }, 1000);
        }, 500);
      } 
    }, 20);
  },
  
  /**
   * Enables keyboard input. 
   */
  enableKeys: function(delay) {
    document.addEventListener('keydown', this.keydown, false);
    document.addEventListener('keyup', this.keyup, false);
  },
  
  /**
   * Disables keyboard input. 
   */
  disableKeys: function() {
    $.oldkeys = $.keys = {};
    document.removeEventListener('keydown', this.keydown, false);
    document.removeEventListener('keyup', this.keyup, false);
  },
  
  /**
   * Invoked when a key is pressed down.
   *  
   * @param {Object} e The key down event containing the key code.
   */
  keydown: function(e) {
    $.keys[$.keyMap[e.keyCode] || 'other'] = true;
  },
  
  /**
   * Invoked when a key is released.
   *  
   * @param {Object} e The key up event containing the key code.
   */
  keyup: function(e) {
    $.keys[$.keyMap[e.keyCode] || 'other'] = false;
  },
  
  /**
   * Initialised the parts of the game that need initialising on both
   * the initial start and then subsequent restarts. 
   */
  init: function() {
    // For restarts, we'll need to remove the objects from the screen.
    if (this.objs) {
      for (var i=0; i<this.objs.length; i++) {
        this.objs[i].remove();
      }
    }
    
    // Reset the status line state to the beginning state.
    this.setStatus($.rocks, (this.rocks = 0));
    this.setStatus($.score, (this.score = 0));
    this.setStatus($.level, (this.level = 0));
    this.setStatus($.enemies, (this.enemies = 0));
    this.setStatus($.hiscore, (this.hiscore = (localStorage.getItem('hiscore') || 0)));
    
    // Set the room back to the start, and clear the object map.
    this.objs = [];
    this.room = [0, 0];
    this.map = {0: {0: []}};
    
    // Create Ego (the main character) and add it to the screen.
    $.ego = new $.Ego();
    $.ego.add();
    $.ego.setPosition(550, 0, 800);
    $.ego.powerUp(300);
    
    // Add the power Orb and a Rock to make it visually interesting.
    $.orb = new $.Orb(263, 700);
    this.add($.orb);
    this.add(new $.Rock(100, 0, 800));
    
    // Enter the starting room.
    this.newRoom();
    
    // Tells the game loop that the game is now running. During the game over state,
    // this flag is false.
    this.running = true;
  },
  
  /**
   * Adds the given amount to the player's score.
   * 
   * @param {number} amt The amount to add to the score.
   */
  addToScore: function(amt) {
    // Increment the score by the amount and update the status line.
    this.score += amt;
    this.setStatus($.score, this.score);
    
    // If the score is higher than the hi score, then update the hi score as well.
    if (this.score > this.hiscore) {
      this.hiscore = this.score;
      this.setStatus($.hiscore, this.hiscore);
    }
  },
  
  /**
   * Invoked when the player dies.  
   */
  gameover: function() {
    // Remove the keyboard input temporarily, just in case the player was rapid
    // firing when they died. We don't want them to immediately trigger a game
    // restart if they didn't want to.
    this.disableKeys();
    
    // This tells the game loop that the game needs to be re-initialised the next 
    // time the player unpauses the game.
    this.running = false;
    
    // Store the hi score in local storage for next time.
    localStorage.setItem('hiscore', this.hiscore);
    
    // Pause the game and tell the player it is all over.
    this.paused = true;
    this.showText(1, 'Game Over');
    
    // Play the explosion sound and trigger the explode transition on Ego.
    $.Sound.play('explosion');
    $.ego.sprite.classList.add('explode');
    
    // Removes Ego from the screen when the explode transition has completed.
    setTimeout(function() {
      $.ego.stop();
    }, 100);
    
    // After 5 seconds, enable keyboard input again and ask the player to press 
    // SPACE to restart.
    setTimeout(function() {
      $.Game.showText(2, 'Press SPACE to restart');
      $.Game.enableKeys();
    }, 3000);
  },
  
  /**
   * This is a wrapper around the main game loop whose primary purpose is to make
   * the this reference point to the Game object within the main game loop. This 
   * is the method invoked by requestAnimationFrame and it quickly delegates to 
   * the main game loop.
   *  
   * @param {number} now Time in milliseconds.
   */
  _loop: function(now) {
    $.Game.loop(now);
  },
  
  /**
   * This is the main game loop, in theory executed on every animation frame.
   * 
   * @param {number} now Time. The delta of this value is used to calculate the movements of Sprites.
   */
  loop: function(now) {
    // Immediately request another invocation on the next
    requestAnimationFrame(this._loop);
    
    // Calculates the time since the last invocation of the game loop.
    this.updateDelta(now);
    
    if (!this.paused) {
      if ($.keys['pause'] || !this.hasFocus) {
        // Pause the game if the player has pressed the pause key, or if the game
        // has lost focus. This includes pausing the music.
        $.Sound.pause('music');
        this.paused = true;
        this.showText(1, 'Paused');
        this.showText(2, 'Press SPACE to start');
      } else {
        // Game has focus and is not paused, so execute normal game loop, which is
        // to update all objects on the screen.
        this.updateObjects();
        
        // If after updating all objects, the room that Ego says it is in is different
        // that what it was previously in, then we trigger entry in to the new room.
        if (($.ego.room[0] != this.room[0]) || ($.ego.room[1] != this.room[1])) {
          this.newRoom();
        }
      }
    } else if (this.hasFocus) {
      // We're paused, and have focus.
      if (this.countdown) {
        // If we're in countdown mode, update the countdown based on elapsed time.
        this.countdown = Math.max(this.countdown - this.delta, 0);
        
        // Calculate count value (i.e. countdown / 1000) then compare with currently displayed count.
        var count = Math.ceil(this.countdown / 1000);
        if (count != $.msg1.innerHTML) {
          if (count > 0) {
            // If count is above zero, we simply display it.
            $.Sound.play('count');
            this.showText(1, count, true);
          } else {
            // Otherwise countdown has completed, so we un-pause the game.
            $.Sound.play('count');
            this.showText(1, 'Go', true);
            
            // Unpause the game after "Go" has faded.
            setTimeout(function() {
              $.Game.paused = false;
              $.Game.counting = false;
            }, 500);
          }
        }
      } else if (!this.counting) {
        // We're paused and have focus, but haven't started countdown yet. Check for space key.
        if (!$.oldkeys['jump'] && $.keys['jump']) {
          // The space key was pressed, so we start the countdown process. This gives the player
          // some time to get ready.
          this.fadeOut($.msg1);
          this.fadeOut($.msg2);
          
          // This says countdown is about to start (in 1 second).
          this.counting = true;
          
          // Start the countdown in 1 second. Gives the previous messages time to fade.
          setTimeout(function() {
            if (!$.Game.running) $.Game.init();
            $.Game.countdown = 3000;
            $.Game.showText(2, 'Get ready', true, 2500);
          }, 1000);
          $.Sound.play('music');
        }
      }
    } else {
      // In paused state and does not have focus.
      this.countdown = 0;
      this.counting = false;
    }
    
    // Keep track of what the previous state of each key was.
    $.oldkeys = {};
    for ( var k in $.keys) {
      $.oldkeys[k] = $.keys[k];
    }
  },
  
  /**
   * Displays the given text in the given message area. There are two message areas, msg1 and msg2. One
   * is much larger than the other.
   * 
   * @param {number} num Either 1 or 2, identifying either msg1 or msg2 as the place where the text should be displayed.
   * @param {string} text The text to display in the given message area.
   * @param {boolean} fade Set to true if the text should fade after being displayed.
   * @param {number} duration If set then the duration after which the text will either fade, or be removed instantly (depending on the value of fade).
   */
  showText: function(num, text, fade, duration) {
    var msgElem = $['msg'+num];
    
    // Updates the text of the identified message area.
    msgElem.innerHTML = text;
    
    // Fades the text in. The text is always faded in.
    this.fadeIn(msgElem);
    
    if (fade) {
      // If fade was true, then the message will be faded out.
      if (duration) {
        // If a duration was provided, then we will fade out after the specified duration.
        setTimeout(function(e) {
          if (msgElem.innerHTML == text) { 
            $.Game.fadeOut(msgElem);
          }
        }, duration);
      } else {
        // Otherwise fade out immediately after the fade in finishes.
        this.fadeOut(msgElem);
      }
    } else if (duration) {
      // If a duration was provided but fade was false, then we will remove the message 
      // immediately after the specified duration.
      setTimeout(function(e) {
        if (msgElem.innerHTML == text) { 
          msgElem.style.display = 'none';
        }
      }, duration);
    }
  },
  
  /**
   * Fades in the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade in.
   */
  fadeIn: function(elem) {
    // Remove any previous transition.
    elem.removeAttribute('style');
    elem.style.display = 'block';
    
    // We need to change the opacity in a setTimeout to give the display change time to take effect first.
    setTimeout(function() {
      // Setting the transition inline so that we can cancel it with the removeAttribute.
      elem.style.transition = 'opacity 0.5s';
      elem.style.opacity = 1.0;
    }, 50);
  },
  
  /**
   * Fades out the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade out.
   */
  fadeOut: function(elem) {
    elem.style.opacity = 0.0;
    
    // We need to change the display after the opacity transition has reached 0.0, which is in 0.5 seconds.
    setTimeout(function() {
      elem.style.display = 'none';
    }, 500);  // 500ms needs to match the opacity transition duration.
  },
  
  /**
   * Updates the value displayed in one of the status line fields. All values are 
   * zero padded.
   * 
   * @param {Object} field The DOM Element identifying the status line field to update.
   * @param {Object} value The value to update the status line field text to be (will be zero padded).
   */
  setStatus: function(field, value) {
    field.innerHTML = ('000000000' + value).substr(-field.innerHTML.length);
  },
  
  /**
   * Updates the delta, which is the difference between the last time and now. Both values
   * are provided by the requestAnimationFrame call to the game loop. The last time is the
   * value from the previous frame, and now is the value for the current frame. The difference
   * between them is the delta, which is the time between the two frames. From this value
   * it can calculate the stepFactor, which is used in the calculation of the Sprites' motion.
   * In this way if a frame is skipped for some reason, the Sprite position will be updated to 
   * compensate.
   * 
   * @param {Object} now The current time provided in the invocation of the game loop.
   */
  updateDelta: function(now) {
    this.delta = now - (this.lastTime? this.lastTime : (now - 16));
    this.stepFactor = this.delta * 0.06;
    this.lastTime = now;
  },
  
  /**
   * Adds a new room to the World map, if required.
   * 
   * @param {Array} room An Array whose two items are the x,y position of the room within the world map of rooms.
   */
  addRoom: function(room) {
    var x=room[0], y=room[1], i;
    
    // Check to see if this room exists in the map and if it doesn't then adds it.
    if (!this.map.hasOwnProperty(x)) {
      this.map[x] = {};
    }
    if (!this.map[x].hasOwnProperty(y)) {
      this.map[x][y] = [];
    }
    
    // If this room is in an enemy zone, then add the enemies.
    var zone = this.calcZone(x, y);
    if (zone < 4) {
      // The number of enemies matches the level.
      for (i=0; i<this.level; i++) {
        this.placeObj(new $.Enemy(zone), room);
      }
    }
    
    // Randomly place a rock in the room in a place that doesn't touch an Enemy.
    this.placeObj(new $.Rock(), room);
  },

  /**
   * Randomly places a Sprite into the given room in such a way that it is not
   * too close to any other object in the room.
   * 
   * @param {Rock|Enemy} obj The Sprite to place in the room.
   * @param {Array} room The room to place the Sprite in to.
   */
  placeObj: function(obj, room) {
    // Updates the room property of the Sprite so it knows what room it is in.
    obj.room = room;
    
    while (true) {
      // Randomly generate a position.
      obj.setPosition((Math.random() * 450) + 100, 0, (Math.random() * 300) + 100 + 500);

      // Check that it isn't too close to another obj in the same room.
      if (!this.touching(obj, Math.max(110 - (this.level * 10), 0))) {
        this.add(obj, room);
        return;
      }
    }
  },
  
  /**
   * Tests if the given Sprite is touching any other Sprite in the same room. If the gap
   * parameter is set, it represents a kind of "personal space" around the Sprite within
   * which this method will return true. If gap is undefined, or z=0, then the Sprites 
   * have to be physically touching to return true.
   * 
   * @param {Sprite} obj The Sprite to test.
   * @param {number} gap Optional gap within which it is considered too close.
   * @returns {boolean} true if the objects are too close; otherwise false.
   */
  touching: function(obj, gap) {
    var objs = this.map[obj.room[0]][obj.room[1]];
    var i, objsLen = objs.length;
    
    for (i=0; i<objsLen; i++) {
      if (obj.touching(objs[i], gap)) {
        return true;
      }
    }
    
    return false;
  },
  
  /**
   * Calculates what level the given world map coordinates are in. These co-ordinates
   * represent a room within the world.
   * 
   * @param {number} x The x position of the room.
   * @param {number} y The y position of the room.
   * @returns {number} The level that the room is in.
   */
  calcLevel: function(x, y) {
    return Math.max(Math.abs(x), Math.abs(y));
  },
  
  /**
   * Calculates what zone the given world map coordinates are in. These co-ordinates
   * represent a room within the world. There are six zones. Four of these are the
   * zones currently patrolled by the invading armies of the elements. The others
   * are the Cleared zoned, which is an area within which Ego has destroyed the 
   * enemies, and the Neutral zone, which is an area not invaded by enemies. The
   * Neutral zone includes the starting room and the rooms between element zones.
   * 
   * @param {number} x The x position of the room.
   * @param {number} y The y position of the room.
   * @returns {number} The number of the zone that the room is in.
   */
  calcZone: function(x, y) {
    var ax = Math.abs(x), ay = Math.abs(y);
    if (Math.max(ax, ay) < this.level) return 4;    // Cleared zone.
    if (ax == ay) return 5;                         // Neutral zone.
    if ((x < 0) && (ax > ay)) return 3;             // Fire zone.
    if ((x > 0) && (ax > ay)) return 2;             // Water zone.
    if ((y < 0) && (ay > ax)) return 1;             // Air zone.
    if ((y > 0) && (ay > ax)) return 0;             // Earth zone.
  },
  
  /**
   * Invoked when Ego is entering a new level. In response to this, the game expands
   * the world map to include another set of rooms around the edge of the previous
   * extend of the world map. 
   */
  newLevel: function() {
    var x, y, level = this.level + 1;
    
    this.level = level;
    
    // Add each of the new rooms that make up this level.
    for (y=-level; y<=level; y++) {
      if ((y == -level) || (y == level)) {
        for (x=-level; x <=level; x++) {
          this.addRoom([x, y]);
        }
      } else {
        this.addRoom([-level, y]);
        this.addRoom([level, y]);
      }
    }
    
    // Update the status line to show the new level and number of enemies.
    $.Game.setStatus($.level, level);
    
    this.enemies = ((level * 8) - 4) * level;
    $.Game.setStatus($.enemies, this.enemies);
    
    // Tell the player that they are entering a new level.
    this.showText(1, 'Level ' + this.level, true, 2500);
  },
  
  /**
   * Invoked when Ego hits a room edge. This means that the player is trying to 
   * leave the current room. This is checked to see if the level in that direction
   * is open. If not then the player has hit the impenetrable mist and suffers 
   * injury. Otherwise Ego's room is changed.
   * 
   * @param {Object} obj The Sprite that is leaving the current room (always Ego)
   * @param {Object} edge The room edge that Ego has hit in order to leave the room.
   */
  hitEdge: function(obj, edge) {
    // Calculate the new room co-ordinates based on the edge.
    var rx=this.room[0]+edge[0], ry=this.room[1]+edge[1];
    
    // Check that the corresponding level is open. Level will only open if enemies have been cleared.
    var level = this.calcLevel(rx, ry);
    
    if ((level <= this.level) || (this.enemies == 0)) {
      // If the level is within current bounds, or all enemies destroyed, then allow the room change and reposition.
      obj.room = [rx, ry];
      if (edge[0]) obj.x -= (edge[0] * (700 + obj.size));
      if (edge[1]) obj.z -= (edge[1] * 540);
      obj.positions = [];
      obj.setPosition(obj.x, obj.y, obj.z);
    } else {
      // Otherwise make the mist flash red, play the injury noise, and reduce the power.
      this.renderMist('rgb(255,200,200)');
      setTimeout(function() { $.Game.renderMist(); }, 100);
      $.Sound.play('hit');
      $.ego.powerUp(-20);
      obj.reset();
    }
  },
  
  /**
   * Adds the given Sprite to the given room.
   * 
   * @param {Object} obj The Sprite to add to the given room.
   * @param {Array} room The room to add the Sprite to.
   */
  add: function(obj, room) {
    obj.room = room = room || this.room;
    this.map[room[0]][room[1]].push(obj);
    if (room === this.room) {
      obj.add();
    }
  },

  /**
   * Removes a Sprite from the game. It is dead.
   * 
   * @param {Sprite} obj The Sprite to remove from the game.
   */
  remove: function(obj) {
    // Remove the Sprite from the list of objects in its room.
    var objs = this.map[obj.room[0]][obj.room[1]];
    var i = objs.indexOf(obj);
    if (i != -1) {
      objs.splice(i, 1);
    }
    
    // If the Sprite is an Enemy, it means that Ego has killed it.
    if (obj instanceof $.Enemy) {
      // Reduce the enemy count on the status line.
      $.Game.setStatus($.enemies, --this.enemies);
      
      // If the enemy count has reached zero, the level is complete, and so
      // the deadly mist disappears in spectacular fashion.
      if (this.enemies == 0) {
        $.Sound.play('cleared');
        this.showText(2, 'Level ' + this.level + ' cleared', true, 2500);
        $.mist.removeAttribute('style');
        $.shadow.removeAttribute('style');
        $.mist.classList.add('cleared');
        $.shadow.classList.add('cleared');
      }
    }
  },
  
  /**
   * The main method invoked on every animation frame when the game is unpaused. It 
   * interates through all of the Sprites and invokes their update method. The update
   * method will invoke the move method if the calculated position has changed. This
   * method then tests if the Sprite is touching another Sprite. If it is, it invokes
   * the hit method on both Sprites. 
   */
  updateObjects: function() {
    var i=-1, j, a1=$.ego, a2;
    var objsLen = this.objs.length;

    // Iterate over all of the Sprites in the current room, invoking update on each on.
    for (;;) {
      if (a1) {
        a1.update();

        // Check if the Sprite is touching another Sprite.
        for (j = i + 1; j < objsLen; j++) {
          a2 = this.objs[j];
          if (a2 && a1.touching(a2)) {
            // If it is touching, then invoke hit on both Sprites. They might take 
            // different actions in response to the hit.
            a1.hit(a2);
            a2.hit(a1);
          }
        }
        
        // Clears the Sprite's moved flag, which is only of use to the hit method.
        a1.moved = false;
      }
      
      if (++i < objsLen) {
        a1 = this.objs[i];
      } else {
        break;
      }
    }
  },
  
  /**
   * Invoked when Ego is entering a room.  
   */
  newRoom: function() {
    var i, rx, ry;
    
    // Remove the previous room's Sprites from the screen.
    for (i=0; i<this.objs.length; i++) {
      this.objs[i].remove();
    }
    
    rx=$.ego.room[0];
    ry=$.ego.room[1];
    
    // Check if this room exists. If it doesn't, then it's a new level.
    if (!this.map.hasOwnProperty(rx) || !this.map[rx].hasOwnProperty(ry)) {
      this.newLevel();
    }
    
    // Change to the new room.
    this.room = [rx, ry];
    
    // Update the zone in the status bar.
    $.zone.innerHTML = this.zoneNames[this.calcZone(rx, ry)];

    // This creates an effect where the grass changes when you enter a new room.
    this.grassCtx.drawImage((((rx + ry) % 2)? this.grass1 : this.grass2), 0, 0);
    
    // Create the deadly level border mist if required.
    this.renderMist();
    
    // Get the Sprites for this room from the world map.
    this.objs = this.map[rx][ry];
    
    // Add the Sprites for this room to the screen.
    for (i=0; i<this.objs.length; i++) {
      this.objs[i].add();
    }
  },
  
  /**
   * Renders the deadly mist around the edges of the room if required. It firstly checks to
   * see if the room is on the edge of the level and there still enemies present in the 
   * level. If this is the case, it works out what borders of the room need to have the mist
   * and it then renders this. If the room doesn't need mist, it will remove the mist if it
   * happened to already be there and then exits.
   * 
   * @param {Object} c The colour of the mist. Useful when it flashes red. Defaults to a silvery colour.
   */
  renderMist: function(c) {
    var offsetX=0, offsetY=0, boxShadow='', radius='', x=this.room[0], y=this.room[1];
    
    c = c || 'rgba(209,238,238,1.0)';
    
    // Clear inline style from the previous room.
    $.mist.removeAttribute('style');
    $.shadow.removeAttribute('style');
    $.mist.classList.remove('cleared');
    $.shadow.classList.remove('cleared');
    
    // The mist is created with a combination of box shadow and border radius. This couldn't be 
    // done in the css due to the complex nature of the decisions above what exactly to render.
    if ((this.enemies > 0) && (this.level == this.calcLevel(x, y))) {
      if (x == y) {
        if (x > 0) {
          radius = 'borderBottomRightRadius';
        } else {
          radius = 'borderTopLeftRadius';
        }
      }
      if (x == -y) {
        if (x > 0) {
          radius = 'borderTopRightRadius';
        } else {
          radius = 'borderBottomLeftRadius';
        }
      }
      if (radius) {
        $.mist.style[radius] = '30%';
        $.shadow.style[radius] = '10%';
      }
      
      if (x == this.level) {
        offsetX = -49;
        boxShadow += ('710px 25px 32px 32px ' + c + ', ');
      }
      if (x == -this.level) {
        offsetX = 49;
        boxShadow += ('-710px 25px 32px 32px ' + c + ', ');
      }
      if (y == this.level) {
        offsetY = -38;
        boxShadow += ('0px 90px 32px 30px ' + c + ', ');
      }
      if (y == -this.level) {
        offsetY = 39;
        boxShadow += ('0px 0px 60px 30px ' + c + ', ');
      }
      
      boxShadow = boxShadow + 'inset ' + offsetX + 'px ' + offsetY + 'px 35px -16px ' + c;
      
      $.mist.style.boxShadow = boxShadow;
      $.shadow.style.boxShadow = boxShadow;
    }
  },

  /**
   * Renders the grass canvas. It does this by randomly setting the luminousity of 
   * each pixel so that it looks like blades of grass from a distance.
   */
  renderGrass: function() {
    // Render the base colour over the whole grass area first.
    var ctx = $.Util.create2dContext(700, 235);
    ctx.fillStyle = 'hsl(112, 37%, 37%)';
    ctx.fillRect(0, 0, 700, 235);
    
    // Now randomaly adjust the luminosity of each pixel.
    var imgData = ctx.getImageData(0, 0, 700, 235);
    for (var i=0; i<imgData.data.length; i+=4) {
      var texture = (Math.random() * 0.2);
      if (texture < 0.1) {
        texture = 1.0 - texture;
        imgData.data[i]=Math.floor(imgData.data[i] * texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] * texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] * texture);
      } else {
        texture = 0.8 + texture;
        imgData.data[i]=Math.floor(imgData.data[i] / texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] / texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] / texture);
      }
    }
    ctx.putImageData(imgData,0,0);
    return ctx.canvas;
  },
  
  /**
   * Renders the favicon. It does this by rendering Ego facing forward and then resizes this
   * to fit within the favicon size and then updates the href of the favicon with the 
   * data url of the generate canvas.
   */
  renderFavicon: function() {
    var favicon = document.getElementById('favicon');
    var ctx = $.Util.create2dContext(16, 16);
    ctx.drawImage($.Util.renderSphere(50, 4, 'rgb(197,179,88)', 1, 'black'), 0, 0, 16, 16);
    favicon.href = ctx.canvas.toDataURL();
  }
};

/**
 * Holds the current state of the keys understood by game.
 */
$.keys = {};

/**
 * Holds the mappings between the physical key codes and the action names used in the game. 
 */
$.keyMap = [];

/**
 * Holds the state of the keys as they were in the previous frame. 
 */
$.oldkeys = {};

// The currently recommended requestAnimationFrame shim
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
 
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// On load, the game will start.
window.onload = function() { 
  $.Game.start();
};