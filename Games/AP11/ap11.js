var horizontalTiles = 100,
    verticalTiles = 100,
    tileSize = 200,
    pixelSize = 10,
    wallsDefinition = 5,
    canvasWidth = 1024,
    canvasHeight = 768,
    halfCanvasWidth = canvasWidth / 2,
    halfCanvasHeight = canvasHeight / 2,
    tilesToRender = 4;

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    sounds = new Sounds(),
    world = new World(),
    text = new Text(),
    firstTileX = 0,
    firstTileY = 0,
    lastTileX = 0,
    lastTileY = 0,
    tick = 0;

function Ap11() {
    var that = this;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    this.started = false;
    this.keyUp = false;
    this.keyDown = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.numbersToDraw = [];
    this.carSpawnDirection = 0;

    window.addEventListener('keydown', function(key) {
        if (that.started) {
            switch (key.keyCode) {
                case 37:
                    that.keyLeft = true;
                    break;
                case 38:
                    that.keyUp = true;
                    break;
                case 39:
                    that.keyRight = true;
                    break;
                case 40:
                    that.keyDown = true;
                    break;
                default:
                    if (key.keyCode !== 32) { //spacebar causes problems when used at the same time as the directional keys
                        that.car.firing = true;
                    }
            }
        }
    });

    window.addEventListener('keyup', function(key) {
        if (!that.started) {
            that.started = true;
        } else if (that.car.life <= 0) {
            if ((key.keyCode === 32 || key.keyCode === 13) && that.tryAgainTimeout > 100) {
                that.init();
            }
        } else {
            switch (key.keyCode) {
                case 37:
                    that.keyLeft = false;
                    break;
                case 38:
                    that.keyUp = false;
                    break;
                case 39:
                    that.keyRight = false;
                    break;
                case 40:
                    that.keyDown = false;
                    break;
                default:
                    if (key.keyCode !== 32) {
                        that.car.firing = false;
                    }
            }
        }
    });

    canvas.addEventListener('click', function(key) {
        if (!that.started) {
            that.started = true;
        } else if (that.car.life <= 0 && that.tryAgainTimeout > 100) {
            that.init();
        }
    });

    this.init();

    setInterval(function() {
        for (var i = firstTileX; i < lastTileX; i++) {
            for (var j = firstTileY; j < lastTileY; j++) {
                if (i >= 0 && i < horizontalTiles && j >= 0 && j < verticalTiles && !world.getTile(i, j).image) {
                    world.createTile(i, j);
                }
            }
        }

        if (that.started && that.cars.length < 5) {
            that.cars.push(new Car(50, 100, 15, true));
        }
        for (var i = that.cars.length - 1; i > 0; i--) {
            if (calculateDistance(that.car.x - that.cars[i].x, that.car.y - that.cars[i].y) > 1300) {
                that.cars.splice(i, 1);
            }
        }
    }, 100);

    // for (var i = 0; i < horizontalTiles; i++) {
    //     for (var j = 0; j < verticalTiles; j++) {
    //         if (!world.getTile(i, j).image) { //TODO this condition is really necessary? because of the building pre generated images
    //             world.createTile(i, j);
    //         }
    //     }
    // }

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.oRequestAnimationFrame;

    window.requestAnimationFrame(this.draw.bind(this));
}

Ap11.prototype.init = function() {
    var tile;

    this.points = 0;
    this.tryAgainTimeout = 0;
    this.keyLeft = false;
    this.keyUp = false;
    this.keyRight = false;
    this.keyDown = false;

    //restart destroyed buildings
    for (var i = horizontalTiles - 1; i >= 0; i--) {
        for (var j = verticalTiles - 1; j >= 0; j--) {
            tile = world.getTile(i, j);
            if (tile.type === 6) {
                tile.type = 3;
                tile.collision = true;
                tile.explosionTick = 0;
                tile.life = 1;
                tile.height = tile.defaultHeight;
            }
        }
    }

    this.cars = [
        this.car = new Car(50, 100, 18, false)
    ]
}

