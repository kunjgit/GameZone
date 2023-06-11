(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';
    var theGame = null;
    // globals
    var MUTE_AUDIO = false;
    var images = [];

    var PAUSE = false;
    var AWAY = false;
    var aa = null;
    var heartsindanger = 0;
    var MAXHEARTS = 32;
    var currentHearts = 0;

    // UTIL FUNCTIONS
    var simpleColCheck = function(shapeA, shapeB) {
        if (shapeA.x < shapeB.x + shapeB.width &&
            shapeA.x + shapeA.width > shapeB.x &&
            shapeA.y < shapeB.y + shapeB.height &&
            shapeA.height + shapeA.y > shapeB.y) {
             return true;
        }
        return false;
    };

    var fps = 0, now, lastUpdate = (new Date())*1;
    var fpsFilter = 50;
    var fpsOut = document.getElementById('fps');
    setInterval(function(){
            fpsOut.innerHTML = fps.toFixed(1) + " fps";
    }, 1000);

    var getTimeStamp = function() {
        return Date.now();
    };

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getRandomBoolean = function(){
        return Math.random() < 0.5;
    };

    var colCheck = function(shapeA, shapeB) {
        // get the vectors to check against
        var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    // reset the falling flag, otherwise we drop straight to the bottom
                    shapeA.falling = false;
                    colDir = 't';
                    if ( shapeB.isPassthrough.bottom ) {
                        colDir = null;
                    } else {
                        shapeA.y += oY;
                    }
                } else {
                    // if we are falling, pass through the appropriate floor
                    if ( shapeB.isPassthrough.bottom && shapeA.falling ) {
                        colDir = null;
                    } else {
                        colDir = 'b';
                        shapeA.y -= oY;
                    }
                }
            } else {
                if (vX > 0) {
                    if ( shapeB.isPassthrough.right ) {
                        colDir = null;
                    } else {
                        colDir = 'l';
                        shapeA.x += oX;
                    }
                } else {
                    if ( shapeB.isPassthrough.left ) {
                        colDir = null;
                    } else {
                        colDir = 'r';
                        shapeA.x -= oX;
                    }
                }
            }
        }
        return colDir;
    };

    // UTIL CLASSES

    var DelayCounter = function( delta ) {
        this.timestamp = getTimeStamp();
        this.deltas = delta || [];
        this.currentDelta = 0;
    };

    DelayCounter.prototype = {
        start : function() {
            this.timestamp = getTimeStamp();
        },
        check: function() {
            if ( getTimeStamp() - this.timestamp > this.deltas[this.currentDelta] ) {
                // console.log( this.deltas[this.currentDelta] + this.timestamp );
                this.next();
                //return true;
            }
            //return false;
        },
        next: function() {
            this.start();
            this.currentDelta++;
            if ( this.currentDelta >= this.deltas.length ) {
                this.currentDelta = 0;
            }
            // console.log( 'next' + this.currentDelta + this.deltas[this.currentDelta] + " - " + this.timestamp );
        },
        getStage: function() {
            this.check();

            return this.currentDelta;
        },
        isDone : function() {
            if ( getTimeStamp() - this.timestamp > this.deltas[this.currentDelta] ) {
                return true;
            }
            return false;
        },
        reset : function() {
            this.timestamp = getTimeStamp();
            this.currentDelta = 0;
        }
    };

    var muteButtonDelay = new DelayCounter([200]);
    var pauseButtonDelay = new DelayCounter([200]);
    var longButtonDelay = new DelayCounter([2000]);

    var Sprite = function( w, h, frameDef ) {
      this.width = w;
      this.height = h;
      this.frame = 0;
      this.frames = frameDef;
      this.ts = getTimeStamp();
    };

    Sprite.prototype = {
        render: function(ctx, x, y, doFlip){
            var flip = doFlip || false;
            if ( this.frame >= this.frames.length ) {
                this.frame = 0;
            }
            if ( flip ) {
                ctx.save();
                ctx.translate(ctx.canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage( images[0],
                           this.frames[this.frame].ssx,
                           this.frames[this.frame].ssy,
                           this.width,
                           this.height,
                           // secret sauce: change the destination's X registration point
                           ctx.canvas.width - x - (this.width * 2),
                           y,
                           this.width * 2,
                           this.height * 2);
                ctx.restore();
            }
            else
            {
                ctx.drawImage( images[0],
                           this.frames[this.frame].ssx,
                           this.frames[this.frame].ssy,
                           this.width,
                           this.height,
                           x,
                           y,
                           this.width * 2,
                           this.height * 2);
            }
        },
        update: function(){
            var now = getTimeStamp();
            if ( !!this.frames[this.frame].duration && now - this.ts > this.frames[this.frame].duration ) {
                this.ts = now;
                this.nextFrame();
            }
        },
        setFrame: function(newframe) {
            this.frame = newframe;
        },
        nextFrame: function() {
            this.frame++;
            if ( this.frame >= this.frames.length ) {
                this.frame = 0;
            }
        },
        getFrame: function() {
            return this.frame;
        },
        reset: function() {
            this.frame = 0;
            this.ts = getTimeStamp();
        }

    };

    var Keyboarder = function() {
        var keyState = {};
        window.addEventListener('keydown', function(e) {
            keyState[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e) {
            keyState[e.keyCode] = false;
        });
        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };
        this.anyKeyDown = function(flag){
            var k = Object.keys( keyState );
            for ( var z = 0; z < k.length; z++ ) {
                if ( keyState[k[z]] === true ) {
                    if ( flag ) {
                        if( longButtonDelay.isDone() ) {
                            longButtonDelay.reset();
                            return true;
                        }
                    } else {
                     if( muteButtonDelay.isDone() ) {
                        muteButtonDelay.reset();
                        return true;
                        }
                    }
                }
            }
            return false;
        };
        this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32, Z: 90, X: 88, C: 67, M: 77, P: 80 };
    };



    // SOUNDS
    var ArcadeAudio = function() {
        this.sounds = {};
        this.mute = MUTE_AUDIO;
    };

    ArcadeAudio.prototype = {
        add : function( key, count, settings ) {
            this.sounds[ key ] = [];
            settings.forEach( function( elem, index ) {
                this.sounds[ key ].push( {
                    tick: 0,
                    count: count,
                    pool: []
                } );
                for ( var i = 0; i < count; i++ ) {
                    var audio = new Audio();
                    audio.src = jsfxr( elem );
                    this.sounds[ key ][ index ].pool.push( audio );
                }
            }, this );
        },
        play : function( key ) {
            if ( !this.mute ) {
                var sound = this.sounds[ key ];
                var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
                soundData.pool[ soundData.tick ].play();
                soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
            }
        }
    };

    // GAME CLASSES
    var Box = function( nx, ny, nw, nh, passthrough, icebase ) {
        this.width = nw;
        this.height = nh;
        this.x = nx;
        this.y = ny;
        this.isPassthrough = {
            bottom: passthrough.bottom || false,
            left: passthrough.left || false,
            right: passthrough.right || false
        };
        this.icebase = icebase || false;
        this.isEmpty = true;
    };

    Box.prototype = {
        update : function(){},
        render : function(ctx){
            /*
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'blue';
            if ( this.isPassthrough.bottom ) {
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
            }
            if ( this.isPassthrough.left || this.isPassthrough.right ) {
                ctx.fillStyle = 'yellow';
                ctx.strokeStyle = 'yellow';
            }

            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            */
            // ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    var Heart = function(nx,ny) {
        this.width = 14;
        this.height = 14;
        this.x = nx;
        this.y = ny;
        this.velX = 0;
        this.velY = getRandomInt(1, 2) / 2;
        this.friction = 0.7;
        this.toggle = getRandomBoolean();
        this.counter = 0;
        this.sideways = getRandomInt(20, 60);
        this.stuck = false;
        this.isDead = false;
        this.spriteStuck = new Sprite( 7, 8,
                                [ { ssx: 0, ssy: 0, duration: 400 },
                                  { ssx: 21, ssy: 0, duration: 400 }] );
        this.spriteFluttering = new Sprite( 7, 8,
                    [ { ssx: 0, ssy: 0, duration: 400 },
                      { ssx: 7, ssy: 0, duration: 400 },
                      { ssx: 14, ssy: 0, duration: 400 }]);
        this.stuckCounter = null;
    };

    Heart.prototype = {
        update : function(gameSize, heartStoppers, player){

            if ( !this.stuck && !this.isDead ) {
                if ( this.toggle ) {
                    this.velX += 1;
                    this.counter++;
                } else {
                    this.velX -= 1;
                    this.counter++;
                }

                if (this.counter > this.sideways ) {
                    this.toggle = !this.toggle;
                    this.counter = 0;
                    this.sideways = getRandomInt(40, 60);
                }
                this.velX *= this.friction;
                this.x += this.velX;
                this.y += this.velY;

                for (var i = 0; i < heartStoppers.length; i++) {
                    if ( simpleColCheck(this, heartStoppers[i]) ) {
                        if ( this.x < 5 || this.x > (gameSize.width - 5)) {

                            this.isDead = true;
                            this.stuck = true;

                        } else {
                            if ( !this.stuck && !this.isDead) {
                                heartsindanger++;
                            }
                            this.stuck = true;
                            this.stuckCounter = getTimeStamp();
                        }
                    }
                }
                this.spriteFluttering.update();
            } else {
                    this.spriteStuck.update();
                    if ( this.x < 5 || this.x > (gameSize.width - 5) ) {
                        this.isDead = true;
                        this.stuck = true;
                        // heartsindanger--;
                    }
            }

            if ( !this.isDead && simpleColCheck( this, player)) {
                    this.isDead = true;
                    aa.play('pickup');
                    currentHearts++;

                    if (currentHearts > MAXHEARTS - 1) {
                        endGame('END');
                    }

                    if ( this.stuck) {
                        heartsindanger--;
                    }
            }
        },
        render: function(ctx){
            if ( !this.stuck ) {
                this.spriteFluttering.render(ctx, this.x, this.y, this.velX < 0 );
            }
            else
            {
                this.spriteStuck.render(ctx, this.x, this.y );
                if ( this.stuckCounter !== null ) {
                    var now = getTimeStamp();
                    if ( now - this.stuckCounter > 16000 ) {
                        var text = '0';
                        if ( now - this.stuckCounter > 21000 ) {
                            text = '0';
                            this.isDead = true;
                            heartsindanger--;
                        }
                        if ( now - this.stuckCounter > 20000 ) {
                            text = '1';
                        }
                        else if ( now - this.stuckCounter > 19000 ) {
                            text = '2';
                        }
                        else if ( now - this.stuckCounter > 18000 ) {
                            text = '3';
                        }
                        else if ( now - this.stuckCounter > 17000 ) {
                            text = '4';
                        }
                        else if ( now - this.stuckCounter > 16000 ) {
                            text = '5';
                        }
                        ctx.fillStyle = '#fff';
                        ctx.fillText( text, this.x + 5, this.y - 10 );
                    }
                }
            }
        }
    };

    var HeartSprinkler = function(game, gameSize) {
        this.game = game;
        this.width = 18*2;
        this.height = 26*2;
        this.x = gameSize.width / 2;
        this.y = 77;
        this.speed = 3;
        this.velX = 0;
        this.friction = 0.6;
        this.goingLeft = false;
        this.stopped = false;
        this.counter = 0;
        this.nextStop = 10; // 400;
        this.spriteStopped = new Sprite( 18, 26,
                    [ { ssx: 75, ssy: 73, duration: 200 },
                      { ssx: 93, ssy: 73, duration: 200 } ]);
        this.spriteWalking = new Sprite( 18, 26,
                    [ { ssx: 75, ssy: 73, duration: 200 },
                      { ssx: 111, ssy: 73, duration: 200 } ]);
    };

    HeartSprinkler.prototype = {
        update : function(gameSize){

            if ( !this.stopped ) {
                if ( this.goingLeft ) {
                    if (this.velX > -this.speed) {
                        this.velX--;
                    }
                } else {
                    if (this.velX < this.speed) {
                        this.velX++;
                    }
                }

                this.velX *= this.friction;
                this.x += this.velX;

                if ( this.x > gameSize.width - 100 ) {
                    this.goingLeft = true;
                    this.velX = 0;
                }
                if ( this.x < 100 ) {
                    this.goingLeft = false;
                    this.velX = 0;
                }
            }

            // randomly stop once in a while - 5%
            if ( !this.stopped && this.nextStop < 0 ) {
                var i = getRandomInt(1, 1000);
                if (i > 100 ){ // 995 ) {
                    this.stopped = true;
                    this.counter = getRandomInt(100, 200);
                    this.nextStop = 40; //400
                    this.game.fallingStuff = this.game.fallingStuff.concat( new Heart( this.x, this.y ) );
                    this.spriteStopped.update();
                }
            }

            if ( this.counter > 0 && this.stopped) {
                this.counter--;
                this.spriteStopped.update();
                if ( this.counter <= 0 ) {
                    this.stopped = false;
                    this.spriteWalking.setFrame(0);
                }
            } else {
                this.nextStop--;
                this.spriteWalking.update();
            }
        },
        render : function(ctx){
            if ( this.stopped ) {
                this.spriteStopped.render(ctx, this.x, this.y, !this.goingLeft);
            } else {
                this.spriteWalking.render(ctx, this.x, this.y, !this.goingLeft);
            }

        }
    };

    // MONSTER CLASSES

    var MonsterBlock = function( nx, ny, nw, nh, blocks ) {
        this.width = nw;
        this.height = nh;
        this.x = nx;
        this.y = ny;
        this.blocks = blocks || [];
    };

    MonsterBlock.prototype = {
        doesBlock : function(monsterName) {
            if ( this.blocks.indexOf( monsterName.toLowerCase() ) > -1 ) {
                return true;
            }
            return false;
        }
    };

    // four elemental enemies
    var BadGuy = function(dx,dy, type, btype, speed){
        this.width = 32;
        this.height = 64;
        this.x = dx;
        this.y = dy;
        this.type = type; // 0 = fire, 1 = earth, 2 = ice
        this.lastMove = getTimeStamp();
        this.now = null;
        this.goingLeft = getRandomBoolean();
        this.isDead = false;
        this.lastHit = null;
        this.blocktype = btype;
        this.speed = speed || 2;
        this.targetbase = null;
        this.state = 'w';
        this.spriteA = null;
        this.spriteB = null;
        this.spriteC = null;
        this.myblock = null;
        this.delayCounter = new DelayCounter([800, 800, 200]);
        switch( this.type ) {
            // fire sprite
            case 0 :
                this.spriteA = new Sprite( 12, 15, [ { ssx: 33, ssy: 33, duration: 200 }, { ssx: 45, ssy: 33, duration: 200 } ] );
                this.spriteB = new Sprite( 12, 15, [ { ssx: 57, ssy: 33, duration: 50 }, { ssx: 69, ssy: 33, duration: 50 } ] );
                this.height = 30;
            break;
            // sand monster
            case 1:
                this.spriteA = new Sprite( 18, 3, [ { ssx: 61, ssy: 49, duration: 500 }, { ssx: 79, ssy: 49, duration: 500 } ] );
                this.speed = 1;
                // down = 133
                // up1 = 97
                // up2 = 151
                // down = 133
                this.spriteB = new Sprite( 18, 13, [ { ssx: 133, ssy: 32, duration: 400 } ] );
                for(var i = 0; i < 7; i++ ) {
                    this.spriteB.frames.push( { ssx: 97, ssy: 32, duration: 200 } );
                    this.spriteB.frames.push( { ssx: 151, ssy: 32, duration: 200 } );
                }
                this.spriteB.frames.push( { ssx: 133, ssy: 32, duration: 400 } );
                this.spriteB.frames.push( { ssx: 133, ssy: 32, duration: 100 } );

                // attacking = 115
                this.spriteC = new Sprite( 18, 13, [ { ssx: 115, ssy: 32, duration: 100 } ] );
                this.height = 6;
                this.width = 35;
                this.delayCounter = new DelayCounter([600, 800, 4000, 400]);
                this.delayCounter.currentDelta = getRandomInt(0,3);
                break;
            // snow man
            case 2:
                this.spriteA = new Sprite( 13, 12, [ { ssx: 31, ssy: 53, duration: 200 }, { ssx: 44, ssy: 53, duration: 200 } ] );
                this.spriteB = new Sprite( 13, 12, [ { ssx: 57, ssy: 53, duration: 200 }, { ssx: 70, ssy: 53, duration: 200 } ] );
                this.height = 24;
                this.width = 26;
                break;
            // wind duck
            case 3:
                this.haveAttacked = false;
                this.changeDirection = false;
                this.hopHeight = 0;
                this.hop = [ [0,10], [2,20], [2,20], [2,20], [1,20], [0,20], [0,20], [0,20], [-1,20], [-2,20], [-2,20], [-2,20] ];
                //this.spriteA = new Sprite( 13, 12, [ { ssx: 31, ssy: 53, duration: 200 }, { ssx: 44, ssy: 53, duration: 200 } ] );
                //this.spriteB = new Sprite( 13, 12, [ { ssx: 57, ssy: 53, duration: 200 }, { ssx: 70, ssy: 53, duration: 200 } ] );

                this.spriteA = new Sprite( 16, 32, [ { ssx: 42, ssy: 0 },
                                                     { ssx: 58, ssy: 0 },
                                                     { ssx: 74, ssy: 0 },
                                                     { ssx: 90, ssy: 0 } ]);
                break;
        }

    };

    BadGuy.prototype = {
        update: function( monsterblockers, player, things, iceblockbases ) {

            for (var i = 0; i < monsterblockers.length; i++ ) {
                if ( simpleColCheck(this, monsterblockers[i] ) && monsterblockers[i].doesBlock(this.blocktype) && this.lastHit !== monsterblockers[i]) { // put this bit back in - reset it in states below) {
                    this.goingLeft = !this.goingLeft;
                    this.lastHit = monsterblockers[i];
                    if ( this.type === 2 ) {
                        // console.log('collision ' + this.state + ' - ' + this.goingLeft);
                        switch( this.state ) {
                            case 'hb':
                                // get an ice block
                                this.state = 'pb';
                                this.speed = 1;
                                this.myblock = spawnAThing( (this.goingLeft ? this.x - 25: this.x + this.width + 1), this.y - 4, 4, this.goingLeft, false, false, false );
                                break;
                            case 'pb':
                            case 'dj':
                                if ( this.myblock !== null && !this.myblock.isDead) {
                                    this.myblock.isDead = true;
                                    this.myblock = null;
                                }
                                this.state = 'w';
                                this.speed = 1;
                                break;
                            case 't':

                                if( this.goingLeft )
                                {
                                    this.x = -60;
                                } else {
                                    this.x = 1030;
                                }
                                //this.goingLeft = !this.goingLeft;
                                this.state = 'w';
                                this.speed = 1;
                                break;
                        }
                    }
                    break;
                }
            }
            switch( this.type ) {
                case 0:
                    this.updateFireGuy(monsterblockers, player, things);
                    break;
                case 1:
                    this.updateEarthGuy(monsterblockers, player, things);
                    break;
                case 2:
                    this.updateIceGuy(monsterblockers, player, things, iceblockbases);
                    break;
                case 3:
                    this.updateDuck(monsterblockers, player, things);
                    break;
            }
        },
        updateDuck: function( monsterblockers, player, things ) {
            if( this.tcolcheck( ["6"], [ "2", "3", "5", "6", "7" ], things) ) {
                this.state = 'd';
            }

            this.now = getTimeStamp();
            switch( this.state ) {
                case 'd':
                        this.y += 3;
                        if ( this.y > 1000 ) {
                            this.reset();
                        }
                        break;
                // hopping duck
                case 'w':
                    this.spriteA.setFrame(0);
                    if ( !this.isDead ) {
                        if ( this.now - this.lastMove > this.hop[this.hopHeight][1] ) {
                            if ( this.goingLeft ) {
                                this.x -= 2;
                                this.y -= this.hop[this.hopHeight][0];
                            } else {
                                this.x += 2;
                                this.y -= this.hop[this.hopHeight][0];
                            }
                            this.hopHeight++;

                            if ( this.hopHeight >= this.hop.length ) {
                                this.hopHeight = 0;
                                this.hopCounter++;
                                if ( this.changeDirection ) {
                                    this.goingLeft = !this.goingLeft;
                                    this.changeDirection = false;
                                }

                                if ( this.checkForPlayer(player, 800) ) {
                                    this.state = 'l';
                                    this.hopCounter = 0;
                                    this.lastMove = this.now;
                                }
                            }
                            this.lastMove = this.now;

                            // check for collission with monster blockers
                            for (var i = 0; i < monsterblockers.length; i++ ) {
                                if ( simpleColCheck(this, monsterblockers[i] ) && monsterblockers[i].doesBlock('wd') && this.lastHit !== monsterblockers[i]) {
                                    this.lastHit = monsterblockers[i];
                                    this.changeDirection = true;
                                }
                            }
                        }
                        if ( this.hopCounter > 13 ) {
                            this.state = 's';
                            this.lastMove = this.now;
                        }

                    }
                    break;
                // looking around
                case 's':
                    // check if player collides with alarm box
                    if ( this.checkForPlayer(player, 800) ) {
                        this.state = 'l';
                        this.hopCounter = 0;
                        this.lastMove = this.now;
                    } else if ( this.now - this.lastMove > 1300 ) {
                        // back to hopping
                        this.lastMove = this.now;
                        this.state = 'w';
                        this.hopCounter = 0;
                        this.haveAttacked = false;
                    } else if ( this.now - this.lastMove > 900 ) {
                        // look right again
                        this.spriteA.setFrame(1);
                    } else if ( this.now - this.lastMove > 300 ) {
                        this.spriteA.setFrame(0);
                    }
                    break;
                // alarm
                case 'l':
                    this.spriteA.setFrame(2);
                    if ( this.now - this.lastMove > 500 ) {
                        this.state = 'a';
                        this.lastMove = this.now;
                        this.haveAttacked = false;
                    }
                    break;
                // attack
                case 'a':
                    if ( !this.haveAttacked ) {
                        aa.play('cheep');
                        this.attack();
                        this.haveAttacked = true;
                        this.spriteA.setFrame(3);
                    }

                    if ( this.now - this.lastMove > 1000 ) {
                        this.lastMove = this.now;
                        this.state = 'w';
                        this.hopCounter = 11;
                        this.haveAttacked = false;
                    }
                    break;
            }
        },
        updateFireGuy: function( monsterblockers, player, things ) {
            if( this.tcolcheck( ["7"], [ "2", "3", "5", "6", "7" ], things) ) {
                this.state = 'd';
            }

            switch( this.state ) {
                case 'd':
                        this.y += 3;
                        if ( this.y > 1000 ) {
                            this.reset();
                        }
                        break;
                case 'w':
                    this.walkLeftRight();
                    this.spriteA.update();
                    switch ( this.delayCounter.getStage() ) {
                        case 1:
                        case 2:
                        // check if player in sight
                        if ( this.checkForPlayer(player, 100)) {
                            this.state = 'a';
                            this.delayCounter.reset();
                        }
                        break;
                    }
                    break;
                case 'a':
                    this.spriteB.update();
                    switch ( this.delayCounter.getStage() ) {
                        case 1:
                            // do attack
                            this.attack();
                            this.state = 'w';
                            this.delayCounter.reset();
                        break;
                    }
                    break;
            }
        },
        tcolcheck : function( t, kt, things ) {
            for(var i = 0; i < things.length; i++ ) {
                if( !things[i].isDead && simpleColCheck(this, things[i] ) ) {
                    if ( kt.indexOf( "" + things[i].type ) > -1 ) {
                        things[i].isDead = true;
                    }
                    if( t.indexOf( "" + things[i].type ) > -1 ) {
                        return true;
                    }
                }
            }
            return false;
        },
        updateIceGuy: function( monsterblockers, player, things, icebases ) {
            this.walkLeftRight();
            this.spriteA.update();
            this.spriteB.update();

            if( this.tcolcheck( ["5"], [ "2", "3", "5", "6", "7" ], things) ) {
                this.state = 'd';
            }

            switch( this.state ) {
                case 'd':
                        this.y += 3;
                        if ( this.y > 1000 ) {
                            this.reset();
                        }
                        break;
                // just walking
                case 'w':
                        var dohurry = false;
                        if ( simpleColCheck(this, icebases[12] ) ) {
                            if ( icebases[12].isEmpty ) {
                                dohurry = true;
                            }
                        }
                        for(var j = 0; j < things.length; j++ ) {
                            if ( !things[j].isDead && things[j].type === 4 ) {
                                if ( simpleColCheck(this, things[j] ) ) {
                                    dohurry = true;
                                }
                            }
                        }

                        if (dohurry) {
                            this.state = 'hb';
                            this.speed = 4;
                            this.goingLeft = !this.goingLeft;
                            this.lastHit = null;
                            this.targetbase = 12;
                            icebases[12].isEmpty = false;
                            if ( this.x < 150 || this.x > 840 ) {
                                this.state = 't';
                            }
                        }

                        break;
                // pushing block of ice
                case 'pb':

                    var donejob = false;

                    if ( this.myblock !== null && !this.myblock.isDead ) {
                        //this.myblock.push( this.goingLeft );
                    }
                    else
                    {
                        donejob = true;
                    }

                    var t = [ "2", "3", "5", "6", "7" ];
                    if ( !donejob ) {
                        for (var j = 0; j < things.length; j++ ) {
                            if ( !things[j].isDead )
                                if( things[j].type === 4 && this.myblock !== things[j] && simpleColCheck(this.myblock, things[j] ) ) {
                                    donejob = true;
                                }

                                if( t.indexOf( "" + things[j].type ) > -1 && simpleColCheck(this.myblock, things[j] ) ) {
                                    things[j].isDead = true;
                                    if ( things[j].type === 5 ) {
                                        this.myblock.isDead = true;
                                        if ( this.myblock.flagged ) {
                                            icebases[12].isEmpty = true;
                                        }
                                    }
                                }
                        }

                        for (var k = 0; k < icebases.length; k++ ) {
                            if ( simpleColCheck(this, icebases[k] ) && k === this.targetbase ) {
                                this.myblock.flagged = true;
                                donejob = true;
                            }
                        }
                    }
                    if ( donejob ) {
                        this.state = 'dj';
                        this.speed = 4;
                        this.targetbase = null;
                        this.goingLeft = !this.goingLeft;
                        this.lastHit = null;
                        this.myblock = null;
                    }

                    break;
            }
        },
        updateEarthGuy: function( monsterblockers, player, things ) {
            this.walkLeftRight();
            switch( this.state ) {
                case 'w':
                    this.spriteA.update();
                    if( this.delayCounter.getStage() > 2 ) {
                        this.state = 'up';
                        this.height = 26;
                        this.y -= 19;
                        this.spriteB.reset();
                    }
                    break;
                case 'up':
                    this.spriteB.update();
                    if ( this.spriteB.getFrame() > 0 && this.spriteB.getFrame() < 16 ) {
                        if ( this.checkForPlayer(player, 80)) {
                            this.state = 'a';
                            this.delayCounter.reset();
                        }
                    }
                    if ( this.spriteB.getFrame() > 15 ) {
                        this.state = 'w';
                        this.y += 19;
                        this.height = 6;
                        this.delayCounter.reset();
                    }
                    break;
                case 'a':
                    if( this.delayCounter.getStage() === 1 ) {
                        spawnAThing( (this.goingLeft ? this.x - 5 : this.x + this.width - 5), this.y + this.height, 3, this.goingLeft, true, true, false );
                        this.state = 'up';
                        this.delayCounter.reset();
                    }
                    break;
            }
        },
        walkLeftRight: function() {
            if ( !this.isDead ) {
                this.now = getTimeStamp();
                if ( this.now - this.lastMove > 10 ) {
                    if ( this.goingLeft ) {
                        this.x -= this.speed;
                    } else {
                        this.x += this.speed;
                    }
                    this.lastMove = this.now;

                    if ( this.type === 2 && this.state === 'pb' && this.myblock !== null && !this.myblock.isDead) {
                        this.myblock.push( this.goingLeft );
                    }
                }
            }
        },
        reset: function(ctx) {
            this.state = 'w';
            this.isDead = false;
            this.myblock = null;
            this.targetbase = null;
            switch( this.type ) {
                case 3:
                    this.x = 200;
                    this.y = 367;
                    this.hopCounter = 0;
                    this.hopHeight = 0;
                    break;
                case 2:
                    this.x = -50;
                    this.y = 705;
                    break;
                case 1:
                    this.y = 575;
                    break;
                case 0:
                    this.y = 251;
                    break;
            }
        },
        render: function(ctx){
            switch( this.type ) {
                case 0:
                    this.drawFireGuy(ctx);
                    break;
                case 1:
                    this.drawEarthGuy(ctx);
                    break;
                case 2:
                    this.drawIceGuy(ctx);
                    break;
                case 3:
                    this.drawDuck(ctx);
                    break;
            }
        },
        drawDuck: function(ctx) {
            this.spriteA.render(ctx, this.x, this.y, !this.goingLeft );
        },
        drawFireGuy: function(ctx) {
            switch( this.state ) {
                case 'd':
                case 'w':
                    this.spriteA.render(ctx, this.x, this.y, !this.goingLeft );
                    break;
                case 'a':
                    this.spriteB.render(ctx, this.x, this.y, !this.goingLeft );
                    break;
            }
        },
        drawIceGuy: function(ctx) {
            switch( this.state ) {
                case 't':
                case 'w':
                case 'd':
                    this.spriteA.render(ctx, this.x, this.y, !this.goingLeft );
                    break;
                case 'hb':
                case 'pb':
                case 'dj':
                    this.spriteB.render(ctx, this.x, this.y, !this.goingLeft );
                    break;
            }

        },
        drawEarthGuy: function(ctx) {
            //ctx.fillStyle = 'yellow';
            //ctx.fillRect(this.x, this.y, this.width, this.height);

            switch( this.state ) {
                case 'w':
                        this.spriteA.render(ctx, this.x, this.y, !this.goingLeft );
                        break;
                case 'up':
                        this.spriteB.render(ctx, this.x, this.y, !this.goingLeft );
                        break;
                case 'a':
                        this.spriteC.render(ctx, this.x, this.y, !this.goingLeft );
                        break;

            }
        },
        checkForPlayer: function(player, distance) {
            if ( !this.goingLeft ) {
                if ( simpleColCheck( player, { x: this.x, y: (this.y + this.height / 2), width: distance, height: 2 } ) ) {
                    return true;
                }
            } else {
                if ( simpleColCheck( player, { x: this.x - distance, y: (this.y + this.height / 2), width: distance, height: 2 } ) ) {
                    return true;
                }
            }
            return false;
        },
        attack: function() {
            switch( this.type ) {
                case 0:
                    // three fireballs
                    // forward
                    spawnAThing( (this.goingLeft ? this.x - this.width - 5 : this.x + this.width + 5), this.y + this.height, 2, this.goingLeft, true, true, false );
                    // diag up
                    spawnAThing( (this.goingLeft ? this.x - this.width - 5 : this.x + this.width + 5), this.y + this.height, 2, this.goingLeft, true, true, true );
                    // diag down
                    spawnAThing( (this.goingLeft ? this.x - this.width - 5 : this.x + this.width + 5), this.y + this.height, 2, this.goingLeft, false, true, true );
                    break;
                case 3:
                    spawnAThing( this.goingLeft ? this.x - this.width - 10 : this.x + this.width + 10, this.y + this.height, 1, this.goingLeft, false, true, false );
                    break;
            }
        }
    };

    var Thingee = function(dx,dy,dtype,a,b,c,d) {

        this.width = 32;
        this.height = 64;
        this.x = dx;
        this.y = dy;
        this.type = dtype;
        this.lifespan = 1000;
        this.goingLeft = a || false;
        this.goingUp = b || false;
        this.moveHoriz = c || false;
        this.moveVert = d || false;
        this.spawnTime = getTimeStamp();
        this.isDead = false;
        this.velX = 0;
        this.velY = 0;
        this.speed = 1;
        this.friction = 0.9;
        this.sprite = null;
        this.fluctuatorX = 0;
        this.fluctuatorY = 5;
        this.dX = -1;
        this.dY = -1;
        this.isPassthrough = {};
        this.flagged = false;
        this.state = 'a'; //alive

        switch ( this.type ) {
            // whirlwind
            case 1:
                this.lifespan = 3500;
                this.y = this.y - this.height - 1;
                this.speed = 3;
                this.sprite = new Sprite( 16, 32,
                    [ { ssx: 0, ssy: 40, duration: 100 },
                      { ssx: 15, ssy: 40, duration: 100 }  ]);
                break;
            // fireball
            case 5:
            case 2:
                this.lifespan = 3500;
                this.speed = 4;
                this.sprite = new Sprite( 7, 7, [ { ssx: 81, ssy: 34 } ]);
                this.y = this.y - 18;
                break;
            // rock
            case 3:
                this.speed = 2;
            case 6:
                this.lifespan = 2000;
                this.speed = 4;
                this.sprite = new Sprite( 8, 7, [ { ssx: 88, ssy: 34 } ]);
                this.y = this.y - 18;
                break;
            // enemy iceblock
            case 4:
                this.lifespan = 0;
                this.speed = 1;
                this.sprite = new Sprite( 12, 29, [ { ssx: 106, ssy: 0 } ]);
                this.y = this.y - 30;
                this.width = 24;
                this.isPassthrough = {
                    bottom: false,
                    left: false,
                    right: false
                };
                break;
            // snowball
            case 7:
                this.lifespan = 3500;
                this.speed = 5;
                this.sprite = new Sprite( 7, 7, [ { ssx: 83, ssy: 53 } ]);
                this.y = this.y - 18;
                break;
        }
    };

    Thingee.prototype = {
        update: function( player, blocks, things ) {

            switch( this.state ) {
                case 'a':
                    // 0 lifespan = doesn't expire
                    if ( this.lifespan > 0 ) {
                        var now = getTimeStamp();
                        if ( now - this.spawnTime > this.lifespan ) {
                            this.isDead = true;
                            if ( this.flagged ) {
                                this.flagged = false;
                                blocks[12].isEmpty = true;
                            }
                        }
                    }
                    if ( this.moveHoriz ) {
                        if ( this.goingLeft ) {
                            if (this.velX > -this.speed) {
                                this.velX--;
                            }
                        } else {
                            if (this.velX < this.speed) {
                                this.velX++;
                            }
                        }
                    }
                    if ( this.moveVert ) {
                        if ( this.goingUp ) {
                            if (this.velY > -this.speed) {
                                this.velY--;
                            }
                        } else {
                            if (this.velY < this.speed) {
                                this.velY++;
                            }
                        }
                    }
                    this.velX *= this.friction;
                    this.velY *= this.friction;
                    this.x += this.velX;
                    this.y += this.velY;
                    this.sprite.update();
                    if ( !this.isDead ) {
                        switch ( this.type ) {
                            // whirlwind grabs player
                            case 1:
                                if ( simpleColCheck( player, this ) ) {
                                    player.grabbed = true;
                                    player.x = this.x + this.fluctuatorX;
                                    player.y = this.y - 15 + this.fluctuatorY;
                                    player.jumping = true;
                                }
                                this.fluctuatorX += this.dX;
                                this.fluctuatorY += this.dY;

                                if ( this.fluctuatorX < -8 || this.fluctuatorX > 8) {
                                    this.dX *= -1;
                                }
                                if ( this.fluctuatorY < -20 || this.fluctuatorY > 5) {
                                    this.dY *= -1;
                                }
                                break;
                            // fireball
                            // rock
                            case 2:
                            case 3:
                                if ( simpleColCheck( player, this ) ) {
                                    player.state = 'd';
                                    this.isDead = true;
                                }
                                break;
                            case 4:
                                break;
                            case 5:
                                for(var i = 0; i < things.length; i++) {
                                    if ( !things[i].isDead && things[i].type === 4) {
                                        if ( simpleColCheck( this, things[i] ) ) {
                                            things[i].state = 'd';
                                            this.isDead = true;
                                        }
                                    }
                                }
                                break;
                        }

                        // kill it if reaches edge of screen, except for iceblocks
                        if ( this.type !== 4 && (this.x < -5 || this.x > 1028 || this.y < -5 || this.y > 800 )) {
                            this.isDead = true;
                        }
                    }
                    break;
                case 'd':
                    if ( this.type === 4 ) {
                        if ( this.flagged ) {
                                this.flagged = false;
                                blocks[12].isEmpty = true;
                            }
                    }
                    this.y += 3;
                    if ( this.y > 800 ) {
                        this.isDead = true;
                    }
                    break;
            }
        },
        render: function(ctx){
            //ctx.fillStyle = 'yellow';
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            this.sprite.render(ctx, this.x, this.y, this.goingLeft );
        },
        push: function( left ) {
            if ( left ) {
                this.x -= this.speed;
            }
            else
            {
                this.x += this.speed;
            }
        }
    };

    var spawnAThing = function( sx, sy, stype, sgoingleft, sgoingup, moveh, movev ) {
        var thing = new Thingee(sx, sy, stype, sgoingleft, sgoingup, moveh, movev );
        theGame.things = theGame.things.concat( thing );
        return thing;
    };

    // PLAYER

    var Player = function(game, gameSize) {
        this.game = game;
        this.height = 54;
        this.width = 30;
        this.x = gameSize.width / 2;
        this.y = gameSize.height - 50;

        this.keyboarder = new Keyboarder();

        this.speed = 3;
        this.velX = 0;
        this.velY = 0;
        this.friction = 0.9;
        this.jumping = false;
        this.grounded = true;
        this.falling = false;
        this.gravity = 0.3;

        this.grabbed = false;

        this.goingLeft = false;
        this.spriteStopped = new Sprite( 15, 27,
                    [ { ssx: 60, ssy: 72 } ]);
        this.spriteWalking = new Sprite( 15, 27,
                    [ { ssx: 60, ssy: 72, duration: 100 },
                      { ssx: 129, ssy: 72, duration: 100 }
                     ]);
        /* this.spriteShooting = new Sprite( 17, 27,
                    [ { ssx: 146, ssy: 72, duration: 50 } ]); */
        this.spriteDying = new Sprite( 24, 27,
                    [ { ssx: 118, ssy: 0 } ]);
        this.spriteJumping = new Sprite( 20, 29,
                    [ { ssx: 142, ssy: 0, duration: 50 } ]);
        this.state = 'w';
    };

    Player.prototype = {
        update: function(gameSize, boxes, hearts, things) {

            switch( this.state ) {
                case 'w':
                if (this.grabbed && (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) || this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) && (this.keyboarder.isDown(this.keyboarder.KEYS.UP) || this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || this.keyboarder.isDown(this.keyboarder.KEYS.Z))) {
                    this.grabbed = false;
                } else {
                    // left
                    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                        if (this.velX > -this.speed) {
                            this.velX--;
                        }
                        this.goingLeft = true;
                    }

                    // right
                    if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                        if (this.velX < this.speed) {
                            this.velX++;
                        }
                        this.goingLeft = false;
                    }

                    if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) || this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) || this.keyboarder.isDown(this.keyboarder.KEYS.Z) ) {
                        // jump up
                        if (!this.jumping && this.grounded){
                            this.jumping = true;
                            this.grounded = false;
                            this.falling = false;
                            this.velY = -this.speed * 2;
                            aa.play('jump');
                        }
                    }

                    if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) ) {
                        // go down the stairs
                        if (!this.jumping && this.grounded){
                           this.grounded = false;
                           this.jumping = false;
                           this.falling = true;
                           this.velY = this.speed * 2;
                        }
                    }

                    if (this.keyboarder.isDown(this.keyboarder.KEYS.X) ) {
                        if ( pauseButtonDelay.isDone() ) {
                            // switch element
                            this.game.currentElement++;
                            if ( this.game.currentElement > 2 ) {
                                this.game.currentElement = 0;
                            }
                            pauseButtonDelay.reset();
                        }
                    }
                    if (this.keyboarder.isDown(this.keyboarder.KEYS.C) ) {
                        // fire/use element
                        if ( pauseButtonDelay.isDone() ) {

                            this.attack = true;
                            spawnAThing( (this.goingLeft ? this.x - 6: this.x + this.width - 6), this.y + 45, 5 + this.game.currentElement, this.goingLeft, false, true, false );

                            pauseButtonDelay.reset();
                        }
                    }
                }
                // mute
                if (this.keyboarder.isDown(this.keyboarder.KEYS.M) ) {
                    if ( muteButtonDelay.isDone() ) {
                        aa.mute = !aa.mute;
                        muteButtonDelay.reset();
                    }
                }
                /*
                if (this.keyboarder.isDown(this.keyboarder.KEYS.P) ) {
                    if ( pauseButtonDelay.isDone() ) {
                        PAUSE = !PAUSE;
                        pauseButtonDelay.reset();
                    }
                } */

                this.velX *= this.friction;
                this.velY += this.gravity;

                this.grounded = false;
                for (var i = 0; i < boxes.length; i++) {

                    var dir = colCheck(this, boxes[i]);

                    if (dir === 'l' || dir === 'r') {
                        this.velX = 0;
                        this.jumping = false;
                    } else if (dir === 'b') {
                        this.grounded = true;
                        this.jumping = false;
                        this.falling = false;
                    } else if (dir === 't') {
                        this.velY *= -1;
                    }
                }
                for (var i = 0; i < things.length; i++) {
                    if ( !things[i].isDead && things[i].type === 4 ) {
                        var dir = colCheck(this, things[i]);

                        if (dir === 'l' || dir === 'r') {
                            this.velX = 0;
                            this.jumping = false;
                        } else if (dir === 'b') {
                            this.grounded = true;
                            this.jumping = false;
                            this.falling = false;
                        } else if (dir === 't') {
                            this.velY *= -1;
                        }

                    }
                }

                if (this.grounded){
                     this.velY = 0;
                }

                this.x += this.velX;
                this.y += this.velY;

                if ( this.x < - (this.width - 2) ) {
                    this.x = gameSize.width - 3;
                }
                else if ( this.x > gameSize.width - 2 ) {
                    this.x = (this.width - 3) * -1;
                }
                if(( this.velX > 0.1 || this.velX < -0.1 ) && !this.jumping ){
                    this.spriteWalking.update();
                }
                break;
            case 'd':
                this.y += 3;
                if ( this.y > 1000 ) {
                    endGame('DIE');
                }
                break;
            }
        },

        render: function(ctx) {
            //if ( this.goingLeft ) {
            switch( this.state ) {
                case 'w':
                    if ( this.jumping || this.falling ) {
                        this.spriteJumping.render(ctx, this.x, this.y, !this.goingLeft);
                    }
                    else
                    {
                        this.spriteWalking.render(ctx, this.x, this.y, !this.goingLeft);
                    }
                    break;
                case 'd':
                        this.spriteDying.render(ctx, this.x, this.y, !this.goingLeft);
                    break;
            }
        }
    };

    // CODE STARTS HERE
    var Game = function() {

        // maybe some other day
        // var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

        var canvas = document.getElementById('mc');
        var context = canvas.getContext('2d');

        // don't you dare AA my pixelart!
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        var gameSize = { width: canvas.width, height: canvas.height };

        this.state = 'LOADING';
        this.titlescreenBlink = new DelayCounter([500,500]);
        this.keyboarder = new Keyboarder();
        this.player = new Player(this, gameSize);

        this.enemies = [];

        this.enemies = this.enemies.concat(new BadGuy( 200 + getRandomInt(0, 20), 251, 0, 'fg', 2 )); // fire
        this.enemies = this.enemies.concat(new BadGuy( 700 + getRandomInt(0, 20), 251, 0, 'fg', 2 )); // fire
        this.enemies = this.enemies.concat(new BadGuy( 100, 367, 3, 'wd', 0 )); // wind
        // this.enemies = this.enemies.concat(new WindDuck( 200, 367 ));  // wind
        this.enemies = this.enemies.concat(new BadGuy( 200 + getRandomInt(0, 20), 575, 1, 'eg', 1 )); // earth 518
        this.enemies = this.enemies.concat(new BadGuy( 800 + getRandomInt(0, 20), 575, 1, 'eg', 1 )); // earth 518
        this.enemies = this.enemies.concat(new BadGuy( -50, 705, 2, 'ig', 1 )); // ice

        this.things = [];

        var monsterblockers = [];

        // blocks 3 element monsters, not ice monster
        monsterblockers = monsterblockers.concat( new MonsterBlock( 10, 150, 10, 450, ['wd', 'ww', 'fg', 'fb', 'eg', 'ro']) );
        monsterblockers = monsterblockers.concat( new MonsterBlock( 1000, 150, 10, 450, ['wd', 'ww', 'fg', 'fb', 'eg', 'ro']) );

        // fire guys
        monsterblockers = monsterblockers.concat( new MonsterBlock( 345, 150, 10, 130, ['fg']) );
        monsterblockers = monsterblockers.concat( new MonsterBlock( 672, 150, 10, 130, ['fg']) );

        // earth guys
        monsterblockers = monsterblockers.concat( new MonsterBlock( 500, 450, 10, 130, ['eg']) );
        monsterblockers = monsterblockers.concat( new MonsterBlock( 595, 450, 10, 130, ['eg']) );

        // ice monsters
        monsterblockers = monsterblockers.concat( new MonsterBlock( -80, 600, 10, 130, ['ig']) );
        monsterblockers = monsterblockers.concat( new MonsterBlock( 1080, 600, 10, 130, ['ig']) );

        this.lastPewPew = 0;

        aa = new ArcadeAudio();

        // grab heart sound
        aa.add( 'pickup', 2,
            [
                [0,,0.01,0.4394,0.3103,0.8765,,,,,,0.3614,0.5278,,,,,,1,,,,,0.5]
            ]
        );

        aa.add( 'jump', 1,
            [
                [0,,0.1625,,0.159,0.2246,,,,,,,,0.0471,,,,,1,,,0.1,,0.29]
            ]
        );

        // heart in danger sound
        aa.add( 'pewpew', 3,
            [
                [2,,0.2742,0.0215,0.0863,0.6068,0.2,-0.196,,,,,,0.5091,-0.515,,,,1,,,,,0.29]
            ]
        );

        aa.add( 'cheep', 4,
            [
                [2,0.1602,0.01,0.4203,0.6306,0.5952,,-0.129,0.04,0.19,0.75,0.5614,0.06,-0.7285,0.9046,-0.595,0.9816,-0.5187,0.9028,0.6024,0.6813,0.521,-0.0292,0.5]
            ]);

        this.bodies = [];

        this.bodies = this.bodies.concat(this.player);
        this.bodies = this.bodies.concat(new HeartSprinkler(this, gameSize));

        var boxes = [];

        this.fallingStuff = [];

        var heartStoppers = [];
        // stops the hearts at the bottom
        heartStoppers = heartStoppers.concat(new Box( -60, 742, 1084, 20, {} ));

        // ground floor
        boxes = boxes.concat(new Box( -30, 730, 1054, 48, {} ));

        // level floors
        // first floor
        boxes = boxes.concat(new Box( -30, 580,  533, 4, { bottom: true } )); // 150 high
        boxes = boxes.concat(new Box( 600, 580,  500, 4, { bottom: true } )); // 150 high

        // second floor
        boxes = boxes.concat(new Box( -30, 430, 1054, 4, { bottom: true } ));

        // third floor
        // three pieces here
        boxes = boxes.concat(new Box( -30, 280, 372, 4, { bottom: true } ));
        boxes = boxes.concat(new Box( 402, 280, 220, 4, { bottom: true } ));
        boxes = boxes.concat(new Box( 682, 280, 382, 4, { bottom: true } ));

        // heart sprinkler floor - you shall not pass
        boxes = boxes.concat(new Box( 0, 130, 1024, 4, {} ));

        // stairs

        // floor level
        // left
        boxes = boxes.concat(new Box( 64, 680, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 32, 630, 32, 5, { left: true, right: false, bottom: true } ));
        boxes = boxes.concat(new Box( 0, 584, 32, 5, { bottom: false } ));
        // right
        boxes = boxes.concat(new Box( 928, 680, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 960, 630, 32, 5, { left: false, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 992, 584, 32, 5, { bottom: false } ));

        // first floor
        // left
        boxes = boxes.concat(new Box( 64, 530, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 32, 480, 32, 5, { left: true, right: false, bottom: true } ));
        boxes = boxes.concat(new Box( 0, 434, 32, 5, { bottom: false } ));
        // right
        boxes = boxes.concat(new Box( 928, 530, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 960, 480, 32, 5, { left: false, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 992, 434, 32, 5, { bottom: false } ));

        // second floor
        // left
        boxes = boxes.concat(new Box( 64, 380, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 32, 330, 32, 5, { left: true, right: false, bottom: true } ));
        boxes = boxes.concat(new Box( 0, 284, 32, 5, { bottom: false } ));
        // right
        boxes = boxes.concat(new Box( 928, 380, 32, 5, { left: true, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 960, 330, 32, 5, { left: false, right: true, bottom: true } ));
        boxes = boxes.concat(new Box( 992, 284, 32, 5, { bottom: false } ));

        this.iceblockbases = [];
        // ice monster block bases
        for(var z = 100; z < 900; z += 33 ) {
            this.iceblockbases.push( new Box(z, 720, 32, 3, {}, true ) );
        }

        this.bodies = this.bodies.concat( boxes );

        var self = this;

        this.loadImages();

        // background tiles
        this.backgroundTile = new Sprite( 12, 30, [ { ssx: 0, ssy: 72 } ] );
        this.backgroundTile2 = new Sprite( 12, 30, [ { ssx: 12, ssy: 72 } ] );
        this.backgroundTile3 = new Sprite( 12, 30, [ { ssx: 48, ssy: 72 } ] );

        this.cloudTile = new Sprite( 24, 14, [ { ssx: 97, ssy: 58 } ] );
        this.grass1Tile = new Sprite( 7, 3, [ { ssx: 83, ssy: 62 } ] );
        this.grass2Tile = new Sprite( 7, 3, [ { ssx: 90, ssy: 62 } ] );

        this.treeSlice = new Sprite( 60, 4, [ { ssx: 32, ssy: 67 } ] );
        this.treeRootLeft = new Sprite( 7, 8, [ { ssx: 29, ssy: 94 } ] );
        this.treeRootRight = new Sprite( 6, 8, [ { ssx: 36, ssy: 94 } ] );

        this.leavesTile = new Sprite( 24, 21, [ { ssx: 24, ssy: 72 } ] );

        // stair tiles
        this.stairTile = new Sprite( 50, 25, [ { ssx: 121, ssy: 46 } ] );

        // water at the bottom of the screen
        this.waterTile = new Sprite( 14, 8, [ { ssx: 0, ssy: 8, duration: 500 }, { ssx: 14, ssy: 8, duration: 500 } ] );
        this.waterTile2 = new Sprite( 14, 8, [ { ssx: 8, ssy: 16 } ] );

        // platform tiles
        // grass
        this.pf_one_Tile = new Sprite( 4, 8, [ { ssx: 0, ssy: 16 } ] );
        // rock/sand
        this.pf_two_Tile = new Sprite( 4, 8, [ { ssx: 4, ssy: 16 } ] );

        // mute icon
        this.mute_icon = new Sprite( 7, 8, [ { ssx: 0, ssy: 32 } ] );

        this.heartIcon = new Sprite( 7, 8, [ { ssx: 0, ssy: 0, duration: 400 } ] );
        this.elementIcons = new Sprite( 7, 8, [ { ssx: 81, ssy: 34 }, { ssx: 89, ssy: 34 }, { ssx: 83, ssy: 53 } ] );
        this.heartmeter = new Sprite( 13, 6, [ { ssx: 97, ssy: 52 }, { ssx: 97, ssy: 49 } ] );
        this.elementBox = new Sprite( 13, 13, [ { ssx: 97, ssy: 45 } ] );
        this.currentElement = 0;

        var SKIPTICKS = 1000 / 60;

        var nextFrame = getTimeStamp();
        var loops = 0;

        var tick = function() {

            if ( !AWAY ) {
                loops = 0;
                // frame rate independent game speed
                while( getTimeStamp() > nextFrame && loops < 10 ) {
                    self.update(gameSize, boxes, heartStoppers, monsterblockers );
                    nextFrame += SKIPTICKS;
                    loops++;
                }

                self.render(context, gameSize, monsterblockers);
            }
            else
            {
                context.fillStyle = '#000';
                context.fillText('Click to resume', 505, 384);
                nextFrame = getTimeStamp();
            }
            requestAnimationFrame(tick);

        };

        tick();
    };

    var endGame = function(s) {
        longButtonDelay.reset();
        theGame.state = s;
    };

    var resetGame = function() {
        currentHearts = theGame.currentElement = heartsindanger = 0;
        theGame.fallingStuff = [];
        theGame.things = [];
        theGame.player.x = 512;
        theGame.player.y = 700;
        theGame.player.state = 'w';
        for(var i = 0; i < theGame.enemies.length; i++ ) {
            theGame.enemies[i].reset();
        }
        theGame.iceblockbases[12].isEmpty = true;
    };

    Game.prototype = {

      update: function(gameSize, boxes, heartStoppers, monsterblockers) {
        var self = this;

        switch( this.state ) {
            case 'TITLE':
                if ( this.keyboarder.anyKeyDown() ){
                    this.state = 'STORY';
                    PAUSE = false;
                }
                break;
            case 'STORY':
                if ( this.keyboarder.anyKeyDown() ){
                    this.state = 'GAME';
                    PAUSE = false;
                }
                break;
            case 'END':
            case 'DIE':
                if ( this.keyboarder.anyKeyDown( true ) ){
                    this.state = 'TITLE';
                    PAUSE = false;
                }
                break;
            case 'GAME':
                if ( !PAUSE ) {
                    var i = 0;
                    for (i = 0; i < this.bodies.length; i++) {
                        this.bodies[i].update(gameSize, boxes, this.hearts, this.things);
                    }

                    for (i = 0; i < this.enemies.length; i++) {
                        if ( !this.enemies[i].isDead ) {
                            this.enemies[i].update(monsterblockers, this.player, this.things, this.iceblockbases);
                            if ( simpleColCheck( this.player, this.enemies[i] ) ) {
                                if ( this.enemies[i].type === 1 && (( this.enemies[i].state === 'up' && this.enemies[i].spriteB.getFrame() < 1 ) || this.enemies[i].state === 'w' )) {
                                    // do nuthing
                                }
                                else
                                {
                                    this.player.state = 'd';
                                }
                            }
                        }
                    }

                    for (i = 0; i < this.fallingStuff.length; i++) {
                        this.fallingStuff[i].update(gameSize, heartStoppers, this.player);
                    }

                    // check if any hearts are in danger
                    if ( heartsindanger > 0 ) {
                        var n = getTimeStamp();

                        if ( n - this.lastPewPew > 500 ) {
                            aa.play('pewpew');
                            this.lastPewPew = n;
                        }
                    }

                    for (i = 0; i < this.things.length; i++) {
                        if ( !this.things[i].isDead ) {
                            this.things[i].update(this.player, this.iceblockbases, this.things);
                        }
                    }

                    // animate the water
                    this.waterTile.update();
                }
                if (this.keyboarder.isDown(this.keyboarder.KEYS.P) ) {
                    if ( pauseButtonDelay.isDone() ) {
                        PAUSE = !PAUSE;
                        pauseButtonDelay.reset();
                    }
                }
                break;
        }
      },

      render: function(screen, gameSize, monsterblockers) {
        screen.clearRect(0, 0, gameSize.width, gameSize.height);

        switch( this.state ) {

            case 'LOADING':
                this.renderLoadingScreen(screen, gameSize);
                break;
            case 'TITLE':
                this.renderPrettyBackground(screen);
                this.renderTitleScreen(screen, gameSize);
                this.waterTile.update();
                break;
            case 'STORY':
                this.renderPrettyBackground(screen);
                this.renderStoryScreen(screen, gameSize);
                this.waterTile.update();
                break;
            case 'END':
                this.renderEndScreen(screen, gameSize, 'You Did it! Congratulations!');
                break;
            case 'DIE':
                this.renderEndScreen(screen, gameSize, 'Game Over!');
                break;
            case 'GAME':
                this.renderPrettyBackground(screen);
                this.renderBackground(screen);

                var i = 0;
                for (i = 0; i < this.bodies.length; i++) {
                  this.bodies[i].render(screen);
                }

                for (i = 0; i < this.enemies.length; i++) {
                    if ( !this.enemies[i].isDead ) {
                        this.enemies[i].render(screen);
                    }
                }

                for (i = 0; i < this.fallingStuff.length; i++) {
                    if ( !this.fallingStuff[i].isDead ) {
                        this.fallingStuff[i].render(screen);
                    }
                }

                for (i = 0; i < this.things.length; i++) {
                    if ( !this.things[i].isDead ) {
                        this.things[i].render(screen);
                    }
                }

                this.renderHUD(screen, this.player);

                if ( PAUSE ) {
                    screen.fillStyle = '#000';
                    screen.font = '30pt monospace';
                    screen.textAlign = 'center';
                    screen.fillText('PAUSED', gameSize.width / 2, gameSize.height / 2);
                }

                var thisFrameFPS = 1000 / ((now = new Date()) - lastUpdate);
                if (now !== lastUpdate){
                  fps += (thisFrameFPS - fps) / fpsFilter;
                  lastUpdate = now;
                }
                break;
        }
      },
      renderEndScreen: function(ctx, gameSize, text) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0,0, gameSize.width, gameSize.height);

            ctx.fillStyle = "#fff";
            ctx.font = '30pt monospace';
            ctx.textAlign = 'center';
            ctx.fillText(text, gameSize.width / 2, gameSize.height / 2);

            this.bst(ctx, 512, 600, true);
            resetGame();
      },
      renderPrettyBackground: function(ctx) {
            // 11b76d - grass
            // 148875 - foreground
            // d3591b - soil
            //

            var tx = 0;
            // tiles
            // clouds
            for (tx = 0; tx < 1024; tx += 94 ) {
                this.cloudTile.render(ctx, tx, 482);
                this.cloudTile.render(ctx, tx + 48, 482, true );
            }

            // treeline
            var c = 0;
            for (tx = 0; tx < 1024; tx += 24 ) {

                this.backgroundTile.render(ctx, tx, 510);
                if ( tx % (24 * 4) === 0 ) {
                    this.backgroundTile2.render(ctx, tx, 510);
                    c = 0;
                }
                if ( tx === (24 * 25) ) {
                    this.backgroundTile3.render(ctx, tx, 510);
                    c = 0;
                }
                c++;
            }

            // third level - grass
            ctx.fillStyle = '#11b76d';
            ctx.fillRect( 0, 570, 1024, 80);

            // second level - foreground
            ctx.fillStyle = '#148875';
            ctx.fillRect( 0, 650, 1024, 40);

            // third level - foreground
            ctx.fillStyle = '#155c6f';
            ctx.fillRect( 0, 690, 1024, 100);

            // grass tile 1
            for (tx = 0; tx < 1024; tx += 15 ) {
                this.grass1Tile.render(ctx, tx, 645);
            }
            // grass tile 2
            for (tx = 0; tx < 1024; tx += 15 ) {
                this.grass2Tile.render(ctx, tx, 685);
            }

            // trees
            for (tx = 0; tx < 768; tx += 8 ) {
                this.treeSlice.render(ctx, 150, tx);
                this.treeSlice.render(ctx, 450, tx);
                this.treeSlice.render(ctx, 750, tx);
            }
            // tree roots
            for(var a = 0; a < 3; a++ ) {
                this.treeRootLeft.render(ctx, 138 + (a * 300), 713);
                this.treeRootRight.render(ctx, 268 + (a * 300), 713);
            }

            // leaves
            for (tx = 0; tx < 1024; tx += 48 ) {
                this.leavesTile.render(ctx, tx, 0);
            }
      },
      renderBackground: function(ctx) {

            var tx = 0;

            // platform tiles
            // 4 x 8 = 8 x 16
            for (tx = 0; tx < 1024; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 729);
                this.pf_two_Tile.render(ctx, tx, 745);
            }

            for (tx = 0; tx < 500; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 580);
            }
            for (tx = 600; tx < 1024; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 580);
            }

            for (tx = 0; tx < 1024; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 430);
            }
            for (tx = 0; tx < 340; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 279);
            }
            for (tx = 400; tx < 620; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 279);
            }
            for (tx = 680; tx < 1024; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 279);
            }

            for (tx = 0; tx < 1024; tx += 8 ) {
                this.pf_one_Tile.render(ctx, tx, 129);
            }

            // stairs
            this.drawStairs(ctx, 0, 280, false);
            this.drawStairs(ctx, 0, 430, false);
            this.drawStairs(ctx, 0, 580, false);

            this.drawStairs(ctx, 1024 - 100, 280, true);
            this.drawStairs(ctx, 1024 - 100, 430, true);
            this.drawStairs(ctx, 1024 - 100, 580, true);

            // water
            for (tx = 0; tx < 1024; tx += 28 ) {
                this.waterTile.render(ctx, tx, 740);
                this.waterTile2.render(ctx, tx, 756);
            }

      },
      drawStairs: function( ctx, locX, locY, flip) {
        if ( flip ) {
            this.stairTile.render(ctx, locX,      locY + 100, flip);
            this.stairTile.render(ctx, locX + 32, locY + 50, flip);
            this.stairTile.render(ctx, locX + 64, locY, flip);
        }
        else
        {
            this.stairTile.render(ctx, locX,      locY + 100, flip);
            this.stairTile.render(ctx, locX - 32, locY + 50, flip);
            this.stairTile.render(ctx, locX - 64, locY, flip);
        }
      },
      renderHUD: function(ctx, player) {
        if ( aa.mute ) {
            this.mute_icon.render(ctx, 1000, 50);
        }

        // heart meter
        // draw a red box to fill the meter
        ctx.fillStyle = 'red';
        ctx.fillRect(18, 168, 20, -1 * currentHearts * 4);

        this.heartIcon.render(ctx, 20, 20);
        this.heartmeter.setFrame(1);
        for ( var i = 0; i < 11; i++ ) {
            this.heartmeter.render(ctx, 14, 40 + (i * 12 ));
            if ( i == 9 ) {
                this.heartmeter.setFrame(0);
            }
        }
        // element box
        this.elementBox.render(ctx, 50, 45 + (this.currentElement * 25));
        // current element
        for ( var i = 0; i < 3; i++) {
            this.elementIcons.setFrame(i);
            this.elementIcons.render(ctx, 55, 50 + (i * 25));
        }
      },
      renderLoadingScreen: function(ctx, gameSize) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0, gameSize.width, gameSize.height);
        ctx.fillStyle = 'white';
        ctx.font = '20pt monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', gameSize.width / 2, gameSize.height / 2);
      },
      renderStoryScreen: function(ctx, gameSize) {
        this.renderBackground(ctx);
        // light overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.80)";
        ctx.fillRect(0,0, gameSize.width, gameSize.height);

        var hw = gameSize.width / 2;
        var hh = gameSize.height / 2;

        ctx.fillStyle = 'white';
        ctx.font = '12pt monospace';

        var text = [ 'Oh no!',
                     'Felicity\'s boyfriend is losing his love!',
                     'Brave the four elements and collect the hearts before they break.',
                     'Fill the heartmeter to complete the level.',
                     'Watch out for windducks, firesprites, sandmonsters and snowmen.',
                     'Use the correct element to defeat them.',
                     '',
                     'Controls:',
                     'Arrow keys: Move left/right, Jump, Go down stairs',
                     'Z: Jump',
                     'X: Switch Element',
                     'C: Use Element',
                     '',
                     'M: Mute sounds',
                     'P: Pause'
                    ];

        for ( var i = 0; i < text.length; i++) {
            ctx.fillText( text[i], hw, 100 + (i * 40) );
        }

        this.bst(ctx, hw, 720);

      },
      bst: function(ctx, x, y, flag) {
        switch ( this.titlescreenBlink.getStage() ) {
            case 0:
                ctx.fillStyle = 'white';
                ctx.font = '15pt impact';
                if ( flag ) {
                    ctx.fillText('Press any key to try again', x, y );
                } else {
                    ctx.fillText('Press any key to begin', x, y );
                }
                break;
        }
      },
      renderTitleScreen: function(ctx, gs) {
        this.renderBackground(ctx);
        // dark overlay
        ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
        ctx.fillRect(0,0, gs.width, gs.height);
        ctx.fillStyle = 'yellow';
        ctx.font = '60pt impact';
        ctx.textAlign = 'center';
        var t = [ 'Felicity', 'and', 'the Fifth Element:', 'Love'];
        for ( var i = 0; i < t.length; i++) {
            ctx.fillText( t[i], 512, 200 + (i * 100) );
        }
        this.bst(ctx, 512, 630);
      },
      // load our spritesheet
      loadImages: function(){
            var self = this;
            var imageObj = new Image();

            imageObj.onload = function() {
                self.state = "TITLE";
            };
            imageObj.src = "spritesheet.png";
            images[0] = imageObj;
        }
    };

    // start game when page has finished loading
    window.addEventListener("load", function() {
      theGame = new Game();
    });

    // if the window looses focus we pause the game - otherwise you get a superspeed moment!
    window.onblur = function() {
        AWAY = true;
    };
    window.onfocus = function() {
        AWAY = false;
    };
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbC9wdWJsaWNfaHRtbC9qczEzazIwMTQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vc3JjL3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciB0aGVHYW1lID0gbnVsbDtcbiAgICAvLyBnbG9iYWxzXG4gICAgdmFyIE1VVEVfQVVESU8gPSBmYWxzZTtcbiAgICB2YXIgaW1hZ2VzID0gW107XG5cbiAgICB2YXIgUEFVU0UgPSBmYWxzZTtcbiAgICB2YXIgQVdBWSA9IGZhbHNlO1xuICAgIHZhciBhYSA9IG51bGw7XG4gICAgdmFyIGhlYXJ0c2luZGFuZ2VyID0gMDtcbiAgICB2YXIgTUFYSEVBUlRTID0gMzI7XG4gICAgdmFyIGN1cnJlbnRIZWFydHMgPSAwO1xuXG4gICAgLy8gVVRJTCBGVU5DVElPTlNcbiAgICB2YXIgc2ltcGxlQ29sQ2hlY2sgPSBmdW5jdGlvbihzaGFwZUEsIHNoYXBlQikge1xuICAgICAgICBpZiAoc2hhcGVBLnggPCBzaGFwZUIueCArIHNoYXBlQi53aWR0aCAmJlxuICAgICAgICAgICAgc2hhcGVBLnggKyBzaGFwZUEud2lkdGggPiBzaGFwZUIueCAmJlxuICAgICAgICAgICAgc2hhcGVBLnkgPCBzaGFwZUIueSArIHNoYXBlQi5oZWlnaHQgJiZcbiAgICAgICAgICAgIHNoYXBlQS5oZWlnaHQgKyBzaGFwZUEueSA+IHNoYXBlQi55KSB7XG4gICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgZnBzID0gMCwgbm93LCBsYXN0VXBkYXRlID0gKG5ldyBEYXRlKCkpKjE7XG4gICAgdmFyIGZwc0ZpbHRlciA9IDUwO1xuICAgIHZhciBmcHNPdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzJyk7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGZwc091dC5pbm5lckhUTUwgPSBmcHMudG9GaXhlZCgxKSArIFwiIGZwc1wiO1xuICAgIH0sIDEwMDApO1xuXG4gICAgdmFyIGdldFRpbWVTdGFtcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coKTtcbiAgICB9O1xuXG4gICAgdmFyIGdldFJhbmRvbUludCA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0UmFuZG9tQm9vbGVhbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgMC41O1xuICAgIH07XG5cbiAgICB2YXIgY29sQ2hlY2sgPSBmdW5jdGlvbihzaGFwZUEsIHNoYXBlQikge1xuICAgICAgICAvLyBnZXQgdGhlIHZlY3RvcnMgdG8gY2hlY2sgYWdhaW5zdFxuICAgICAgICB2YXIgdlggPSAoc2hhcGVBLnggKyAoc2hhcGVBLndpZHRoIC8gMikpIC0gKHNoYXBlQi54ICsgKHNoYXBlQi53aWR0aCAvIDIpKSxcbiAgICAgICAgICAgIHZZID0gKHNoYXBlQS55ICsgKHNoYXBlQS5oZWlnaHQgLyAyKSkgLSAoc2hhcGVCLnkgKyAoc2hhcGVCLmhlaWdodCAvIDIpKSxcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgaGFsZiB3aWR0aHMgYW5kIGhhbGYgaGVpZ2h0cyBvZiB0aGUgb2JqZWN0c1xuICAgICAgICAgICAgaFdpZHRocyA9IChzaGFwZUEud2lkdGggLyAyKSArIChzaGFwZUIud2lkdGggLyAyKSxcbiAgICAgICAgICAgIGhIZWlnaHRzID0gKHNoYXBlQS5oZWlnaHQgLyAyKSArIChzaGFwZUIuaGVpZ2h0IC8gMiksXG4gICAgICAgICAgICBjb2xEaXIgPSBudWxsO1xuXG4gICAgICAgIC8vIGlmIHRoZSB4IGFuZCB5IHZlY3RvciBhcmUgbGVzcyB0aGFuIHRoZSBoYWxmIHdpZHRoIG9yIGhhbGYgaGVpZ2h0LCB0aGV5IHdlIG11c3QgYmUgaW5zaWRlIHRoZSBvYmplY3QsIGNhdXNpbmcgYSBjb2xsaXNpb25cbiAgICAgICAgaWYgKE1hdGguYWJzKHZYKSA8IGhXaWR0aHMgJiYgTWF0aC5hYnModlkpIDwgaEhlaWdodHMpIHtcbiAgICAgICAgICAgIC8vIGZpZ3VyZXMgb3V0IG9uIHdoaWNoIHNpZGUgd2UgYXJlIGNvbGxpZGluZyAodG9wLCBib3R0b20sIGxlZnQsIG9yIHJpZ2h0KVxuICAgICAgICAgICAgdmFyIG9YID0gaFdpZHRocyAtIE1hdGguYWJzKHZYKSxcbiAgICAgICAgICAgIG9ZID0gaEhlaWdodHMgLSBNYXRoLmFicyh2WSk7XG4gICAgICAgICAgICBpZiAob1ggPj0gb1kpIHtcbiAgICAgICAgICAgICAgICBpZiAodlkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBmYWxsaW5nIGZsYWcsIG90aGVyd2lzZSB3ZSBkcm9wIHN0cmFpZ2h0IHRvIHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgc2hhcGVBLmZhbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29sRGlyID0gJ3QnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHNoYXBlQi5pc1Bhc3N0aHJvdWdoLmJvdHRvbSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbERpciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZUEueSArPSBvWTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGFyZSBmYWxsaW5nLCBwYXNzIHRocm91Z2ggdGhlIGFwcHJvcHJpYXRlIGZsb29yXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2hhcGVCLmlzUGFzc3Rocm91Z2guYm90dG9tICYmIHNoYXBlQS5mYWxsaW5nICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sRGlyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbERpciA9ICdiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlQS55IC09IG9ZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodlggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggc2hhcGVCLmlzUGFzc3Rocm91Z2gucmlnaHQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xEaXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sRGlyID0gJ2wnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGVBLnggKz0gb1g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHNoYXBlQi5pc1Bhc3N0aHJvdWdoLmxlZnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xEaXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sRGlyID0gJ3InO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGVBLnggLT0gb1g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbERpcjtcbiAgICB9O1xuXG4gICAgLy8gVVRJTCBDTEFTU0VTXG5cbiAgICB2YXIgRGVsYXlDb3VudGVyID0gZnVuY3Rpb24oIGRlbHRhICkge1xuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IGdldFRpbWVTdGFtcCgpO1xuICAgICAgICB0aGlzLmRlbHRhcyA9IGRlbHRhIHx8IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnREZWx0YSA9IDA7XG4gICAgfTtcblxuICAgIERlbGF5Q291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIHN0YXJ0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IGdldFRpbWVTdGFtcCgpO1xuICAgICAgICB9LFxuICAgICAgICBjaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIGdldFRpbWVTdGFtcCgpIC0gdGhpcy50aW1lc3RhbXAgPiB0aGlzLmRlbHRhc1t0aGlzLmN1cnJlbnREZWx0YV0gKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIHRoaXMuZGVsdGFzW3RoaXMuY3VycmVudERlbHRhXSArIHRoaXMudGltZXN0YW1wICk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERlbHRhKys7XG4gICAgICAgICAgICBpZiAoIHRoaXMuY3VycmVudERlbHRhID49IHRoaXMuZGVsdGFzLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREZWx0YSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ25leHQnICsgdGhpcy5jdXJyZW50RGVsdGEgKyB0aGlzLmRlbHRhc1t0aGlzLmN1cnJlbnREZWx0YV0gKyBcIiAtIFwiICsgdGhpcy50aW1lc3RhbXAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U3RhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50RGVsdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRG9uZSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCBnZXRUaW1lU3RhbXAoKSAtIHRoaXMudGltZXN0YW1wID4gdGhpcy5kZWx0YXNbdGhpcy5jdXJyZW50RGVsdGFdICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICByZXNldCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lc3RhbXAgPSBnZXRUaW1lU3RhbXAoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERlbHRhID0gMDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgbXV0ZUJ1dHRvbkRlbGF5ID0gbmV3IERlbGF5Q291bnRlcihbMjAwXSk7XG4gICAgdmFyIHBhdXNlQnV0dG9uRGVsYXkgPSBuZXcgRGVsYXlDb3VudGVyKFsyMDBdKTtcbiAgICB2YXIgbG9uZ0J1dHRvbkRlbGF5ID0gbmV3IERlbGF5Q291bnRlcihbMjAwMF0pO1xuXG4gICAgdmFyIFNwcml0ZSA9IGZ1bmN0aW9uKCB3LCBoLCBmcmFtZURlZiApIHtcbiAgICAgIHRoaXMud2lkdGggPSB3O1xuICAgICAgdGhpcy5oZWlnaHQgPSBoO1xuICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICB0aGlzLmZyYW1lcyA9IGZyYW1lRGVmO1xuICAgICAgdGhpcy50cyA9IGdldFRpbWVTdGFtcCgpO1xuICAgIH07XG5cbiAgICBTcHJpdGUucHJvdG90eXBlID0ge1xuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKGN0eCwgeCwgeSwgZG9GbGlwKXtcbiAgICAgICAgICAgIHZhciBmbGlwID0gZG9GbGlwIHx8IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCB0aGlzLmZyYW1lID49IHRoaXMuZnJhbWVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggZmxpcCApIHtcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgY3R4LnNjYWxlKC0xLCAxKTtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKCBpbWFnZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZyYW1lc1t0aGlzLmZyYW1lXS5zc3gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZyYW1lc1t0aGlzLmZyYW1lXS5zc3ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWNyZXQgc2F1Y2U6IGNoYW5nZSB0aGUgZGVzdGluYXRpb24ncyBYIHJlZ2lzdHJhdGlvbiBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNhbnZhcy53aWR0aCAtIHggLSAodGhpcy53aWR0aCAqIDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiAyKTtcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltYWdlc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnJhbWVzW3RoaXMuZnJhbWVdLnNzeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnJhbWVzW3RoaXMuZnJhbWVdLnNzeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgbm93ID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgICAgICAgICBpZiAoICEhdGhpcy5mcmFtZXNbdGhpcy5mcmFtZV0uZHVyYXRpb24gJiYgbm93IC0gdGhpcy50cyA+IHRoaXMuZnJhbWVzW3RoaXMuZnJhbWVdLmR1cmF0aW9uICkge1xuICAgICAgICAgICAgICAgIHRoaXMudHMgPSBub3c7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0RnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0RnJhbWU6IGZ1bmN0aW9uKG5ld2ZyYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gbmV3ZnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIG5leHRGcmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgICAgICAgICBpZiAoIHRoaXMuZnJhbWUgPj0gdGhpcy5mcmFtZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRGcmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mcmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgICAgICB0aGlzLnRzID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICB2YXIgS2V5Ym9hcmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaXNEb3duID0gZnVuY3Rpb24oa2V5Q29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleVN0YXRlW2tleUNvZGVdID09PSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFueUtleURvd24gPSBmdW5jdGlvbihmbGFnKXtcbiAgICAgICAgICAgIHZhciBrID0gT2JqZWN0LmtleXMoIGtleVN0YXRlICk7XG4gICAgICAgICAgICBmb3IgKCB2YXIgeiA9IDA7IHogPCBrLmxlbmd0aDsgeisrICkge1xuICAgICAgICAgICAgICAgIGlmICgga2V5U3RhdGVba1t6XV0gPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZmxhZyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBsb25nQnV0dG9uRGVsYXkuaXNEb25lKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ0J1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICBpZiggbXV0ZUJ1dHRvbkRlbGF5LmlzRG9uZSgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXV0ZUJ1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5LRVlTID0geyBMRUZUOiAzNywgUklHSFQ6IDM5LCBVUDogMzgsIERPV046IDQwLCBTUEFDRTogMzIsIFo6IDkwLCBYOiA4OCwgQzogNjcsIE06IDc3LCBQOiA4MCB9O1xuICAgIH07XG5cblxuXG4gICAgLy8gU09VTkRTXG4gICAgdmFyIEFyY2FkZUF1ZGlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRzID0ge307XG4gICAgICAgIHRoaXMubXV0ZSA9IE1VVEVfQVVESU87XG4gICAgfTtcblxuICAgIEFyY2FkZUF1ZGlvLnByb3RvdHlwZSA9IHtcbiAgICAgICAgYWRkIDogZnVuY3Rpb24oIGtleSwgY291bnQsIHNldHRpbmdzICkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNbIGtleSBdID0gW107XG4gICAgICAgICAgICBzZXR0aW5ncy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSwgaW5kZXggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbIGtleSBdLnB1c2goIHtcbiAgICAgICAgICAgICAgICAgICAgdGljazogMCxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBwb29sOiBbXVxuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW8uc3JjID0ganNmeHIoIGVsZW0gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbIGtleSBdWyBpbmRleCBdLnBvb2wucHVzaCggYXVkaW8gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzICk7XG4gICAgICAgIH0sXG4gICAgICAgIHBsYXkgOiBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICAgICAgaWYgKCAhdGhpcy5tdXRlICkge1xuICAgICAgICAgICAgICAgIHZhciBzb3VuZCA9IHRoaXMuc291bmRzWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB2YXIgc291bmREYXRhID0gc291bmQubGVuZ3RoID4gMSA/IHNvdW5kWyBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogc291bmQubGVuZ3RoICkgXSA6IHNvdW5kWyAwIF07XG4gICAgICAgICAgICAgICAgc291bmREYXRhLnBvb2xbIHNvdW5kRGF0YS50aWNrIF0ucGxheSgpO1xuICAgICAgICAgICAgICAgIHNvdW5kRGF0YS50aWNrIDwgc291bmREYXRhLmNvdW50IC0gMSA/IHNvdW5kRGF0YS50aWNrKysgOiBzb3VuZERhdGEudGljayA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gR0FNRSBDTEFTU0VTXG4gICAgdmFyIEJveCA9IGZ1bmN0aW9uKCBueCwgbnksIG53LCBuaCwgcGFzc3Rocm91Z2gsIGljZWJhc2UgKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSBudztcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBuaDtcbiAgICAgICAgdGhpcy54ID0gbng7XG4gICAgICAgIHRoaXMueSA9IG55O1xuICAgICAgICB0aGlzLmlzUGFzc3Rocm91Z2ggPSB7XG4gICAgICAgICAgICBib3R0b206IHBhc3N0aHJvdWdoLmJvdHRvbSB8fCBmYWxzZSxcbiAgICAgICAgICAgIGxlZnQ6IHBhc3N0aHJvdWdoLmxlZnQgfHwgZmFsc2UsXG4gICAgICAgICAgICByaWdodDogcGFzc3Rocm91Z2gucmlnaHQgfHwgZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pY2ViYXNlID0gaWNlYmFzZSB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0VtcHR5ID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgQm94LnByb3RvdHlwZSA9IHtcbiAgICAgICAgdXBkYXRlIDogZnVuY3Rpb24oKXt9LFxuICAgICAgICByZW5kZXIgOiBmdW5jdGlvbihjdHgpe1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmx1ZSc7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmx1ZSc7XG4gICAgICAgICAgICBpZiAoIHRoaXMuaXNQYXNzdGhyb3VnaC5ib3R0b20gKSB7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggdGhpcy5pc1Bhc3N0aHJvdWdoLmxlZnQgfHwgdGhpcy5pc1Bhc3N0aHJvdWdoLnJpZ2h0ICkge1xuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9ICcxJztcbiAgICAgICAgICAgIGN0eC5yZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIEhlYXJ0ID0gZnVuY3Rpb24obngsbnkpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IDE0O1xuICAgICAgICB0aGlzLmhlaWdodCA9IDE0O1xuICAgICAgICB0aGlzLnggPSBueDtcbiAgICAgICAgdGhpcy55ID0gbnk7XG4gICAgICAgIHRoaXMudmVsWCA9IDA7XG4gICAgICAgIHRoaXMudmVsWSA9IGdldFJhbmRvbUludCgxLCAyKSAvIDI7XG4gICAgICAgIHRoaXMuZnJpY3Rpb24gPSAwLjc7XG4gICAgICAgIHRoaXMudG9nZ2xlID0gZ2V0UmFuZG9tQm9vbGVhbigpO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgICAgICB0aGlzLnNpZGV3YXlzID0gZ2V0UmFuZG9tSW50KDIwLCA2MCk7XG4gICAgICAgIHRoaXMuc3R1Y2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zcHJpdGVTdHVjayA9IG5ldyBTcHJpdGUoIDcsIDgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgeyBzc3g6IDAsIHNzeTogMCwgZHVyYXRpb246IDQwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgc3N4OiAyMSwgc3N5OiAwLCBkdXJhdGlvbjogNDAwIH1dICk7XG4gICAgICAgIHRoaXMuc3ByaXRlRmx1dHRlcmluZyA9IG5ldyBTcHJpdGUoIDcsIDgsXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzc3g6IDAsIHNzeTogMCwgZHVyYXRpb246IDQwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgc3N4OiA3LCBzc3k6IDAsIGR1cmF0aW9uOiA0MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7IHNzeDogMTQsIHNzeTogMCwgZHVyYXRpb246IDQwMCB9XSk7XG4gICAgICAgIHRoaXMuc3R1Y2tDb3VudGVyID0gbnVsbDtcbiAgICB9O1xuXG4gICAgSGVhcnQucHJvdG90eXBlID0ge1xuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbihnYW1lU2l6ZSwgaGVhcnRTdG9wcGVycywgcGxheWVyKXtcblxuICAgICAgICAgICAgaWYgKCAhdGhpcy5zdHVjayAmJiAhdGhpcy5pc0RlYWQgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLnRvZ2dsZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxYICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWCAtPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb3VudGVyID4gdGhpcy5zaWRld2F5cyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUgPSAhdGhpcy50b2dnbGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2lkZXdheXMgPSBnZXRSYW5kb21JbnQoNDAsIDYwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy52ZWxYICo9IHRoaXMuZnJpY3Rpb247XG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMudmVsWDtcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy52ZWxZO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFydFN0b3BwZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggc2ltcGxlQ29sQ2hlY2sodGhpcywgaGVhcnRTdG9wcGVyc1tpXSkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMueCA8IDUgfHwgdGhpcy54ID4gKGdhbWVTaXplLndpZHRoIC0gNSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0dWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGlzLnN0dWNrICYmICF0aGlzLmlzRGVhZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFydHNpbmRhbmdlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0dWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0dWNrQ291bnRlciA9IGdldFRpbWVTdGFtcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlRmx1dHRlcmluZy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlU3R1Y2sudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy54IDwgNSB8fCB0aGlzLnggPiAoZ2FtZVNpemUud2lkdGggLSA1KSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R1Y2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGVhcnRzaW5kYW5nZXItLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoICF0aGlzLmlzRGVhZCAmJiBzaW1wbGVDb2xDaGVjayggdGhpcywgcGxheWVyKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFhLnBsYXkoJ3BpY2t1cCcpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SGVhcnRzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRIZWFydHMgPiBNQVhIRUFSVFMgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRHYW1lKCdFTkQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5zdHVjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhcnRzaW5kYW5nZXItLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgICAgICBpZiAoICF0aGlzLnN0dWNrICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlRmx1dHRlcmluZy5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgdGhpcy52ZWxYIDwgMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlU3R1Y2sucmVuZGVyKGN0eCwgdGhpcy54LCB0aGlzLnkgKTtcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuc3R1Y2tDb3VudGVyICE9PSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggbm93IC0gdGhpcy5zdHVja0NvdW50ZXIgPiAxNjAwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gJzAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBub3cgLSB0aGlzLnN0dWNrQ291bnRlciA+IDIxMDAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAnMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYXJ0c2luZGFuZ2VyLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG5vdyAtIHRoaXMuc3R1Y2tDb3VudGVyID4gMjAwMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICcxJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBub3cgLSB0aGlzLnN0dWNrQ291bnRlciA+IDE5MDAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAnMic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICggbm93IC0gdGhpcy5zdHVja0NvdW50ZXIgPiAxODAwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJzMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIG5vdyAtIHRoaXMuc3R1Y2tDb3VudGVyID4gMTcwMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICc0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBub3cgLSB0aGlzLnN0dWNrQ291bnRlciA+IDE2MDAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAnNSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCB0ZXh0LCB0aGlzLnggKyA1LCB0aGlzLnkgLSAxMCApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBIZWFydFNwcmlua2xlciA9IGZ1bmN0aW9uKGdhbWUsIGdhbWVTaXplKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMud2lkdGggPSAxOCoyO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDI2KjI7XG4gICAgICAgIHRoaXMueCA9IGdhbWVTaXplLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy55ID0gNzc7XG4gICAgICAgIHRoaXMuc3BlZWQgPSAzO1xuICAgICAgICB0aGlzLnZlbFggPSAwO1xuICAgICAgICB0aGlzLmZyaWN0aW9uID0gMC42O1xuICAgICAgICB0aGlzLmdvaW5nTGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5uZXh0U3RvcCA9IDEwOyAvLyA0MDA7XG4gICAgICAgIHRoaXMuc3ByaXRlU3RvcHBlZCA9IG5ldyBTcHJpdGUoIDE4LCAyNixcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNzeDogNzUsIHNzeTogNzMsIGR1cmF0aW9uOiAyMDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7IHNzeDogOTMsIHNzeTogNzMsIGR1cmF0aW9uOiAyMDAgfSBdKTtcbiAgICAgICAgdGhpcy5zcHJpdGVXYWxraW5nID0gbmV3IFNwcml0ZSggMTgsIDI2LFxuICAgICAgICAgICAgICAgICAgICBbIHsgc3N4OiA3NSwgc3N5OiA3MywgZHVyYXRpb246IDIwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgc3N4OiAxMTEsIHNzeTogNzMsIGR1cmF0aW9uOiAyMDAgfSBdKTtcbiAgICB9O1xuXG4gICAgSGVhcnRTcHJpbmtsZXIucHJvdG90eXBlID0ge1xuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbihnYW1lU2l6ZSl7XG5cbiAgICAgICAgICAgIGlmICggIXRoaXMuc3RvcHBlZCApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuZ29pbmdMZWZ0ICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxYID4gLXRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVsWCA8IHRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxYICo9IHRoaXMuZnJpY3Rpb247XG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMudmVsWDtcblxuICAgICAgICAgICAgICAgIGlmICggdGhpcy54ID4gZ2FtZVNpemUud2lkdGggLSAxMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxYID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLnggPCAxMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByYW5kb21seSBzdG9wIG9uY2UgaW4gYSB3aGlsZSAtIDUlXG4gICAgICAgICAgICBpZiAoICF0aGlzLnN0b3BwZWQgJiYgdGhpcy5uZXh0U3RvcCA8IDAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBnZXRSYW5kb21JbnQoMSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPiAxMDAgKXsgLy8gOTk1ICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50ZXIgPSBnZXRSYW5kb21JbnQoMTAwLCAyMDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRTdG9wID0gNDA7IC8vNDAwXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5mYWxsaW5nU3R1ZmYgPSB0aGlzLmdhbWUuZmFsbGluZ1N0dWZmLmNvbmNhdCggbmV3IEhlYXJ0KCB0aGlzLngsIHRoaXMueSApICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlU3RvcHBlZC51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5jb3VudGVyID4gMCAmJiB0aGlzLnN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ZXItLTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZVN0b3BwZWQudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLmNvdW50ZXIgPD0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlV2Fsa2luZy5zZXRGcmFtZSgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0b3AtLTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZVdhbGtpbmcudXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlciA6IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgICAgICBpZiAoIHRoaXMuc3RvcHBlZCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZVN0b3BwZWQucmVuZGVyKGN0eCwgdGhpcy54LCB0aGlzLnksICF0aGlzLmdvaW5nTGVmdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlV2Fsa2luZy5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgIXRoaXMuZ29pbmdMZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIE1PTlNURVIgQ0xBU1NFU1xuXG4gICAgdmFyIE1vbnN0ZXJCbG9jayA9IGZ1bmN0aW9uKCBueCwgbnksIG53LCBuaCwgYmxvY2tzICkge1xuICAgICAgICB0aGlzLndpZHRoID0gbnc7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gbmg7XG4gICAgICAgIHRoaXMueCA9IG54O1xuICAgICAgICB0aGlzLnkgPSBueTtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3MgfHwgW107XG4gICAgfTtcblxuICAgIE1vbnN0ZXJCbG9jay5wcm90b3R5cGUgPSB7XG4gICAgICAgIGRvZXNCbG9jayA6IGZ1bmN0aW9uKG1vbnN0ZXJOYW1lKSB7XG4gICAgICAgICAgICBpZiAoIHRoaXMuYmxvY2tzLmluZGV4T2YoIG1vbnN0ZXJOYW1lLnRvTG93ZXJDYXNlKCkgKSA+IC0xICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGZvdXIgZWxlbWVudGFsIGVuZW1pZXNcbiAgICB2YXIgQmFkR3V5ID0gZnVuY3Rpb24oZHgsZHksIHR5cGUsIGJ0eXBlLCBzcGVlZCl7XG4gICAgICAgIHRoaXMud2lkdGggPSAzMjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA2NDtcbiAgICAgICAgdGhpcy54ID0gZHg7XG4gICAgICAgIHRoaXMueSA9IGR5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlOyAvLyAwID0gZmlyZSwgMSA9IGVhcnRoLCAyID0gaWNlXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSBnZXRUaW1lU3RhbXAoKTtcbiAgICAgICAgdGhpcy5ub3cgPSBudWxsO1xuICAgICAgICB0aGlzLmdvaW5nTGVmdCA9IGdldFJhbmRvbUJvb2xlYW4oKTtcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXN0SGl0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5ibG9ja3R5cGUgPSBidHlwZTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkIHx8IDI7XG4gICAgICAgIHRoaXMudGFyZ2V0YmFzZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAndyc7XG4gICAgICAgIHRoaXMuc3ByaXRlQSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3ByaXRlQiA9IG51bGw7XG4gICAgICAgIHRoaXMuc3ByaXRlQyA9IG51bGw7XG4gICAgICAgIHRoaXMubXlibG9jayA9IG51bGw7XG4gICAgICAgIHRoaXMuZGVsYXlDb3VudGVyID0gbmV3IERlbGF5Q291bnRlcihbODAwLCA4MDAsIDIwMF0pO1xuICAgICAgICBzd2l0Y2goIHRoaXMudHlwZSApIHtcbiAgICAgICAgICAgIC8vIGZpcmUgc3ByaXRlXG4gICAgICAgICAgICBjYXNlIDAgOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQSA9IG5ldyBTcHJpdGUoIDEyLCAxNSwgWyB7IHNzeDogMzMsIHNzeTogMzMsIGR1cmF0aW9uOiAyMDAgfSwgeyBzc3g6IDQ1LCBzc3k6IDMzLCBkdXJhdGlvbjogMjAwIH0gXSApO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQiA9IG5ldyBTcHJpdGUoIDEyLCAxNSwgWyB7IHNzeDogNTcsIHNzeTogMzMsIGR1cmF0aW9uOiA1MCB9LCB7IHNzeDogNjksIHNzeTogMzMsIGR1cmF0aW9uOiA1MCB9IF0gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDMwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBzYW5kIG1vbnN0ZXJcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEgPSBuZXcgU3ByaXRlKCAxOCwgMywgWyB7IHNzeDogNjEsIHNzeTogNDksIGR1cmF0aW9uOiA1MDAgfSwgeyBzc3g6IDc5LCBzc3k6IDQ5LCBkdXJhdGlvbjogNTAwIH0gXSApO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSAxO1xuICAgICAgICAgICAgICAgIC8vIGRvd24gPSAxMzNcbiAgICAgICAgICAgICAgICAvLyB1cDEgPSA5N1xuICAgICAgICAgICAgICAgIC8vIHVwMiA9IDE1MVxuICAgICAgICAgICAgICAgIC8vIGRvd24gPSAxMzNcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUIgPSBuZXcgU3ByaXRlKCAxOCwgMTMsIFsgeyBzc3g6IDEzMywgc3N5OiAzMiwgZHVyYXRpb246IDQwMCB9IF0gKTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgNzsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUIuZnJhbWVzLnB1c2goIHsgc3N4OiA5Nywgc3N5OiAzMiwgZHVyYXRpb246IDIwMCB9ICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQi5mcmFtZXMucHVzaCggeyBzc3g6IDE1MSwgc3N5OiAzMiwgZHVyYXRpb246IDIwMCB9ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQi5mcmFtZXMucHVzaCggeyBzc3g6IDEzMywgc3N5OiAzMiwgZHVyYXRpb246IDQwMCB9ICk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVCLmZyYW1lcy5wdXNoKCB7IHNzeDogMTMzLCBzc3k6IDMyLCBkdXJhdGlvbjogMTAwIH0gKTtcblxuICAgICAgICAgICAgICAgIC8vIGF0dGFja2luZyA9IDExNVxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQyA9IG5ldyBTcHJpdGUoIDE4LCAxMywgWyB7IHNzeDogMTE1LCBzc3k6IDMyLCBkdXJhdGlvbjogMTAwIH0gXSApO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNjtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMzU7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWxheUNvdW50ZXIgPSBuZXcgRGVsYXlDb3VudGVyKFs2MDAsIDgwMCwgNDAwMCwgNDAwXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWxheUNvdW50ZXIuY3VycmVudERlbHRhID0gZ2V0UmFuZG9tSW50KDAsMyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBzbm93IG1hblxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQSA9IG5ldyBTcHJpdGUoIDEzLCAxMiwgWyB7IHNzeDogMzEsIHNzeTogNTMsIGR1cmF0aW9uOiAyMDAgfSwgeyBzc3g6IDQ0LCBzc3k6IDUzLCBkdXJhdGlvbjogMjAwIH0gXSApO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQiA9IG5ldyBTcHJpdGUoIDEzLCAxMiwgWyB7IHNzeDogNTcsIHNzeTogNTMsIGR1cmF0aW9uOiAyMDAgfSwgeyBzc3g6IDcwLCBzc3k6IDUzLCBkdXJhdGlvbjogMjAwIH0gXSApO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMjQ7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDI2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gd2luZCBkdWNrXG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdGhpcy5oYXZlQXR0YWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURpcmVjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaG9wSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhvcCA9IFsgWzAsMTBdLCBbMiwyMF0sIFsyLDIwXSwgWzIsMjBdLCBbMSwyMF0sIFswLDIwXSwgWzAsMjBdLCBbMCwyMF0sIFstMSwyMF0sIFstMiwyMF0sIFstMiwyMF0sIFstMiwyMF0gXTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuc3ByaXRlQSA9IG5ldyBTcHJpdGUoIDEzLCAxMiwgWyB7IHNzeDogMzEsIHNzeTogNTMsIGR1cmF0aW9uOiAyMDAgfSwgeyBzc3g6IDQ0LCBzc3k6IDUzLCBkdXJhdGlvbjogMjAwIH0gXSApO1xuICAgICAgICAgICAgICAgIC8vdGhpcy5zcHJpdGVCID0gbmV3IFNwcml0ZSggMTMsIDEyLCBbIHsgc3N4OiA1Nywgc3N5OiA1MywgZHVyYXRpb246IDIwMCB9LCB7IHNzeDogNzAsIHNzeTogNTMsIGR1cmF0aW9uOiAyMDAgfSBdICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEgPSBuZXcgU3ByaXRlKCAxNiwgMzIsIFsgeyBzc3g6IDQyLCBzc3k6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBzc3g6IDU4LCBzc3k6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBzc3g6IDc0LCBzc3k6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBzc3g6IDkwLCBzc3k6IDAgfSBdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIEJhZEd1eS5wcm90b3R5cGUgPSB7XG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oIG1vbnN0ZXJibG9ja2VycywgcGxheWVyLCB0aGluZ3MsIGljZWJsb2NrYmFzZXMgKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9uc3RlcmJsb2NrZXJzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIGlmICggc2ltcGxlQ29sQ2hlY2sodGhpcywgbW9uc3RlcmJsb2NrZXJzW2ldICkgJiYgbW9uc3RlcmJsb2NrZXJzW2ldLmRvZXNCbG9jayh0aGlzLmJsb2NrdHlwZSkgJiYgdGhpcy5sYXN0SGl0ICE9PSBtb25zdGVyYmxvY2tlcnNbaV0pIHsgLy8gcHV0IHRoaXMgYml0IGJhY2sgaW4gLSByZXNldCBpdCBpbiBzdGF0ZXMgYmVsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nb2luZ0xlZnQgPSAhdGhpcy5nb2luZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEhpdCA9IG1vbnN0ZXJibG9ja2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnR5cGUgPT09IDIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY29sbGlzaW9uICcgKyB0aGlzLnN0YXRlICsgJyAtICcgKyB0aGlzLmdvaW5nTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goIHRoaXMuc3RhdGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaGInOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgYW4gaWNlIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAncGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVkID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5teWJsb2NrID0gc3Bhd25BVGhpbmcoICh0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIDI1OiB0aGlzLnggKyB0aGlzLndpZHRoICsgMSksIHRoaXMueSAtIDQsIDQsIHRoaXMuZ29pbmdMZWZ0LCBmYWxzZSwgZmFsc2UsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkaic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5teWJsb2NrICE9PSBudWxsICYmICF0aGlzLm15YmxvY2suaXNEZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm15YmxvY2suaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXlibG9jayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd3JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVlZCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmdvaW5nTGVmdCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IC02MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IDEwMzA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmdvaW5nTGVmdCA9ICF0aGlzLmdvaW5nTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd3JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVlZCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy50eXBlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaXJlR3V5KG1vbnN0ZXJibG9ja2VycywgcGxheWVyLCB0aGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRWFydGhHdXkobW9uc3RlcmJsb2NrZXJzLCBwbGF5ZXIsIHRoaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJY2VHdXkobW9uc3RlcmJsb2NrZXJzLCBwbGF5ZXIsIHRoaW5ncywgaWNlYmxvY2tiYXNlcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVEdWNrKG1vbnN0ZXJibG9ja2VycywgcGxheWVyLCB0aGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlRHVjazogZnVuY3Rpb24oIG1vbnN0ZXJibG9ja2VycywgcGxheWVyLCB0aGluZ3MgKSB7XG4gICAgICAgICAgICBpZiggdGhpcy50Y29sY2hlY2soIFtcIjZcIl0sIFsgXCIyXCIsIFwiM1wiLCBcIjVcIiwgXCI2XCIsIFwiN1wiIF0sIHRoaW5ncykgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ub3cgPSBnZXRUaW1lU3RhbXAoKTtcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5zdGF0ZSApIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSArPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnkgPiAxMDAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vIGhvcHBpbmcgZHVja1xuICAgICAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEuc2V0RnJhbWUoMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuaXNEZWFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLm5vdyAtIHRoaXMubGFzdE1vdmUgPiB0aGlzLmhvcFt0aGlzLmhvcEhlaWdodF1bMV0gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmdvaW5nTGVmdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54IC09IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSAtPSB0aGlzLmhvcFt0aGlzLmhvcEhlaWdodF1bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54ICs9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSAtPSB0aGlzLmhvcFt0aGlzLmhvcEhlaWdodF1bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9wSGVpZ2h0Kys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuaG9wSGVpZ2h0ID49IHRoaXMuaG9wLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3BIZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmNoYW5nZURpcmVjdGlvbiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gIXRoaXMuZ29pbmdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEaXJlY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5jaGVja0ZvclBsYXllcihwbGF5ZXIsIDgwMCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2wnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3BDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmUgPSB0aGlzLm5vdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlID0gdGhpcy5ub3c7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgY29sbGlzc2lvbiB3aXRoIG1vbnN0ZXIgYmxvY2tlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vbnN0ZXJibG9ja2Vycy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBzaW1wbGVDb2xDaGVjayh0aGlzLCBtb25zdGVyYmxvY2tlcnNbaV0gKSAmJiBtb25zdGVyYmxvY2tlcnNbaV0uZG9lc0Jsb2NrKCd3ZCcpICYmIHRoaXMubGFzdEhpdCAhPT0gbW9uc3RlcmJsb2NrZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXQgPSBtb25zdGVyYmxvY2tlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURpcmVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuaG9wQ291bnRlciA+IDEzICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAncyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZSA9IHRoaXMubm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gbG9va2luZyBhcm91bmRcbiAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgcGxheWVyIGNvbGxpZGVzIHdpdGggYWxhcm0gYm94XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5jaGVja0ZvclBsYXllcihwbGF5ZXIsIDgwMCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2wnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3BDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmUgPSB0aGlzLm5vdztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy5ub3cgLSB0aGlzLmxhc3RNb3ZlID4gMTMwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhY2sgdG8gaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW92ZSA9IHRoaXMubm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd3JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9wQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhdmVBdHRhY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLm5vdyAtIHRoaXMubGFzdE1vdmUgPiA5MDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29rIHJpZ2h0IGFnYWluXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEuc2V0RnJhbWUoMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMubm93IC0gdGhpcy5sYXN0TW92ZSA+IDMwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQS5zZXRGcmFtZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAvLyBhbGFybVxuICAgICAgICAgICAgICAgIGNhc2UgJ2wnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEuc2V0RnJhbWUoMik7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5ub3cgLSB0aGlzLmxhc3RNb3ZlID4gNTAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdhJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmUgPSB0aGlzLm5vdztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGF2ZUF0dGFja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNrXG4gICAgICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuaGF2ZUF0dGFja2VkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWEucGxheSgnY2hlZXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhdmVBdHRhY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEuc2V0RnJhbWUoMyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubm93IC0gdGhpcy5sYXN0TW92ZSA+IDEwMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlID0gdGhpcy5ub3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3BDb3VudGVyID0gMTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhdmVBdHRhY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVGaXJlR3V5OiBmdW5jdGlvbiggbW9uc3RlcmJsb2NrZXJzLCBwbGF5ZXIsIHRoaW5ncyApIHtcbiAgICAgICAgICAgIGlmKCB0aGlzLnRjb2xjaGVjayggW1wiN1wiXSwgWyBcIjJcIiwgXCIzXCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIgXSwgdGhpbmdzKSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2QnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMuc3RhdGUgKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnkgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy55ID4gMTAwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53YWxrTGVmdFJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICggdGhpcy5kZWxheUNvdW50ZXIuZ2V0U3RhZ2UoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHBsYXllciBpbiBzaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmNoZWNrRm9yUGxheWVyKHBsYXllciwgMTAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnYSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxheUNvdW50ZXIucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUIudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoIHRoaXMuZGVsYXlDb3VudGVyLmdldFN0YWdlKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gYXR0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsYXlDb3VudGVyLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGNvbGNoZWNrIDogZnVuY3Rpb24oIHQsIGt0LCB0aGluZ3MgKSB7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpbmdzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIGlmKCAhdGhpbmdzW2ldLmlzRGVhZCAmJiBzaW1wbGVDb2xDaGVjayh0aGlzLCB0aGluZ3NbaV0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBrdC5pbmRleE9mKCBcIlwiICsgdGhpbmdzW2ldLnR5cGUgKSA+IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpbmdzW2ldLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIHQuaW5kZXhPZiggXCJcIiArIHRoaW5nc1tpXS50eXBlICkgPiAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVJY2VHdXk6IGZ1bmN0aW9uKCBtb25zdGVyYmxvY2tlcnMsIHBsYXllciwgdGhpbmdzLCBpY2ViYXNlcyApIHtcbiAgICAgICAgICAgIHRoaXMud2Fsa0xlZnRSaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVBLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVCLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiggdGhpcy50Y29sY2hlY2soIFtcIjVcIl0sIFsgXCIyXCIsIFwiM1wiLCBcIjVcIiwgXCI2XCIsIFwiN1wiIF0sIHRoaW5ncykgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ICs9IDM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMueSA+IDEwMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8ganVzdCB3YWxraW5nXG4gICAgICAgICAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZG9odXJyeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBzaW1wbGVDb2xDaGVjayh0aGlzLCBpY2ViYXNlc1sxMl0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGljZWJhc2VzWzEyXS5pc0VtcHR5ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2h1cnJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdGhpbmdzLmxlbmd0aDsgaisrICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXRoaW5nc1tqXS5pc0RlYWQgJiYgdGhpbmdzW2pdLnR5cGUgPT09IDQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2ltcGxlQ29sQ2hlY2sodGhpcywgdGhpbmdzW2pdICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2h1cnJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvaHVycnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2hiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVkID0gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdvaW5nTGVmdCA9ICF0aGlzLmdvaW5nTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RIaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0YmFzZSA9IDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljZWJhc2VzWzEyXS5pc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnggPCAxNTAgfHwgdGhpcy54ID4gODQwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gcHVzaGluZyBibG9jayBvZiBpY2VcbiAgICAgICAgICAgICAgICBjYXNlICdwYic6XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbmVqb2IgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubXlibG9jayAhPT0gbnVsbCAmJiAhdGhpcy5teWJsb2NrLmlzRGVhZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5teWJsb2NrLnB1c2goIHRoaXMuZ29pbmdMZWZ0ICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lam9iID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gWyBcIjJcIiwgXCIzXCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZG9uZWpvYiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpbmdzLmxlbmd0aDsgaisrICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXRoaW5nc1tqXS5pc0RlYWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpbmdzW2pdLnR5cGUgPT09IDQgJiYgdGhpcy5teWJsb2NrICE9PSB0aGluZ3Nbal0gJiYgc2ltcGxlQ29sQ2hlY2sodGhpcy5teWJsb2NrLCB0aGluZ3Nbal0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVqb2IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHQuaW5kZXhPZiggXCJcIiArIHRoaW5nc1tqXS50eXBlICkgPiAtMSAmJiBzaW1wbGVDb2xDaGVjayh0aGlzLm15YmxvY2ssIHRoaW5nc1tqXSApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpbmdzW2pdLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaW5nc1tqXS50eXBlID09PSA1ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXlibG9jay5pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5teWJsb2NrLmZsYWdnZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljZWJhc2VzWzEyXS5pc0VtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBpY2ViYXNlcy5sZW5ndGg7IGsrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHNpbXBsZUNvbENoZWNrKHRoaXMsIGljZWJhc2VzW2tdICkgJiYgayA9PT0gdGhpcy50YXJnZXRiYXNlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm15YmxvY2suZmxhZ2dlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVqb2IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIGRvbmVqb2IgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2RqJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRiYXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gIXRoaXMuZ29pbmdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0SGl0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXlibG9jayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlRWFydGhHdXk6IGZ1bmN0aW9uKCBtb25zdGVyYmxvY2tlcnMsIHBsYXllciwgdGhpbmdzICkge1xuICAgICAgICAgICAgdGhpcy53YWxrTGVmdFJpZ2h0KCk7XG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMuc3RhdGUgKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuZGVsYXlDb3VudGVyLmdldFN0YWdlKCkgPiAyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd1cCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDI2O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55IC09IDE5O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVCLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUIudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5zcHJpdGVCLmdldEZyYW1lKCkgPiAwICYmIHRoaXMuc3ByaXRlQi5nZXRGcmFtZSgpIDwgMTYgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuY2hlY2tGb3JQbGF5ZXIocGxheWVyLCA4MCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2EnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsYXlDb3VudGVyLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnNwcml0ZUIuZ2V0RnJhbWUoKSA+IDE1ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd3JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSArPSAxOTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gNjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsYXlDb3VudGVyLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmRlbGF5Q291bnRlci5nZXRTdGFnZSgpID09PSAxICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Bhd25BVGhpbmcoICh0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIDUgOiB0aGlzLnggKyB0aGlzLndpZHRoIC0gNSksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAzLCB0aGlzLmdvaW5nTGVmdCwgdHJ1ZSwgdHJ1ZSwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAndXAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxheUNvdW50ZXIucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd2Fsa0xlZnRSaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoICF0aGlzLmlzRGVhZCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdyA9IGdldFRpbWVTdGFtcCgpO1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy5ub3cgLSB0aGlzLmxhc3RNb3ZlID4gMTAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5nb2luZ0xlZnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnggLT0gdGhpcy5zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmUgPSB0aGlzLm5vdztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gMiAmJiB0aGlzLnN0YXRlID09PSAncGInICYmIHRoaXMubXlibG9jayAhPT0gbnVsbCAmJiAhdGhpcy5teWJsb2NrLmlzRGVhZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5teWJsb2NrLnB1c2goIHRoaXMuZ29pbmdMZWZ0ICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbihjdHgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAndyc7XG4gICAgICAgICAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5teWJsb2NrID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0YmFzZSA9IG51bGw7XG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMudHlwZSApIHtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gMzY3O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcENvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcEhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54ID0gLTUwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnkgPSA3MDU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gNTc1O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMueSA9IDI1MTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy50eXBlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RmlyZUd1eShjdHgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0VhcnRoR3V5KGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3SWNlR3V5KGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RHVjayhjdHgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZHJhd0R1Y2s6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVBLnJlbmRlcihjdHgsIHRoaXMueCwgdGhpcy55LCAhdGhpcy5nb2luZ0xlZnQgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJhd0ZpcmVHdXk6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEucmVuZGVyKGN0eCwgdGhpcy54LCB0aGlzLnksICF0aGlzLmdvaW5nTGVmdCApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVCLnJlbmRlcihjdHgsIHRoaXMueCwgdGhpcy55LCAhdGhpcy5nb2luZ0xlZnQgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRyYXdJY2VHdXk6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUEucmVuZGVyKGN0eCwgdGhpcy54LCB0aGlzLnksICF0aGlzLmdvaW5nTGVmdCApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdoYic6XG4gICAgICAgICAgICAgICAgY2FzZSAncGInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2RqJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVCLnJlbmRlcihjdHgsIHRoaXMueCwgdGhpcy55LCAhdGhpcy5nb2luZ0xlZnQgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgZHJhd0VhcnRoR3V5OiBmdW5jdGlvbihjdHgpIHtcbiAgICAgICAgICAgIC8vY3R4LmZpbGxTdHlsZSA9ICd5ZWxsb3cnO1xuICAgICAgICAgICAgLy9jdHguZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVBLnJlbmRlcihjdHgsIHRoaXMueCwgdGhpcy55LCAhdGhpcy5nb2luZ0xlZnQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQi5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgIXRoaXMuZ29pbmdMZWZ0ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQy5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgIXRoaXMuZ29pbmdMZWZ0ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaGVja0ZvclBsYXllcjogZnVuY3Rpb24ocGxheWVyLCBkaXN0YW5jZSkge1xuICAgICAgICAgICAgaWYgKCAhdGhpcy5nb2luZ0xlZnQgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzaW1wbGVDb2xDaGVjayggcGxheWVyLCB7IHg6IHRoaXMueCwgeTogKHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMiksIHdpZHRoOiBkaXN0YW5jZSwgaGVpZ2h0OiAyIH0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNpbXBsZUNvbENoZWNrKCBwbGF5ZXIsIHsgeDogdGhpcy54IC0gZGlzdGFuY2UsIHk6ICh0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDIpLCB3aWR0aDogZGlzdGFuY2UsIGhlaWdodDogMiB9ICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy50eXBlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhyZWUgZmlyZWJhbGxzXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvcndhcmRcbiAgICAgICAgICAgICAgICAgICAgc3Bhd25BVGhpbmcoICh0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIHRoaXMud2lkdGggLSA1IDogdGhpcy54ICsgdGhpcy53aWR0aCArIDUpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMiwgdGhpcy5nb2luZ0xlZnQsIHRydWUsIHRydWUsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpYWcgdXBcbiAgICAgICAgICAgICAgICAgICAgc3Bhd25BVGhpbmcoICh0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIHRoaXMud2lkdGggLSA1IDogdGhpcy54ICsgdGhpcy53aWR0aCArIDUpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMiwgdGhpcy5nb2luZ0xlZnQsIHRydWUsIHRydWUsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlhZyBkb3duXG4gICAgICAgICAgICAgICAgICAgIHNwYXduQVRoaW5nKCAodGhpcy5nb2luZ0xlZnQgPyB0aGlzLnggLSB0aGlzLndpZHRoIC0gNSA6IHRoaXMueCArIHRoaXMud2lkdGggKyA1KSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDIsIHRoaXMuZ29pbmdMZWZ0LCBmYWxzZSwgdHJ1ZSwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHNwYXduQVRoaW5nKCB0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIHRoaXMud2lkdGggLSAxMCA6IHRoaXMueCArIHRoaXMud2lkdGggKyAxMCwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDEsIHRoaXMuZ29pbmdMZWZ0LCBmYWxzZSwgdHJ1ZSwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIFRoaW5nZWUgPSBmdW5jdGlvbihkeCxkeSxkdHlwZSxhLGIsYyxkKSB7XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IDMyO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDY0O1xuICAgICAgICB0aGlzLnggPSBkeDtcbiAgICAgICAgdGhpcy55ID0gZHk7XG4gICAgICAgIHRoaXMudHlwZSA9IGR0eXBlO1xuICAgICAgICB0aGlzLmxpZmVzcGFuID0gMTAwMDtcbiAgICAgICAgdGhpcy5nb2luZ0xlZnQgPSBhIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmdvaW5nVXAgPSBiIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLm1vdmVIb3JpeiA9IGMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMubW92ZVZlcnQgPSBkIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLnNwYXduVGltZSA9IGdldFRpbWVTdGFtcCgpO1xuICAgICAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZlbFggPSAwO1xuICAgICAgICB0aGlzLnZlbFkgPSAwO1xuICAgICAgICB0aGlzLnNwZWVkID0gMTtcbiAgICAgICAgdGhpcy5mcmljdGlvbiA9IDAuOTtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgICAgICB0aGlzLmZsdWN0dWF0b3JYID0gMDtcbiAgICAgICAgdGhpcy5mbHVjdHVhdG9yWSA9IDU7XG4gICAgICAgIHRoaXMuZFggPSAtMTtcbiAgICAgICAgdGhpcy5kWSA9IC0xO1xuICAgICAgICB0aGlzLmlzUGFzc3Rocm91Z2ggPSB7fTtcbiAgICAgICAgdGhpcy5mbGFnZ2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYSc7IC8vYWxpdmVcblxuICAgICAgICBzd2l0Y2ggKCB0aGlzLnR5cGUgKSB7XG4gICAgICAgICAgICAvLyB3aGlybHdpbmRcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLmxpZmVzcGFuID0gMzUwMDtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLSB0aGlzLmhlaWdodCAtIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZCA9IDM7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUgPSBuZXcgU3ByaXRlKCAxNiwgMzIsXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzc3g6IDAsIHNzeTogNDAsIGR1cmF0aW9uOiAxMDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7IHNzeDogMTUsIHNzeTogNDAsIGR1cmF0aW9uOiAxMDAgfSAgXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBmaXJlYmFsbFxuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXMubGlmZXNwYW4gPSAzNTAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSA0O1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlID0gbmV3IFNwcml0ZSggNywgNywgWyB7IHNzeDogODEsIHNzeTogMzQgfSBdKTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLSAxODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIHJvY2tcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkID0gMjtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICB0aGlzLmxpZmVzcGFuID0gMjAwMDtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkID0gNDtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZSA9IG5ldyBTcHJpdGUoIDgsIDcsIFsgeyBzc3g6IDg4LCBzc3k6IDM0IH0gXSk7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gdGhpcy55IC0gMTg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBlbmVteSBpY2VibG9ja1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXMubGlmZXNwYW4gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlID0gbmV3IFNwcml0ZSggMTIsIDI5LCBbIHsgc3N4OiAxMDYsIHNzeTogMCB9IF0pO1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IHRoaXMueSAtIDMwO1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAyNDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUGFzc3Rocm91Z2ggPSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByaWdodDogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gc25vd2JhbGxcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICB0aGlzLmxpZmVzcGFuID0gMzUwMDtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkID0gNTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZSA9IG5ldyBTcHJpdGUoIDcsIDcsIFsgeyBzc3g6IDgzLCBzc3k6IDUzIH0gXSk7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gdGhpcy55IC0gMTg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgVGhpbmdlZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oIHBsYXllciwgYmxvY2tzLCB0aGluZ3MgKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5zdGF0ZSApIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gMCBsaWZlc3BhbiA9IGRvZXNuJ3QgZXhwaXJlXG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5saWZlc3BhbiA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG5vdyAtIHRoaXMuc3Bhd25UaW1lID4gdGhpcy5saWZlc3BhbiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmZsYWdnZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhZ2dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbMTJdLmlzRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMubW92ZUhvcml6ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmdvaW5nTGVmdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxYID4gLXRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxYLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxYIDwgdGhpcy5zcGVlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLm1vdmVWZXJ0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmdvaW5nVXAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVsWSA+IC10aGlzLnNwZWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVsWSA8IHRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxZKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWCAqPSB0aGlzLmZyaWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFkgKj0gdGhpcy5mcmljdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMudmVsWDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMudmVsWTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuaXNEZWFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICggdGhpcy50eXBlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaXJsd2luZCBncmFicyBwbGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2ltcGxlQ29sQ2hlY2soIHBsYXllciwgdGhpcyApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdyYWJiZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnggPSB0aGlzLnggKyB0aGlzLmZsdWN0dWF0b3JYO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnkgPSB0aGlzLnkgLSAxNSArIHRoaXMuZmx1Y3R1YXRvclk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuanVtcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHVjdHVhdG9yWCArPSB0aGlzLmRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdWN0dWF0b3JZICs9IHRoaXMuZFk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmZsdWN0dWF0b3JYIDwgLTggfHwgdGhpcy5mbHVjdHVhdG9yWCA+IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZFggKj0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmZsdWN0dWF0b3JZIDwgLTIwIHx8IHRoaXMuZmx1Y3R1YXRvclkgPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRZICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcmViYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcm9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2ltcGxlQ29sQ2hlY2soIHBsYXllciwgdGhpcyApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnN0YXRlID0gJ2QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGluZ3NbaV0uaXNEZWFkICYmIHRoaW5nc1tpXS50eXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBzaW1wbGVDb2xDaGVjayggdGhpcywgdGhpbmdzW2ldICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaW5nc1tpXS5zdGF0ZSA9ICdkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2lsbCBpdCBpZiByZWFjaGVzIGVkZ2Ugb2Ygc2NyZWVuLCBleGNlcHQgZm9yIGljZWJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnR5cGUgIT09IDQgJiYgKHRoaXMueCA8IC01IHx8IHRoaXMueCA+IDEwMjggfHwgdGhpcy55IDwgLTUgfHwgdGhpcy55ID4gODAwICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy50eXBlID09PSA0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmZsYWdnZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhZ2dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbMTJdLmlzRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnkgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnkgPiA4MDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRGVhZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgICAgIC8vY3R4LmZpbGxTdHlsZSA9ICd5ZWxsb3cnO1xuICAgICAgICAgICAgLy9jdHguZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnJlbmRlcihjdHgsIHRoaXMueCwgdGhpcy55LCB0aGlzLmdvaW5nTGVmdCApO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoOiBmdW5jdGlvbiggbGVmdCApIHtcbiAgICAgICAgICAgIGlmICggbGVmdCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnggLT0gdGhpcy5zcGVlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc3Bhd25BVGhpbmcgPSBmdW5jdGlvbiggc3gsIHN5LCBzdHlwZSwgc2dvaW5nbGVmdCwgc2dvaW5ndXAsIG1vdmVoLCBtb3ZldiApIHtcbiAgICAgICAgdmFyIHRoaW5nID0gbmV3IFRoaW5nZWUoc3gsIHN5LCBzdHlwZSwgc2dvaW5nbGVmdCwgc2dvaW5ndXAsIG1vdmVoLCBtb3ZldiApO1xuICAgICAgICB0aGVHYW1lLnRoaW5ncyA9IHRoZUdhbWUudGhpbmdzLmNvbmNhdCggdGhpbmcgKTtcbiAgICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG5cbiAgICAvLyBQTEFZRVJcblxuICAgIHZhciBQbGF5ZXIgPSBmdW5jdGlvbihnYW1lLCBnYW1lU2l6ZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDU0O1xuICAgICAgICB0aGlzLndpZHRoID0gMzA7XG4gICAgICAgIHRoaXMueCA9IGdhbWVTaXplLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy55ID0gZ2FtZVNpemUuaGVpZ2h0IC0gNTA7XG5cbiAgICAgICAgdGhpcy5rZXlib2FyZGVyID0gbmV3IEtleWJvYXJkZXIoKTtcblxuICAgICAgICB0aGlzLnNwZWVkID0gMztcbiAgICAgICAgdGhpcy52ZWxYID0gMDtcbiAgICAgICAgdGhpcy52ZWxZID0gMDtcbiAgICAgICAgdGhpcy5mcmljdGlvbiA9IDAuOTtcbiAgICAgICAgdGhpcy5qdW1waW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmZhbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ncmF2aXR5ID0gMC4zO1xuXG4gICAgICAgIHRoaXMuZ3JhYmJlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3ByaXRlU3RvcHBlZCA9IG5ldyBTcHJpdGUoIDE1LCAyNyxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNzeDogNjAsIHNzeTogNzIgfSBdKTtcbiAgICAgICAgdGhpcy5zcHJpdGVXYWxraW5nID0gbmV3IFNwcml0ZSggMTUsIDI3LFxuICAgICAgICAgICAgICAgICAgICBbIHsgc3N4OiA2MCwgc3N5OiA3MiwgZHVyYXRpb246IDEwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgc3N4OiAxMjksIHNzeTogNzIsIGR1cmF0aW9uOiAxMDAgfVxuICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgIC8qIHRoaXMuc3ByaXRlU2hvb3RpbmcgPSBuZXcgU3ByaXRlKCAxNywgMjcsXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzc3g6IDE0Niwgc3N5OiA3MiwgZHVyYXRpb246IDUwIH0gXSk7ICovXG4gICAgICAgIHRoaXMuc3ByaXRlRHlpbmcgPSBuZXcgU3ByaXRlKCAyNCwgMjcsXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzc3g6IDExOCwgc3N5OiAwIH0gXSk7XG4gICAgICAgIHRoaXMuc3ByaXRlSnVtcGluZyA9IG5ldyBTcHJpdGUoIDIwLCAyOSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNzeDogMTQyLCBzc3k6IDAsIGR1cmF0aW9uOiA1MCB9IF0pO1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3cnO1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlID0ge1xuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGdhbWVTaXplLCBib3hlcywgaGVhcnRzLCB0aGluZ3MpIHtcblxuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWJiZWQgJiYgKHRoaXMua2V5Ym9hcmRlci5pc0Rvd24odGhpcy5rZXlib2FyZGVyLktFWVMuTEVGVCkgfHwgdGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5SSUdIVCkpICYmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLlVQKSB8fCB0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLlNQQUNFKSB8fCB0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLlopKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWJiZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLkxFRlQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxYID4gLXRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLlJJR0hUKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVsWCA8IHRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ29pbmdMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5VUCkgfHwgdGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5TUEFDRSkgfHwgdGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5aKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGp1bXAgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5qdW1waW5nICYmIHRoaXMuZ3JvdW5kZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFsbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWSA9IC10aGlzLnNwZWVkICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYS5wbGF5KCdqdW1wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5ET1dOKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdvIGRvd24gdGhlIHN0YWlyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmp1bXBpbmcgJiYgdGhpcy5ncm91bmRlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmp1bXBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFsbGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFkgPSB0aGlzLnNwZWVkICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKHRoaXMua2V5Ym9hcmRlci5LRVlTLlgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBwYXVzZUJ1dHRvbkRlbGF5LmlzRG9uZSgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN3aXRjaCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRFbGVtZW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmdhbWUuY3VycmVudEVsZW1lbnQgPiAyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY3VycmVudEVsZW1lbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXVzZUJ1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRlci5pc0Rvd24odGhpcy5rZXlib2FyZGVyLktFWVMuQykgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJlL3VzZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHBhdXNlQnV0dG9uRGVsYXkuaXNEb25lKCkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Bhd25BVGhpbmcoICh0aGlzLmdvaW5nTGVmdCA/IHRoaXMueCAtIDY6IHRoaXMueCArIHRoaXMud2lkdGggLSA2KSwgdGhpcy55ICsgNDUsIDUgKyB0aGlzLmdhbWUuY3VycmVudEVsZW1lbnQsIHRoaXMuZ29pbmdMZWZ0LCBmYWxzZSwgdHJ1ZSwgZmFsc2UgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdXNlQnV0dG9uRGVsYXkucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtdXRlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRlci5pc0Rvd24odGhpcy5rZXlib2FyZGVyLktFWVMuTSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggbXV0ZUJ1dHRvbkRlbGF5LmlzRG9uZSgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWEubXV0ZSA9ICFhYS5tdXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXV0ZUJ1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5QKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwYXVzZUJ1dHRvbkRlbGF5LmlzRG9uZSgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUEFVU0UgPSAhUEFVU0U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXVzZUJ1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICovXG5cbiAgICAgICAgICAgICAgICB0aGlzLnZlbFggKj0gdGhpcy5mcmljdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLnZlbFkgKz0gdGhpcy5ncmF2aXR5O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm94ZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlyID0gY29sQ2hlY2sodGhpcywgYm94ZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXIgPT09ICdsJyB8fCBkaXIgPT09ICdyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gJ2InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAndCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWSAqPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGluZ3NbaV0uaXNEZWFkICYmIHRoaW5nc1tpXS50eXBlID09PSA0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpciA9IGNvbENoZWNrKHRoaXMsIHRoaW5nc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXIgPT09ICdsJyB8fCBkaXIgPT09ICdyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVsWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1waW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gJ2InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1waW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpciA9PT0gJ3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWxZICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCl7XG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnZlbFkgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnZlbFg7XG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMudmVsWTtcblxuICAgICAgICAgICAgICAgIGlmICggdGhpcy54IDwgLSAodGhpcy53aWR0aCAtIDIpICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnggPSBnYW1lU2l6ZS53aWR0aCAtIDM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCB0aGlzLnggPiBnYW1lU2l6ZS53aWR0aCAtIDIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMueCA9ICh0aGlzLndpZHRoIC0gMykgKiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoKCB0aGlzLnZlbFggPiAwLjEgfHwgdGhpcy52ZWxYIDwgLTAuMSApICYmICF0aGlzLmp1bXBpbmcgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVXYWxraW5nLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgIHRoaXMueSArPSAzO1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy55ID4gMTAwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kR2FtZSgnRElFJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KSB7XG4gICAgICAgICAgICAvL2lmICggdGhpcy5nb2luZ0xlZnQgKSB7XG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMuc3RhdGUgKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5qdW1waW5nIHx8IHRoaXMuZmFsbGluZyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlSnVtcGluZy5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgIXRoaXMuZ29pbmdMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlV2Fsa2luZy5yZW5kZXIoY3R4LCB0aGlzLngsIHRoaXMueSwgIXRoaXMuZ29pbmdMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlRHlpbmcucmVuZGVyKGN0eCwgdGhpcy54LCB0aGlzLnksICF0aGlzLmdvaW5nTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIENPREUgU1RBUlRTIEhFUkVcbiAgICB2YXIgR2FtZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIG1heWJlIHNvbWUgb3RoZXIgZGF5XG4gICAgICAgIC8vIHZhciBnYW1lcGFkU3VwcG9ydEF2YWlsYWJsZSA9ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdhbWVwYWRzO1xuXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWMnKTtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAvLyBkb24ndCB5b3UgZGFyZSBBQSBteSBwaXhlbGFydCFcbiAgICAgICAgY29udGV4dC5tb3pJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgY29udGV4dC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgY29udGV4dC5tc0ltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICBjb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBnYW1lU2l6ZSA9IHsgd2lkdGg6IGNhbnZhcy53aWR0aCwgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0IH07XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdMT0FESU5HJztcbiAgICAgICAgdGhpcy50aXRsZXNjcmVlbkJsaW5rID0gbmV3IERlbGF5Q291bnRlcihbNTAwLDUwMF0pO1xuICAgICAgICB0aGlzLmtleWJvYXJkZXIgPSBuZXcgS2V5Ym9hcmRlcigpO1xuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcywgZ2FtZVNpemUpO1xuXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuZW5lbWllcy5jb25jYXQobmV3IEJhZEd1eSggMjAwICsgZ2V0UmFuZG9tSW50KDAsIDIwKSwgMjUxLCAwLCAnZmcnLCAyICkpOyAvLyBmaXJlXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuZW5lbWllcy5jb25jYXQobmV3IEJhZEd1eSggNzAwICsgZ2V0UmFuZG9tSW50KDAsIDIwKSwgMjUxLCAwLCAnZmcnLCAyICkpOyAvLyBmaXJlXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuZW5lbWllcy5jb25jYXQobmV3IEJhZEd1eSggMTAwLCAzNjcsIDMsICd3ZCcsIDAgKSk7IC8vIHdpbmRcbiAgICAgICAgLy8gdGhpcy5lbmVtaWVzID0gdGhpcy5lbmVtaWVzLmNvbmNhdChuZXcgV2luZER1Y2soIDIwMCwgMzY3ICkpOyAgLy8gd2luZFxuICAgICAgICB0aGlzLmVuZW1pZXMgPSB0aGlzLmVuZW1pZXMuY29uY2F0KG5ldyBCYWRHdXkoIDIwMCArIGdldFJhbmRvbUludCgwLCAyMCksIDU3NSwgMSwgJ2VnJywgMSApKTsgLy8gZWFydGggNTE4XG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuZW5lbWllcy5jb25jYXQobmV3IEJhZEd1eSggODAwICsgZ2V0UmFuZG9tSW50KDAsIDIwKSwgNTc1LCAxLCAnZWcnLCAxICkpOyAvLyBlYXJ0aCA1MThcbiAgICAgICAgdGhpcy5lbmVtaWVzID0gdGhpcy5lbmVtaWVzLmNvbmNhdChuZXcgQmFkR3V5KCAtNTAsIDcwNSwgMiwgJ2lnJywgMSApKTsgLy8gaWNlXG5cbiAgICAgICAgdGhpcy50aGluZ3MgPSBbXTtcblxuICAgICAgICB2YXIgbW9uc3RlcmJsb2NrZXJzID0gW107XG5cbiAgICAgICAgLy8gYmxvY2tzIDMgZWxlbWVudCBtb25zdGVycywgbm90IGljZSBtb25zdGVyXG4gICAgICAgIG1vbnN0ZXJibG9ja2VycyA9IG1vbnN0ZXJibG9ja2Vycy5jb25jYXQoIG5ldyBNb25zdGVyQmxvY2soIDEwLCAxNTAsIDEwLCA0NTAsIFsnd2QnLCAnd3cnLCAnZmcnLCAnZmInLCAnZWcnLCAncm8nXSkgKTtcbiAgICAgICAgbW9uc3RlcmJsb2NrZXJzID0gbW9uc3RlcmJsb2NrZXJzLmNvbmNhdCggbmV3IE1vbnN0ZXJCbG9jayggMTAwMCwgMTUwLCAxMCwgNDUwLCBbJ3dkJywgJ3d3JywgJ2ZnJywgJ2ZiJywgJ2VnJywgJ3JvJ10pICk7XG5cbiAgICAgICAgLy8gZmlyZSBndXlzXG4gICAgICAgIG1vbnN0ZXJibG9ja2VycyA9IG1vbnN0ZXJibG9ja2Vycy5jb25jYXQoIG5ldyBNb25zdGVyQmxvY2soIDM0NSwgMTUwLCAxMCwgMTMwLCBbJ2ZnJ10pICk7XG4gICAgICAgIG1vbnN0ZXJibG9ja2VycyA9IG1vbnN0ZXJibG9ja2Vycy5jb25jYXQoIG5ldyBNb25zdGVyQmxvY2soIDY3MiwgMTUwLCAxMCwgMTMwLCBbJ2ZnJ10pICk7XG5cbiAgICAgICAgLy8gZWFydGggZ3V5c1xuICAgICAgICBtb25zdGVyYmxvY2tlcnMgPSBtb25zdGVyYmxvY2tlcnMuY29uY2F0KCBuZXcgTW9uc3RlckJsb2NrKCA1MDAsIDQ1MCwgMTAsIDEzMCwgWydlZyddKSApO1xuICAgICAgICBtb25zdGVyYmxvY2tlcnMgPSBtb25zdGVyYmxvY2tlcnMuY29uY2F0KCBuZXcgTW9uc3RlckJsb2NrKCA1OTUsIDQ1MCwgMTAsIDEzMCwgWydlZyddKSApO1xuXG4gICAgICAgIC8vIGljZSBtb25zdGVyc1xuICAgICAgICBtb25zdGVyYmxvY2tlcnMgPSBtb25zdGVyYmxvY2tlcnMuY29uY2F0KCBuZXcgTW9uc3RlckJsb2NrKCAtODAsIDYwMCwgMTAsIDEzMCwgWydpZyddKSApO1xuICAgICAgICBtb25zdGVyYmxvY2tlcnMgPSBtb25zdGVyYmxvY2tlcnMuY29uY2F0KCBuZXcgTW9uc3RlckJsb2NrKCAxMDgwLCA2MDAsIDEwLCAxMzAsIFsnaWcnXSkgKTtcblxuICAgICAgICB0aGlzLmxhc3RQZXdQZXcgPSAwO1xuXG4gICAgICAgIGFhID0gbmV3IEFyY2FkZUF1ZGlvKCk7XG5cbiAgICAgICAgLy8gZ3JhYiBoZWFydCBzb3VuZFxuICAgICAgICBhYS5hZGQoICdwaWNrdXAnLCAyLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFswLCwwLjAxLDAuNDM5NCwwLjMxMDMsMC44NzY1LCwsLCwsMC4zNjE0LDAuNTI3OCwsLCwsLDEsLCwsLDAuNV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICBhYS5hZGQoICdqdW1wJywgMSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbMCwsMC4xNjI1LCwwLjE1OSwwLjIyNDYsLCwsLCwsLDAuMDQ3MSwsLCwsMSwsLDAuMSwsMC4yOV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBoZWFydCBpbiBkYW5nZXIgc291bmRcbiAgICAgICAgYWEuYWRkKCAncGV3cGV3JywgMyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbMiwsMC4yNzQyLDAuMDIxNSwwLjA4NjMsMC42MDY4LDAuMiwtMC4xOTYsLCwsLCwwLjUwOTEsLTAuNTE1LCwsLDEsLCwsLDAuMjldXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG5cbiAgICAgICAgYWEuYWRkKCAnY2hlZXAnLCA0LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFsyLDAuMTYwMiwwLjAxLDAuNDIwMywwLjYzMDYsMC41OTUyLCwtMC4xMjksMC4wNCwwLjE5LDAuNzUsMC41NjE0LDAuMDYsLTAuNzI4NSwwLjkwNDYsLTAuNTk1LDAuOTgxNiwtMC41MTg3LDAuOTAyOCwwLjYwMjQsMC42ODEzLDAuNTIxLC0wLjAyOTIsMC41XVxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgdGhpcy5ib2RpZXMgPSBbXTtcblxuICAgICAgICB0aGlzLmJvZGllcyA9IHRoaXMuYm9kaWVzLmNvbmNhdCh0aGlzLnBsYXllcik7XG4gICAgICAgIHRoaXMuYm9kaWVzID0gdGhpcy5ib2RpZXMuY29uY2F0KG5ldyBIZWFydFNwcmlua2xlcih0aGlzLCBnYW1lU2l6ZSkpO1xuXG4gICAgICAgIHZhciBib3hlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZmFsbGluZ1N0dWZmID0gW107XG5cbiAgICAgICAgdmFyIGhlYXJ0U3RvcHBlcnMgPSBbXTtcbiAgICAgICAgLy8gc3RvcHMgdGhlIGhlYXJ0cyBhdCB0aGUgYm90dG9tXG4gICAgICAgIGhlYXJ0U3RvcHBlcnMgPSBoZWFydFN0b3BwZXJzLmNvbmNhdChuZXcgQm94KCAtNjAsIDc0MiwgMTA4NCwgMjAsIHt9ICkpO1xuXG4gICAgICAgIC8vIGdyb3VuZCBmbG9vclxuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCAtMzAsIDczMCwgMTA1NCwgNDgsIHt9ICkpO1xuXG4gICAgICAgIC8vIGxldmVsIGZsb29yc1xuICAgICAgICAvLyBmaXJzdCBmbG9vclxuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCAtMzAsIDU4MCwgIDUzMywgNCwgeyBib3R0b206IHRydWUgfSApKTsgLy8gMTUwIGhpZ2hcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggNjAwLCA1ODAsICA1MDAsIDQsIHsgYm90dG9tOiB0cnVlIH0gKSk7IC8vIDE1MCBoaWdoXG5cbiAgICAgICAgLy8gc2Vjb25kIGZsb29yXG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIC0zMCwgNDMwLCAxMDU0LCA0LCB7IGJvdHRvbTogdHJ1ZSB9ICkpO1xuXG4gICAgICAgIC8vIHRoaXJkIGZsb29yXG4gICAgICAgIC8vIHRocmVlIHBpZWNlcyBoZXJlXG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIC0zMCwgMjgwLCAzNzIsIDQsIHsgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDQwMiwgMjgwLCAyMjAsIDQsIHsgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDY4MiwgMjgwLCAzODIsIDQsIHsgYm90dG9tOiB0cnVlIH0gKSk7XG5cbiAgICAgICAgLy8gaGVhcnQgc3ByaW5rbGVyIGZsb29yIC0geW91IHNoYWxsIG5vdCBwYXNzXG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDAsIDEzMCwgMTAyNCwgNCwge30gKSk7XG5cbiAgICAgICAgLy8gc3RhaXJzXG5cbiAgICAgICAgLy8gZmxvb3IgbGV2ZWxcbiAgICAgICAgLy8gbGVmdFxuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCA2NCwgNjgwLCAzMiwgNSwgeyBsZWZ0OiB0cnVlLCByaWdodDogdHJ1ZSwgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDMyLCA2MzAsIDMyLCA1LCB7IGxlZnQ6IHRydWUsIHJpZ2h0OiBmYWxzZSwgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDAsIDU4NCwgMzIsIDUsIHsgYm90dG9tOiBmYWxzZSB9ICkpO1xuICAgICAgICAvLyByaWdodFxuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCA5MjgsIDY4MCwgMzIsIDUsIHsgbGVmdDogdHJ1ZSwgcmlnaHQ6IHRydWUsIGJvdHRvbTogdHJ1ZSB9ICkpO1xuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCA5NjAsIDYzMCwgMzIsIDUsIHsgbGVmdDogZmFsc2UsIHJpZ2h0OiB0cnVlLCBib3R0b206IHRydWUgfSApKTtcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggOTkyLCA1ODQsIDMyLCA1LCB7IGJvdHRvbTogZmFsc2UgfSApKTtcblxuICAgICAgICAvLyBmaXJzdCBmbG9vclxuICAgICAgICAvLyBsZWZ0XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDY0LCA1MzAsIDMyLCA1LCB7IGxlZnQ6IHRydWUsIHJpZ2h0OiB0cnVlLCBib3R0b206IHRydWUgfSApKTtcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggMzIsIDQ4MCwgMzIsIDUsIHsgbGVmdDogdHJ1ZSwgcmlnaHQ6IGZhbHNlLCBib3R0b206IHRydWUgfSApKTtcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggMCwgNDM0LCAzMiwgNSwgeyBib3R0b206IGZhbHNlIH0gKSk7XG4gICAgICAgIC8vIHJpZ2h0XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDkyOCwgNTMwLCAzMiwgNSwgeyBsZWZ0OiB0cnVlLCByaWdodDogdHJ1ZSwgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDk2MCwgNDgwLCAzMiwgNSwgeyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IHRydWUsIGJvdHRvbTogdHJ1ZSB9ICkpO1xuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCA5OTIsIDQzNCwgMzIsIDUsIHsgYm90dG9tOiBmYWxzZSB9ICkpO1xuXG4gICAgICAgIC8vIHNlY29uZCBmbG9vclxuICAgICAgICAvLyBsZWZ0XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDY0LCAzODAsIDMyLCA1LCB7IGxlZnQ6IHRydWUsIHJpZ2h0OiB0cnVlLCBib3R0b206IHRydWUgfSApKTtcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggMzIsIDMzMCwgMzIsIDUsIHsgbGVmdDogdHJ1ZSwgcmlnaHQ6IGZhbHNlLCBib3R0b206IHRydWUgfSApKTtcbiAgICAgICAgYm94ZXMgPSBib3hlcy5jb25jYXQobmV3IEJveCggMCwgMjg0LCAzMiwgNSwgeyBib3R0b206IGZhbHNlIH0gKSk7XG4gICAgICAgIC8vIHJpZ2h0XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDkyOCwgMzgwLCAzMiwgNSwgeyBsZWZ0OiB0cnVlLCByaWdodDogdHJ1ZSwgYm90dG9tOiB0cnVlIH0gKSk7XG4gICAgICAgIGJveGVzID0gYm94ZXMuY29uY2F0KG5ldyBCb3goIDk2MCwgMzMwLCAzMiwgNSwgeyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IHRydWUsIGJvdHRvbTogdHJ1ZSB9ICkpO1xuICAgICAgICBib3hlcyA9IGJveGVzLmNvbmNhdChuZXcgQm94KCA5OTIsIDI4NCwgMzIsIDUsIHsgYm90dG9tOiBmYWxzZSB9ICkpO1xuXG4gICAgICAgIHRoaXMuaWNlYmxvY2tiYXNlcyA9IFtdO1xuICAgICAgICAvLyBpY2UgbW9uc3RlciBibG9jayBiYXNlc1xuICAgICAgICBmb3IodmFyIHogPSAxMDA7IHogPCA5MDA7IHogKz0gMzMgKSB7XG4gICAgICAgICAgICB0aGlzLmljZWJsb2NrYmFzZXMucHVzaCggbmV3IEJveCh6LCA3MjAsIDMyLCAzLCB7fSwgdHJ1ZSApICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvZGllcyA9IHRoaXMuYm9kaWVzLmNvbmNhdCggYm94ZXMgKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1hZ2VzKCk7XG5cbiAgICAgICAgLy8gYmFja2dyb3VuZCB0aWxlc1xuICAgICAgICB0aGlzLmJhY2tncm91bmRUaWxlID0gbmV3IFNwcml0ZSggMTIsIDMwLCBbIHsgc3N4OiAwLCBzc3k6IDcyIH0gXSApO1xuICAgICAgICB0aGlzLmJhY2tncm91bmRUaWxlMiA9IG5ldyBTcHJpdGUoIDEyLCAzMCwgWyB7IHNzeDogMTIsIHNzeTogNzIgfSBdICk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFRpbGUzID0gbmV3IFNwcml0ZSggMTIsIDMwLCBbIHsgc3N4OiA0OCwgc3N5OiA3MiB9IF0gKTtcblxuICAgICAgICB0aGlzLmNsb3VkVGlsZSA9IG5ldyBTcHJpdGUoIDI0LCAxNCwgWyB7IHNzeDogOTcsIHNzeTogNTggfSBdICk7XG4gICAgICAgIHRoaXMuZ3Jhc3MxVGlsZSA9IG5ldyBTcHJpdGUoIDcsIDMsIFsgeyBzc3g6IDgzLCBzc3k6IDYyIH0gXSApO1xuICAgICAgICB0aGlzLmdyYXNzMlRpbGUgPSBuZXcgU3ByaXRlKCA3LCAzLCBbIHsgc3N4OiA5MCwgc3N5OiA2MiB9IF0gKTtcblxuICAgICAgICB0aGlzLnRyZWVTbGljZSA9IG5ldyBTcHJpdGUoIDYwLCA0LCBbIHsgc3N4OiAzMiwgc3N5OiA2NyB9IF0gKTtcbiAgICAgICAgdGhpcy50cmVlUm9vdExlZnQgPSBuZXcgU3ByaXRlKCA3LCA4LCBbIHsgc3N4OiAyOSwgc3N5OiA5NCB9IF0gKTtcbiAgICAgICAgdGhpcy50cmVlUm9vdFJpZ2h0ID0gbmV3IFNwcml0ZSggNiwgOCwgWyB7IHNzeDogMzYsIHNzeTogOTQgfSBdICk7XG5cbiAgICAgICAgdGhpcy5sZWF2ZXNUaWxlID0gbmV3IFNwcml0ZSggMjQsIDIxLCBbIHsgc3N4OiAyNCwgc3N5OiA3MiB9IF0gKTtcblxuICAgICAgICAvLyBzdGFpciB0aWxlc1xuICAgICAgICB0aGlzLnN0YWlyVGlsZSA9IG5ldyBTcHJpdGUoIDUwLCAyNSwgWyB7IHNzeDogMTIxLCBzc3k6IDQ2IH0gXSApO1xuXG4gICAgICAgIC8vIHdhdGVyIGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlblxuICAgICAgICB0aGlzLndhdGVyVGlsZSA9IG5ldyBTcHJpdGUoIDE0LCA4LCBbIHsgc3N4OiAwLCBzc3k6IDgsIGR1cmF0aW9uOiA1MDAgfSwgeyBzc3g6IDE0LCBzc3k6IDgsIGR1cmF0aW9uOiA1MDAgfSBdICk7XG4gICAgICAgIHRoaXMud2F0ZXJUaWxlMiA9IG5ldyBTcHJpdGUoIDE0LCA4LCBbIHsgc3N4OiA4LCBzc3k6IDE2IH0gXSApO1xuXG4gICAgICAgIC8vIHBsYXRmb3JtIHRpbGVzXG4gICAgICAgIC8vIGdyYXNzXG4gICAgICAgIHRoaXMucGZfb25lX1RpbGUgPSBuZXcgU3ByaXRlKCA0LCA4LCBbIHsgc3N4OiAwLCBzc3k6IDE2IH0gXSApO1xuICAgICAgICAvLyByb2NrL3NhbmRcbiAgICAgICAgdGhpcy5wZl90d29fVGlsZSA9IG5ldyBTcHJpdGUoIDQsIDgsIFsgeyBzc3g6IDQsIHNzeTogMTYgfSBdICk7XG5cbiAgICAgICAgLy8gbXV0ZSBpY29uXG4gICAgICAgIHRoaXMubXV0ZV9pY29uID0gbmV3IFNwcml0ZSggNywgOCwgWyB7IHNzeDogMCwgc3N5OiAzMiB9IF0gKTtcblxuICAgICAgICB0aGlzLmhlYXJ0SWNvbiA9IG5ldyBTcHJpdGUoIDcsIDgsIFsgeyBzc3g6IDAsIHNzeTogMCwgZHVyYXRpb246IDQwMCB9IF0gKTtcbiAgICAgICAgdGhpcy5lbGVtZW50SWNvbnMgPSBuZXcgU3ByaXRlKCA3LCA4LCBbIHsgc3N4OiA4MSwgc3N5OiAzNCB9LCB7IHNzeDogODksIHNzeTogMzQgfSwgeyBzc3g6IDgzLCBzc3k6IDUzIH0gXSApO1xuICAgICAgICB0aGlzLmhlYXJ0bWV0ZXIgPSBuZXcgU3ByaXRlKCAxMywgNiwgWyB7IHNzeDogOTcsIHNzeTogNTIgfSwgeyBzc3g6IDk3LCBzc3k6IDQ5IH0gXSApO1xuICAgICAgICB0aGlzLmVsZW1lbnRCb3ggPSBuZXcgU3ByaXRlKCAxMywgMTMsIFsgeyBzc3g6IDk3LCBzc3k6IDQ1IH0gXSApO1xuICAgICAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gMDtcblxuICAgICAgICB2YXIgU0tJUFRJQ0tTID0gMTAwMCAvIDYwO1xuXG4gICAgICAgIHZhciBuZXh0RnJhbWUgPSBnZXRUaW1lU3RhbXAoKTtcbiAgICAgICAgdmFyIGxvb3BzID0gMDtcblxuICAgICAgICB2YXIgdGljayA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAoICFBV0FZICkge1xuICAgICAgICAgICAgICAgIGxvb3BzID0gMDtcbiAgICAgICAgICAgICAgICAvLyBmcmFtZSByYXRlIGluZGVwZW5kZW50IGdhbWUgc3BlZWRcbiAgICAgICAgICAgICAgICB3aGlsZSggZ2V0VGltZVN0YW1wKCkgPiBuZXh0RnJhbWUgJiYgbG9vcHMgPCAxMCApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGUoZ2FtZVNpemUsIGJveGVzLCBoZWFydFN0b3BwZXJzLCBtb25zdGVyYmxvY2tlcnMgKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZyYW1lICs9IFNLSVBUSUNLUztcbiAgICAgICAgICAgICAgICAgICAgbG9vcHMrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLnJlbmRlcihjb250ZXh0LCBnYW1lU2l6ZSwgbW9uc3RlcmJsb2NrZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxUZXh0KCdDbGljayB0byByZXN1bWUnLCA1MDUsIDM4NCk7XG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aWNrKCk7XG4gICAgfTtcblxuICAgIHZhciBlbmRHYW1lID0gZnVuY3Rpb24ocykge1xuICAgICAgICBsb25nQnV0dG9uRGVsYXkucmVzZXQoKTtcbiAgICAgICAgdGhlR2FtZS5zdGF0ZSA9IHM7XG4gICAgfTtcblxuICAgIHZhciByZXNldEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY3VycmVudEhlYXJ0cyA9IHRoZUdhbWUuY3VycmVudEVsZW1lbnQgPSBoZWFydHNpbmRhbmdlciA9IDA7XG4gICAgICAgIHRoZUdhbWUuZmFsbGluZ1N0dWZmID0gW107XG4gICAgICAgIHRoZUdhbWUudGhpbmdzID0gW107XG4gICAgICAgIHRoZUdhbWUucGxheWVyLnggPSA1MTI7XG4gICAgICAgIHRoZUdhbWUucGxheWVyLnkgPSA3MDA7XG4gICAgICAgIHRoZUdhbWUucGxheWVyLnN0YXRlID0gJ3cnO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhlR2FtZS5lbmVtaWVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgdGhlR2FtZS5lbmVtaWVzW2ldLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhlR2FtZS5pY2VibG9ja2Jhc2VzWzEyXS5pc0VtcHR5ID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgR2FtZS5wcm90b3R5cGUgPSB7XG5cbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZ2FtZVNpemUsIGJveGVzLCBoZWFydFN0b3BwZXJzLCBtb25zdGVyYmxvY2tlcnMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHN3aXRjaCggdGhpcy5zdGF0ZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ1RJVExFJzpcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMua2V5Ym9hcmRlci5hbnlLZXlEb3duKCkgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdTVE9SWSc7XG4gICAgICAgICAgICAgICAgICAgIFBBVVNFID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnU1RPUlknOlxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5rZXlib2FyZGVyLmFueUtleURvd24oKSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ0dBTUUnO1xuICAgICAgICAgICAgICAgICAgICBQQVVTRSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0VORCc6XG4gICAgICAgICAgICBjYXNlICdESUUnOlxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5rZXlib2FyZGVyLmFueUtleURvd24oIHRydWUgKSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ1RJVExFJztcbiAgICAgICAgICAgICAgICAgICAgUEFVU0UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdHQU1FJzpcbiAgICAgICAgICAgICAgICBpZiAoICFQQVVTRSApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnVwZGF0ZShnYW1lU2l6ZSwgYm94ZXMsIHRoaXMuaGVhcnRzLCB0aGlzLnRoaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbmVtaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGlzLmVuZW1pZXNbaV0uaXNEZWFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllc1tpXS51cGRhdGUobW9uc3RlcmJsb2NrZXJzLCB0aGlzLnBsYXllciwgdGhpcy50aGluZ3MsIHRoaXMuaWNlYmxvY2tiYXNlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBzaW1wbGVDb2xDaGVjayggdGhpcy5wbGF5ZXIsIHRoaXMuZW5lbWllc1tpXSApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuZW5lbWllc1tpXS50eXBlID09PSAxICYmICgoIHRoaXMuZW5lbWllc1tpXS5zdGF0ZSA9PT0gJ3VwJyAmJiB0aGlzLmVuZW1pZXNbaV0uc3ByaXRlQi5nZXRGcmFtZSgpIDwgMSApIHx8IHRoaXMuZW5lbWllc1tpXS5zdGF0ZSA9PT0gJ3cnICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG51dGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnN0YXRlID0gJ2QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZmFsbGluZ1N0dWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhbGxpbmdTdHVmZltpXS51cGRhdGUoZ2FtZVNpemUsIGhlYXJ0U3RvcHBlcnMsIHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGFueSBoZWFydHMgYXJlIGluIGRhbmdlclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGhlYXJ0c2luZGFuZ2VyID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gZ2V0VGltZVN0YW1wKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbiAtIHRoaXMubGFzdFBld1BldyA+IDUwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYS5wbGF5KCdwZXdwZXcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RQZXdQZXcgPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudGhpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGlzLnRoaW5nc1tpXS5pc0RlYWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aGluZ3NbaV0udXBkYXRlKHRoaXMucGxheWVyLCB0aGlzLmljZWJsb2NrYmFzZXMsIHRoaXMudGhpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuaW1hdGUgdGhlIHdhdGVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2F0ZXJUaWxlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZGVyLmlzRG93bih0aGlzLmtleWJvYXJkZXIuS0VZUy5QKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwYXVzZUJ1dHRvbkRlbGF5LmlzRG9uZSgpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUEFVU0UgPSAhUEFVU0U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXVzZUJ1dHRvbkRlbGF5LnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcjogZnVuY3Rpb24oc2NyZWVuLCBnYW1lU2l6ZSwgbW9uc3RlcmJsb2NrZXJzKSB7XG4gICAgICAgIHNjcmVlbi5jbGVhclJlY3QoMCwgMCwgZ2FtZVNpemUud2lkdGgsIGdhbWVTaXplLmhlaWdodCk7XG5cbiAgICAgICAgc3dpdGNoKCB0aGlzLnN0YXRlICkge1xuXG4gICAgICAgICAgICBjYXNlICdMT0FESU5HJzpcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxvYWRpbmdTY3JlZW4oc2NyZWVuLCBnYW1lU2l6ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdUSVRMRSc6XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJQcmV0dHlCYWNrZ3JvdW5kKHNjcmVlbik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJUaXRsZVNjcmVlbihzY3JlZW4sIGdhbWVTaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLndhdGVyVGlsZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1NUT1JZJzpcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclByZXR0eUJhY2tncm91bmQoc2NyZWVuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclN0b3J5U2NyZWVuKHNjcmVlbiwgZ2FtZVNpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMud2F0ZXJUaWxlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnRU5EJzpcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckVuZFNjcmVlbihzY3JlZW4sIGdhbWVTaXplLCAnWW91IERpZCBpdCEgQ29uZ3JhdHVsYXRpb25zIScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnRElFJzpcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckVuZFNjcmVlbihzY3JlZW4sIGdhbWVTaXplLCAnR2FtZSBPdmVyIScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnR0FNRSc6XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJQcmV0dHlCYWNrZ3JvdW5kKHNjcmVlbik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKHNjcmVlbik7XG5cbiAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmJvZGllc1tpXS5yZW5kZXIoc2NyZWVuKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbmVtaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuZW5lbWllc1tpXS5pc0RlYWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXNbaV0ucmVuZGVyKHNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5mYWxsaW5nU3R1ZmYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy5mYWxsaW5nU3R1ZmZbaV0uaXNEZWFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWxsaW5nU3R1ZmZbaV0ucmVuZGVyKHNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy50aGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy50aGluZ3NbaV0uaXNEZWFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aGluZ3NbaV0ucmVuZGVyKHNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckhVRChzY3JlZW4sIHRoaXMucGxheWVyKTtcblxuICAgICAgICAgICAgICAgIGlmICggUEFVU0UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmVlbi5maWxsU3R5bGUgPSAnIzAwMCc7XG4gICAgICAgICAgICAgICAgICAgIHNjcmVlbi5mb250ID0gJzMwcHQgbW9ub3NwYWNlJztcbiAgICAgICAgICAgICAgICAgICAgc2NyZWVuLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgICAgICBzY3JlZW4uZmlsbFRleHQoJ1BBVVNFRCcsIGdhbWVTaXplLndpZHRoIC8gMiwgZ2FtZVNpemUuaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNGcmFtZUZQUyA9IDEwMDAgLyAoKG5vdyA9IG5ldyBEYXRlKCkpIC0gbGFzdFVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyAhPT0gbGFzdFVwZGF0ZSl7XG4gICAgICAgICAgICAgICAgICBmcHMgKz0gKHRoaXNGcmFtZUZQUyAtIGZwcykgLyBmcHNGaWx0ZXI7XG4gICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlID0gbm93O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbmRlckVuZFNjcmVlbjogZnVuY3Rpb24oY3R4LCBnYW1lU2l6ZSwgdGV4dCkge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsMCwgZ2FtZVNpemUud2lkdGgsIGdhbWVTaXplLmhlaWdodCk7XG5cbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzMwcHQgbW9ub3NwYWNlJztcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCBnYW1lU2l6ZS53aWR0aCAvIDIsIGdhbWVTaXplLmhlaWdodCAvIDIpO1xuXG4gICAgICAgICAgICB0aGlzLmJzdChjdHgsIDUxMiwgNjAwLCB0cnVlKTtcbiAgICAgICAgICAgIHJlc2V0R2FtZSgpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlclByZXR0eUJhY2tncm91bmQ6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICAgICAgLy8gMTFiNzZkIC0gZ3Jhc3NcbiAgICAgICAgICAgIC8vIDE0ODg3NSAtIGZvcmVncm91bmRcbiAgICAgICAgICAgIC8vIGQzNTkxYiAtIHNvaWxcbiAgICAgICAgICAgIC8vXG5cbiAgICAgICAgICAgIHZhciB0eCA9IDA7XG4gICAgICAgICAgICAvLyB0aWxlc1xuICAgICAgICAgICAgLy8gY2xvdWRzXG4gICAgICAgICAgICBmb3IgKHR4ID0gMDsgdHggPCAxMDI0OyB0eCArPSA5NCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3VkVGlsZS5yZW5kZXIoY3R4LCB0eCwgNDgyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3VkVGlsZS5yZW5kZXIoY3R4LCB0eCArIDQ4LCA0ODIsIHRydWUgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJlZWxpbmVcbiAgICAgICAgICAgIHZhciBjID0gMDtcbiAgICAgICAgICAgIGZvciAodHggPSAwOyB0eCA8IDEwMjQ7IHR4ICs9IDI0ICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVGlsZS5yZW5kZXIoY3R4LCB0eCwgNTEwKTtcbiAgICAgICAgICAgICAgICBpZiAoIHR4ICUgKDI0ICogNCkgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZFRpbGUyLnJlbmRlcihjdHgsIHR4LCA1MTApO1xuICAgICAgICAgICAgICAgICAgICBjID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCB0eCA9PT0gKDI0ICogMjUpICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRUaWxlMy5yZW5kZXIoY3R4LCB0eCwgNTEwKTtcbiAgICAgICAgICAgICAgICAgICAgYyA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGMrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdGhpcmQgbGV2ZWwgLSBncmFzc1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMTFiNzZkJztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCggMCwgNTcwLCAxMDI0LCA4MCk7XG5cbiAgICAgICAgICAgIC8vIHNlY29uZCBsZXZlbCAtIGZvcmVncm91bmRcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzE0ODg3NSc7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoIDAsIDY1MCwgMTAyNCwgNDApO1xuXG4gICAgICAgICAgICAvLyB0aGlyZCBsZXZlbCAtIGZvcmVncm91bmRcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzE1NWM2Zic7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoIDAsIDY5MCwgMTAyNCwgMTAwKTtcblxuICAgICAgICAgICAgLy8gZ3Jhc3MgdGlsZSAxXG4gICAgICAgICAgICBmb3IgKHR4ID0gMDsgdHggPCAxMDI0OyB0eCArPSAxNSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXNzMVRpbGUucmVuZGVyKGN0eCwgdHgsIDY0NSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBncmFzcyB0aWxlIDJcbiAgICAgICAgICAgIGZvciAodHggPSAwOyB0eCA8IDEwMjQ7IHR4ICs9IDE1ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3Jhc3MyVGlsZS5yZW5kZXIoY3R4LCB0eCwgNjg1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJlZXNcbiAgICAgICAgICAgIGZvciAodHggPSAwOyB0eCA8IDc2ODsgdHggKz0gOCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVTbGljZS5yZW5kZXIoY3R4LCAxNTAsIHR4KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVTbGljZS5yZW5kZXIoY3R4LCA0NTAsIHR4KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVTbGljZS5yZW5kZXIoY3R4LCA3NTAsIHR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRyZWUgcm9vdHNcbiAgICAgICAgICAgIGZvcih2YXIgYSA9IDA7IGEgPCAzOyBhKysgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlUm9vdExlZnQucmVuZGVyKGN0eCwgMTM4ICsgKGEgKiAzMDApLCA3MTMpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZVJvb3RSaWdodC5yZW5kZXIoY3R4LCAyNjggKyAoYSAqIDMwMCksIDcxMyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGxlYXZlc1xuICAgICAgICAgICAgZm9yICh0eCA9IDA7IHR4IDwgMTAyNDsgdHggKz0gNDggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWF2ZXNUaWxlLnJlbmRlcihjdHgsIHR4LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZW5kZXJCYWNrZ3JvdW5kOiBmdW5jdGlvbihjdHgpIHtcblxuICAgICAgICAgICAgdmFyIHR4ID0gMDtcblxuICAgICAgICAgICAgLy8gcGxhdGZvcm0gdGlsZXNcbiAgICAgICAgICAgIC8vIDQgeCA4ID0gOCB4IDE2XG4gICAgICAgICAgICBmb3IgKHR4ID0gMDsgdHggPCAxMDI0OyB0eCArPSA4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGZfb25lX1RpbGUucmVuZGVyKGN0eCwgdHgsIDcyOSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wZl90d29fVGlsZS5yZW5kZXIoY3R4LCB0eCwgNzQ1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh0eCA9IDA7IHR4IDwgNTAwOyB0eCArPSA4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGZfb25lX1RpbGUucmVuZGVyKGN0eCwgdHgsIDU4MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHR4ID0gNjAwOyB0eCA8IDEwMjQ7IHR4ICs9IDggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZl9vbmVfVGlsZS5yZW5kZXIoY3R4LCB0eCwgNTgwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh0eCA9IDA7IHR4IDwgMTAyNDsgdHggKz0gOCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBmX29uZV9UaWxlLnJlbmRlcihjdHgsIHR4LCA0MzApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh0eCA9IDA7IHR4IDwgMzQwOyB0eCArPSA4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGZfb25lX1RpbGUucmVuZGVyKGN0eCwgdHgsIDI3OSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHR4ID0gNDAwOyB0eCA8IDYyMDsgdHggKz0gOCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBmX29uZV9UaWxlLnJlbmRlcihjdHgsIHR4LCAyNzkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh0eCA9IDY4MDsgdHggPCAxMDI0OyB0eCArPSA4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGZfb25lX1RpbGUucmVuZGVyKGN0eCwgdHgsIDI3OSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodHggPSAwOyB0eCA8IDEwMjQ7IHR4ICs9IDggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZl9vbmVfVGlsZS5yZW5kZXIoY3R4LCB0eCwgMTI5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RhaXJzXG4gICAgICAgICAgICB0aGlzLmRyYXdTdGFpcnMoY3R4LCAwLCAyODAsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd1N0YWlycyhjdHgsIDAsIDQzMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5kcmF3U3RhaXJzKGN0eCwgMCwgNTgwLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhd1N0YWlycyhjdHgsIDEwMjQgLSAxMDAsIDI4MCwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmRyYXdTdGFpcnMoY3R4LCAxMDI0IC0gMTAwLCA0MzAsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5kcmF3U3RhaXJzKGN0eCwgMTAyNCAtIDEwMCwgNTgwLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gd2F0ZXJcbiAgICAgICAgICAgIGZvciAodHggPSAwOyB0eCA8IDEwMjQ7IHR4ICs9IDI4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMud2F0ZXJUaWxlLnJlbmRlcihjdHgsIHR4LCA3NDApO1xuICAgICAgICAgICAgICAgIHRoaXMud2F0ZXJUaWxlMi5yZW5kZXIoY3R4LCB0eCwgNzU2KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgfSxcbiAgICAgIGRyYXdTdGFpcnM6IGZ1bmN0aW9uKCBjdHgsIGxvY1gsIGxvY1ksIGZsaXApIHtcbiAgICAgICAgaWYgKCBmbGlwICkge1xuICAgICAgICAgICAgdGhpcy5zdGFpclRpbGUucmVuZGVyKGN0eCwgbG9jWCwgICAgICBsb2NZICsgMTAwLCBmbGlwKTtcbiAgICAgICAgICAgIHRoaXMuc3RhaXJUaWxlLnJlbmRlcihjdHgsIGxvY1ggKyAzMiwgbG9jWSArIDUwLCBmbGlwKTtcbiAgICAgICAgICAgIHRoaXMuc3RhaXJUaWxlLnJlbmRlcihjdHgsIGxvY1ggKyA2NCwgbG9jWSwgZmxpcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnN0YWlyVGlsZS5yZW5kZXIoY3R4LCBsb2NYLCAgICAgIGxvY1kgKyAxMDAsIGZsaXApO1xuICAgICAgICAgICAgdGhpcy5zdGFpclRpbGUucmVuZGVyKGN0eCwgbG9jWCAtIDMyLCBsb2NZICsgNTAsIGZsaXApO1xuICAgICAgICAgICAgdGhpcy5zdGFpclRpbGUucmVuZGVyKGN0eCwgbG9jWCAtIDY0LCBsb2NZLCBmbGlwKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbmRlckhVRDogZnVuY3Rpb24oY3R4LCBwbGF5ZXIpIHtcbiAgICAgICAgaWYgKCBhYS5tdXRlICkge1xuICAgICAgICAgICAgdGhpcy5tdXRlX2ljb24ucmVuZGVyKGN0eCwgMTAwMCwgNTApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVhcnQgbWV0ZXJcbiAgICAgICAgLy8gZHJhdyBhIHJlZCBib3ggdG8gZmlsbCB0aGUgbWV0ZXJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgICBjdHguZmlsbFJlY3QoMTgsIDE2OCwgMjAsIC0xICogY3VycmVudEhlYXJ0cyAqIDQpO1xuXG4gICAgICAgIHRoaXMuaGVhcnRJY29uLnJlbmRlcihjdHgsIDIwLCAyMCk7XG4gICAgICAgIHRoaXMuaGVhcnRtZXRlci5zZXRGcmFtZSgxKTtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgMTE7IGkrKyApIHtcbiAgICAgICAgICAgIHRoaXMuaGVhcnRtZXRlci5yZW5kZXIoY3R4LCAxNCwgNDAgKyAoaSAqIDEyICkpO1xuICAgICAgICAgICAgaWYgKCBpID09IDkgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFydG1ldGVyLnNldEZyYW1lKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVsZW1lbnQgYm94XG4gICAgICAgIHRoaXMuZWxlbWVudEJveC5yZW5kZXIoY3R4LCA1MCwgNDUgKyAodGhpcy5jdXJyZW50RWxlbWVudCAqIDI1KSk7XG4gICAgICAgIC8vIGN1cnJlbnQgZWxlbWVudFxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudEljb25zLnNldEZyYW1lKGkpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50SWNvbnMucmVuZGVyKGN0eCwgNTUsIDUwICsgKGkgKiAyNSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVuZGVyTG9hZGluZ1NjcmVlbjogZnVuY3Rpb24oY3R4LCBnYW1lU2l6ZSkge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCIjMDAwXCI7XG4gICAgICAgIGN0eC5maWxsUmVjdCgwLDAsIGdhbWVTaXplLndpZHRoLCBnYW1lU2l6ZS5oZWlnaHQpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgY3R4LmZvbnQgPSAnMjBwdCBtb25vc3BhY2UnO1xuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGN0eC5maWxsVGV4dCgnTG9hZGluZy4uLicsIGdhbWVTaXplLndpZHRoIC8gMiwgZ2FtZVNpemUuaGVpZ2h0IC8gMik7XG4gICAgICB9LFxuICAgICAgcmVuZGVyU3RvcnlTY3JlZW46IGZ1bmN0aW9uKGN0eCwgZ2FtZVNpemUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKGN0eCk7XG4gICAgICAgIC8vIGxpZ2h0IG92ZXJsYXlcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjgwKVwiO1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwwLCBnYW1lU2l6ZS53aWR0aCwgZ2FtZVNpemUuaGVpZ2h0KTtcblxuICAgICAgICB2YXIgaHcgPSBnYW1lU2l6ZS53aWR0aCAvIDI7XG4gICAgICAgIHZhciBoaCA9IGdhbWVTaXplLmhlaWdodCAvIDI7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgIGN0eC5mb250ID0gJzEycHQgbW9ub3NwYWNlJztcblxuICAgICAgICB2YXIgdGV4dCA9IFsgJ09oIG5vIScsXG4gICAgICAgICAgICAgICAgICAgICAnRmVsaWNpdHlcXCdzIGJveWZyaWVuZCBpcyBsb3NpbmcgaGlzIGxvdmUhJyxcbiAgICAgICAgICAgICAgICAgICAgICdCcmF2ZSB0aGUgZm91ciBlbGVtZW50cyBhbmQgY29sbGVjdCB0aGUgaGVhcnRzIGJlZm9yZSB0aGV5IGJyZWFrLicsXG4gICAgICAgICAgICAgICAgICAgICAnRmlsbCB0aGUgaGVhcnRtZXRlciB0byBjb21wbGV0ZSB0aGUgbGV2ZWwuJyxcbiAgICAgICAgICAgICAgICAgICAgICdXYXRjaCBvdXQgZm9yIHdpbmRkdWNrcywgZmlyZXNwcml0ZXMsIHNhbmRtb25zdGVycyBhbmQgc25vd21lbi4nLFxuICAgICAgICAgICAgICAgICAgICAgJ1VzZSB0aGUgY29ycmVjdCBlbGVtZW50IHRvIGRlZmVhdCB0aGVtLicsXG4gICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICdDb250cm9sczonLFxuICAgICAgICAgICAgICAgICAgICAgJ0Fycm93IGtleXM6IE1vdmUgbGVmdC9yaWdodCwgSnVtcCwgR28gZG93biBzdGFpcnMnLFxuICAgICAgICAgICAgICAgICAgICAgJ1o6IEp1bXAnLFxuICAgICAgICAgICAgICAgICAgICAgJ1g6IFN3aXRjaCBFbGVtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICdDOiBVc2UgRWxlbWVudCcsXG4gICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICdNOiBNdXRlIHNvdW5kcycsXG4gICAgICAgICAgICAgICAgICAgICAnUDogUGF1c2UnXG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCB0ZXh0W2ldLCBodywgMTAwICsgKGkgKiA0MCkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnN0KGN0eCwgaHcsIDcyMCk7XG5cbiAgICAgIH0sXG4gICAgICBic3Q6IGZ1bmN0aW9uKGN0eCwgeCwgeSwgZmxhZykge1xuICAgICAgICBzd2l0Y2ggKCB0aGlzLnRpdGxlc2NyZWVuQmxpbmsuZ2V0U3RhZ2UoKSApIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxNXB0IGltcGFjdCc7XG4gICAgICAgICAgICAgICAgaWYgKCBmbGFnICkge1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoJ1ByZXNzIGFueSBrZXkgdG8gdHJ5IGFnYWluJywgeCwgeSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnUHJlc3MgYW55IGtleSB0byBiZWdpbicsIHgsIHkgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZW5kZXJUaXRsZVNjcmVlbjogZnVuY3Rpb24oY3R4LCBncykge1xuICAgICAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoY3R4KTtcbiAgICAgICAgLy8gZGFyayBvdmVybGF5XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMClcIjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsMCwgZ3Mud2lkdGgsIGdzLmhlaWdodCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgY3R4LmZvbnQgPSAnNjBwdCBpbXBhY3QnO1xuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHZhciB0ID0gWyAnRmVsaWNpdHknLCAnYW5kJywgJ3RoZSBGaWZ0aCBFbGVtZW50OicsICdMb3ZlJ107XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCggdFtpXSwgNTEyLCAyMDAgKyAoaSAqIDEwMCkgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJzdChjdHgsIDUxMiwgNjMwKTtcbiAgICAgIH0sXG4gICAgICAvLyBsb2FkIG91ciBzcHJpdGVzaGVldFxuICAgICAgbG9hZEltYWdlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBpbWFnZU9iaiA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgICAgICBpbWFnZU9iai5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlID0gXCJUSVRMRVwiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlT2JqLnNyYyA9IFwic3ByaXRlc2hlZXQucG5nXCI7XG4gICAgICAgICAgICBpbWFnZXNbMF0gPSBpbWFnZU9iajtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBzdGFydCBnYW1lIHdoZW4gcGFnZSBoYXMgZmluaXNoZWQgbG9hZGluZ1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHRoZUdhbWUgPSBuZXcgR2FtZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gaWYgdGhlIHdpbmRvdyBsb29zZXMgZm9jdXMgd2UgcGF1c2UgdGhlIGdhbWUgLSBvdGhlcndpc2UgeW91IGdldCBhIHN1cGVyc3BlZWQgbW9tZW50IVxuICAgIHdpbmRvdy5vbmJsdXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgQVdBWSA9IHRydWU7XG4gICAgfTtcbiAgICB3aW5kb3cub25mb2N1cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBBV0FZID0gZmFsc2U7XG4gICAgfTtcbn0pKCk7XG4iXX0=
