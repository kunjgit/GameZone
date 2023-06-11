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