Ap11.prototype.drawHorizontalWall = function(initialX, initialY, initialWidth, finalX, finalY, finalWidth, image, hit) {
    var xDelta = finalX - initialX,
        yDelta = finalY - initialY,
        widthDelta = initialWidth - finalWidth,

        xInc = xDelta / yDelta,
        widthInc = widthDelta / yDelta,

        sourceHeight = tileSize / yDelta;

    for (var k = 0; k < yDelta; k += wallsDefinition) {
        context.drawImage(image,
            0, sourceHeight * k, tileSize, wallsDefinition,
            initialX, initialY + k, initialWidth, wallsDefinition
        );
        if (hit) {
            drawRect(context, initialX, initialY + k, initialWidth, wallsDefinition, 'rgba(255,0,0, 0.3)');
        }
        initialX += xInc * wallsDefinition;
        initialWidth -= widthInc * wallsDefinition;
    };
};

Ap11.prototype.drawVerticalWall = function(initialX, initialY, initialWidth, finalX, finalY, finalWidth, image, hit) {
    var xDelta = finalX - initialX,
        yDelta = finalY - initialY,
        widthDelta = initialWidth - finalWidth,

        yInc = yDelta / xDelta,
        widthInc = widthDelta / xDelta,

        sourceWidth = tileSize / xDelta;

    for (var k = 0; k < xDelta; k += wallsDefinition) {
        context.drawImage(image,
            sourceWidth * k, 0, wallsDefinition, tileSize,
            initialX + k, initialY, wallsDefinition, initialWidth
        );
        if (hit) {
            drawRect(context, initialX + k, initialY, wallsDefinition, initialWidth, 'rgba(255,0,0, 0.3)');
        }
        initialY += yInc * wallsDefinition;
        initialWidth -= widthInc * wallsDefinition;
    }
};

Ap11.prototype.draw = function() {
    tick++;
    if (tick > 100) {
        tick = 0;
    }

    context.save();
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    //zoom out
    var scale = 0.9 - Math.abs(this.car.speed) / 110;
    context.translate(halfCanvasWidth, halfCanvasHeight);
    context.scale(scale, scale);
    context.translate(-halfCanvasWidth, -halfCanvasHeight);

    // context.clearRect(0, 0, canvasWidth, canvasHeight);

    //position camera
    var cameraX = -this.car.x + halfCanvasWidth,
        cameraY = -this.car.y + halfCanvasHeight;
    context.translate(cameraX, cameraY);

    //draw ground
    firstTileX = Math.floor(this.car.x / tileSize) - tilesToRender;
    firstTileY = Math.floor(this.car.y / tileSize) - tilesToRender + 1;
    lastTileX = firstTileX + tilesToRender * 2 + 1;
    lastTileY = firstTileY + tilesToRender * 2;
    for (var i = firstTileX; i < lastTileX; i++) {
        for (var j = firstTileY; j < lastTileY; j++) {
            var tile = world.getTile(i, j);
            if (tile.image && tile.type !== 3) {
                context.drawImage(tile.image, tile.x, tile.y);

                //draw explosion in the place of a building
                if (tile.type === 6 && tile.explosionTick <= 10) {
                    // for (var k = 0; k < tileSize; k += 40) {
                    //     for (var l = 0; l < tileSize; l += 40) {
                    //         drawRect(context,
                    //             tile.x + k,
                    //             tile.y + l,
                    //             40 - tile.explosionTick * 2,
                    //             40 - tile.explosionTick * 2,
                    //             'rgb(100,100,100)');
                    //     }
                    // }

                    drawRect(context,
                        tile.x,
                        tile.y,
                        tileSize,
                        tileSize,
                        'rgba(100,100,100,' + (1 - tile.explosionTick / 10) + ')');
                    tile.explosionTick++;
                }
            }
        }
    }

    //draw cars
    for (var i = this.cars.length - 1; i >= 0; i--) {
        this.cars[i].updatePosition();
    }

    for (var i = this.cars.length - 1; i >= 0; i--) {
        this.cars[i].draw(tick);
    }

    var keepFiring = false;
    for (var i = this.cars.length - 1; i >= 0; i--) {
        if (this.cars[i].firing && sounds.gunFireAudio.paused) {
            sounds.gunFireAudio.play();
            keepFiring = true;
        }
    }
    if (!keepFiring && !sounds.gunFireAudio.paused) {
        sounds.gunFireAudio.pause();
    }

    //draw building walls
    var nextTile;
    for (var i = firstTileX; i < lastTileX; i++) {
        for (var j = firstTileY; j < lastTileY; j++) {
            var tile = world.getTile(i, j),
                hit = tile.life !== tile.lastLife && tick % 5 === 0;
            if (i >= 0 && i < horizontalTiles && j >= 0 && j < verticalTiles && tile.image && tile.type === 3) {
                // TODO store this values in the tiles objects themselves withou the cameraX and camerY
                var raisedTilePositionX = tile.x + (tile.x + cameraX - halfCanvasWidth) * tile.height,
                    raisedTilePositionY = tile.y + (tile.y + cameraY - halfCanvasHeight) * tile.height,
                    raisedTileSize = tileSize + tile.height * tileSize;

                //lower face
                nextTile = world.getTile(i, j + 1);
                if (nextTile.type !== 3 || nextTile.height < tile.height) {
                    if (nextTile.type === 3) {
                        tilePositionX = nextTile.x + (nextTile.x + cameraX - halfCanvasWidth) * nextTile.height;
                        tilePositionY = nextTile.y + (nextTile.y + cameraY - halfCanvasHeight) * nextTile.height;
                        tileWidth = tileSize + nextTile.height * tileSize;
                    } else {
                        tilePositionX = tile.x;
                        tilePositionY = tile.y + tileSize;
                        tileWidth = tileSize;
                    }
                    ap11.drawHorizontalWall(
                        raisedTilePositionX,
                        raisedTilePositionY + raisedTileSize,
                        raisedTileSize,
                        tilePositionX,
                        tilePositionY,
                        tileWidth,
                        tile.wallImage,
                        hit
                    );
                }

                //upper face
                nextTile = world.getTile(i, j - 1);
                if (nextTile.type !== 3 || nextTile.height < tile.height) {
                    if (nextTile.type === 3) {
                        tilePositionX = nextTile.x + (nextTile.x + cameraX - halfCanvasWidth) * nextTile.height;
                        tilePositionY = nextTile.y + (nextTile.y + cameraY - halfCanvasHeight) * nextTile.height + tileSize + nextTile.height * tileSize;
                        tileWidth = tileSize + nextTile.height * tileSize;
                    } else {
                        tilePositionX = tile.x;
                        tilePositionY = tile.y;
                        tileWidth = tileSize;
                    }
                    ap11.drawHorizontalWall(
                        tilePositionX,
                        tilePositionY,
                        tileWidth,
                        raisedTilePositionX,
                        raisedTilePositionY,
                        raisedTileSize,
                        tile.wallImage,
                        hit
                    );
                }

                //right face
                nextTile = world.getTile(i + 1, j);
                if (nextTile.type !== 3 || nextTile.height < tile.height) {
                    if (nextTile.type === 3) {
                        tilePositionX = nextTile.x + (nextTile.x + cameraX - halfCanvasWidth) * nextTile.height;
                        tilePositionY = nextTile.y + (nextTile.y + cameraY - halfCanvasHeight) * nextTile.height;
                        tileWidth = tileSize + nextTile.height * tileSize;
                    } else {
                        tilePositionX = tile.x + tileSize;
                        tilePositionY = tile.y;
                        tileWidth = tileSize;
                    }
                    ap11.drawVerticalWall(
                        raisedTilePositionX + raisedTileSize,
                        raisedTilePositionY,
                        raisedTileSize,
                        tilePositionX,
                        tilePositionY,
                        tileWidth,
                        tile.wallImage,
                        hit
                    );
                }

                //left face
                nextTile = world.getTile(i - 1, j);
                if (nextTile.type !== 3 || nextTile.height < tile.height) {
                    if (nextTile.type === 3) {
                        tilePositionX = nextTile.x + (nextTile.x + cameraX - halfCanvasWidth) * nextTile.height + tileSize + nextTile.height * tileSize;
                        tilePositionY = nextTile.y + (nextTile.y + cameraY - halfCanvasHeight) * nextTile.height;
                        tileWidth = tileSize + nextTile.height * tileSize;
                    } else {
                        tilePositionX = tile.x;
                        tilePositionY = tile.y;
                        tileWidth = tileSize;
                    }
                    ap11.drawVerticalWall(
                        tilePositionX,
                        tilePositionY,
                        tileWidth,
                        raisedTilePositionX,
                        raisedTilePositionY,
                        raisedTileSize,
                        tile.wallImage,
                        hit
                    );
                }
            }
        }
    }

    //draw roofs
    for (var i = firstTileX; i < lastTileX; i++) {
        for (var j = firstTileY; j < lastTileY; j++) {
            var tile = world.getTile(i, j);
            if (i >= 0 && i < horizontalTiles && j >= 0 && j < verticalTiles && tile.image && tile.type === 3) {
                var raisedTilePositionX = tile.x + (tile.x + cameraX - halfCanvasWidth) * tile.height,
                    raisedTilePositionY = tile.y + (tile.y + cameraY - halfCanvasHeight) * tile.height,
                    raisedTileSize = tileSize + tile.height * tileSize;

                context.drawImage(tile.roofImage,
                    raisedTilePositionX,
                    raisedTilePositionY,
                    raisedTileSize,
                    raisedTileSize
                );

                if (tile.life !== tile.lastLife) {
                    if (tick % 5 === 0) {
                        drawRect(context, raisedTilePositionX,
                            raisedTilePositionY,
                            raisedTileSize,
                            raisedTileSize,
                            'rgba(255,0,0, 0.3)');
                    }

                    if (tick % 15 === 0) {
                        if (typeof tile.lastLifeValueShown === 'undefined') {
                            tile.lastLifeValueShown = tile.lastLife;
                        }
                        this.numbersToDraw.push([
                            tile.x + tileSize / 2,
                            tile.y + tileSize / 2,
                            tile.lastLifeValueShown - tile.life,
                            0,
                            true
                        ]);
                        tile.lastLifeValueShown = tile.life;
                    }

                    tile.lastLife = tile.life;
                }
                if (tile.life <= 0) {
                    tile.height -= 0.02;
                }
                if (tile.height <= 0) {
                    var explosionAudio = new Audio();
                    explosionAudio.src = sounds.explosion;
                    explosionAudio.play();
                    this.points += 30;
                    this.numbersToDraw.push([tile.x + tileSize / 2, tile.y + tileSize / 2, 30, 0, true]);
                    tile.type = 6;
                    tile.collision = false;
                    tile.explosionTick = 0;
                }
            }
        }
    }

    //draw numbers
    for (var i = this.numbersToDraw.length - 1; i >= 0; i--) {
        var number = this.numbersToDraw[i];
        number[3] += 2;
        text.drawNumber(
            number[0],
            number[1] - number[3] * 3,
            number[2],
            number[4] ?
            'rgba(65,105,225,' + (1 - number[3] * 0.01) + ')' :
            'rgba(178,34,34,' + (1 - number[3] * 0.01) + ')',
            'rgba(20,20,20,' + (1 - number[3] * 0.02) + ')',
            8,
            true);
        if (number[3] >= 100) {
            this.numbersToDraw.splice(i, 1);
        }
    }

    context.restore();

    //draw menus and text interface
    if (!this.started) {
        text.drawStart();
    } else {
        if (this.car.life <= 0) {
            text.drawFinalPoints();

            //try again?
            if (this.tryAgainTimeout > 100) {
                text.drawTryAgain();
            }
            this.tryAgainTimeout++;
        } else {
            text.drawPointsAndLife();
        }
    }

    //draw map
    // for (var i = 0; i < horizontalTiles; i++) {
    //     for (var j = 0; j < verticalTiles; j++) {
    //         switch(world.matrix[i][j].type) {
    //             case 4: context.fillStyle = 'rgb(150,0,0)'; break;
    //             case 3: context.fillStyle = 'rgb(128,128,128)'; break;
    //             case 2: context.fillStyle = 'rgb(65,105,225)'; break;
    //             case 1: context.fillStyle = 'rgb(64,64,64)'; break;
    //             default: context.fillStyle = 'rgb(0,128,0)';
    //         }
    //         context.fillRect(i * 2, j * 2, 2, 2);
    //     }
    // }

    requestAnimationFrame(this.draw.bind(this));
};

//Source: http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
var gameArea = document.getElementById('gameArea');
function resize() {
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
}
window.addEventListener('resize', resize, false);
window.addEventListener('orientationchange', resize, false);

resize();

var ap11 = new Ap11();
