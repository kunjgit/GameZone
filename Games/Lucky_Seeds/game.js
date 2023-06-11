// Lucky Seeds

(function() {

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

///////////////////////////////////////////////////////////////////////////////
// Constants

var CANVAS_WIDTH = 720,
    CANVAS_HEIGHT = 440;

var HEADER_HEIGHT = 40;

var SCROLLING_BG_WIDTH = 2160,
    SCROLLING_BG_HEIGHT = 440,
    SCROLLING_BG_STARS = 500,
    SCROLLING_BG_BUFFER_LENGTH = 10,
    SCROLLING_BG_SPEED = 0.3;

var SHIP_RADIUS = 10,
    SHIP_DIAMETER = 2 * SHIP_RADIUS,
    SHIP_SPEED_START = 2,
    SHIP_SPEED_MULTIPLIER = 0.5;

var LEVEL_SEEDS = 20,
    LEVEL_ROCKS = 25,
    LEVEL_BEACONS = 2,
    LEVEL_SPEED = 2,
    LEVEL_WIDTH_START = 3600,
    LEVEL_WIDTH_GROWTH = 720,
    LEVEL_HEIGHT = 440;

var SEED_RADIUS = 10,
    SEED_DIAMETER = 2 * SEED_RADIUS;
    
var ROCK_RADIUS = 10,
    ROCK_DIAMETER = 2 * ROCK_RADIUS;
    
var BEACON_RADIUS = 20,
    BEACON_DIAMETER = 2 * BEACON_RADIUS;
    
var MAX_SEED_INVENTORY = 9;

var ENTITY_TYPE = {
    HEART: 0,
    CLOVER: 1,
    STAR: 2,
    DIAMOND: 3,
    ROCK: 4,
    SHIP: 5,
    SHIP_BLINKING: 6,
    BEACON: 7,
    PARTICLE: 8
};

var MAX_LUCK = 10;

///////////////////////////////////////////////////////////////////////////////

var started = false;
var endGame = false;
var showTitle = true;
var init = false;

var mouseOverStartButton = false;

var scrollingBackgroundList = [];
var scrollingBackgroundCurrentIndex = 0;
var scrollingBackgroundNextIndex = 1;

var staticSeedList = [];

var seedInventoryList = [];
var updateSeedInventory = true;

var collidedSeedList = [];

var particleList = [];

var mouse = {
    x: 0,
    y: 0
};

var offsetX = 0;
var offsetY = 0;

var luck = 3;

var updateLuck = true;
var updateLevel = true;

var score = 0;

var blinkingLevelMod = 0;

/////////////////////////////////////////////////

var headerCanvas,
    headerContext,
    headerCanvasWidth,
    headerCanvasHeight,
    bgCanvas,
    bgContext,
    bgCanvasWidth,
    bgCanvasHeight,
    entityCanvas,
    entityCanvasContext,
    textCanvas,
    textContext,
    shipCanvas,
    shipContext,
    shipCanvasWidth,
    shipCanvasHeight,
    boundingClientRect,
    imageRepository,
    levelData,
    ship;

///////////////////////////////////////////////////////////////////////////////
// Math calculations

var getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
};

var isCircleCollision = function(x1, y1, r1, x2, y2, r2) {
    return ((r1 + r2) * (r1 + r2) >= (x1 - x2) * (x1 -x2) + (y1 - y2) * (y1 - y2));
};

///////////////////////////////////////////////////////////////////////////////
// Entity
// 
// x,y: upper left of box
// centerX, centerY: center of circle
var Entity = function(type, x, y, radius) {
    var that = this;
    
    // ENTITY_TYPE
    that.type = type;
    
    that.x = x;
    that.y = y;
    
    that.radius = radius || 0;
    that.diameter = 2 * radius;
    
    that.centerX = that.x + radius;
    that.centerY = that.y + radius;
 
    that.collided = false;
    that.alive = true;
    
    that.draw = function() {
        if (!that.collided) {
            bgContext.drawImage(
                    imageRepository.getImage(that.type), 
                    that.x, 
                    that.y);
        }
    };
};

var Beacon = function(type, x, y, radius) {
    var that = this;
    
    // ENTITY_TYPE
    that.type = type;
    
    that.x = x;
    that.y = y;
    
    that.radius = radius || 0;
    that.diameter = 2 * radius;
    
    that.centerX = that.x + radius;
    that.centerY = that.y + radius;
 
    that.collided = false;
    that.alive = true;
    
    that.rippleRadius = 1;
    that.rippleRadius2 = 4;
    
    that.draw = function() {
        if (that.collided) {
            bgContext.strokeStyle = "#000088";
        } else {
            bgContext.strokeStyle = "#FFFFFF";
        }

        bgContext.beginPath();
        bgContext.arc(that.centerX, that.centerY, that.rippleRadius, 0, 2 * Math.PI, true);
        bgContext.stroke();

        bgContext.beginPath();
        bgContext.arc(that.centerX, that.centerY, that.rippleRadius2, 0, 2 * Math.PI, true);
        bgContext.stroke();

        that.rippleRadius += (that.rippleRadius + 1) * 0.04;
        that.rippleRadius2 += (that.rippleRadius2 + 1) * 0.04;

        if (that.rippleRadius > that.radius) {
            that.rippleRadius = 1;
        }

        if (that.rippleRadius2 > that.radius) {
            that.rippleRadius2 = 1;
        }
    };
};

var Particle = function(type, x, y, radius, centerX, centerY) {
    var that = this;
    
    // ENTITY_TYPE
    that.type = type;
    
    that.x = x;
    that.y = y;
    
    that.radius = radius || 0;
    that.diameter = 2 * radius;
    
    that.centerX = centerX || that.x + radius;
    that.centerY = centerY || that.y + radius;
 
    that.collided = false;
    that.alive = true;
    
    that.vx = 0;
    that.vy = 0;
    that.color = "#FFFFFF";
    that.endGameParticle = false;
};

var Ship = function(type, centerX, centerY, radius) {
    var that = this;
    
    // ENTITY_TYPE
    that.type = type;
    
    that.centerX = centerX;
    that.centerY = centerY;
    
    that.radius = radius || 0;
    that.diameter = 2 * radius;
    
    that.speed = SHIP_SPEED_START;

    that.blinking = false;
    that.blinkingMod = 0;

    that.increaseSpeed = function() {
        that.speed += SHIP_SPEED_MULTIPLIER;
    };

    that.decreaseSpeed = function() {
        that.speed -= SHIP_SPEED_MULTIPLIER;
    };
};

Ship.prototype.init = function() {
    var that = this;
    
    that.centerX = mouse.x;
    that.centerY = mouse.y;
    
    that.speed = SHIP_SPEED_START + (luck * SHIP_SPEED_MULTIPLIER);
};

Ship.prototype.update = function() {
    var that = this;
    
    if (mouse.y < HEADER_HEIGHT + that.radius) {
        mouse.y = HEADER_HEIGHT + that.radius;
    }

    var distance = getDistance(mouse.x, mouse.y, that.centerX, that.centerY);
    
    // Clear current ship position
    shipCanvasContext.clearRect(
            that.centerX - that.radius - 1,
            that.centerY - that.radius - 1,
            that.diameter + 2,
            that.diameter + 2);

    if (distance > 4) {
        that.centerX += Math.floor(((mouse.x - that.centerX) / distance) * that.speed); 
        that.centerY += Math.floor(((mouse.y - that.centerY) / distance) * that.speed);
    }
};

Ship.prototype.draw = function() {
    var that = this;
    
    if (that.blinking) {
        that.blinkingMod++;
        if (that.blinkingMod % 10 < 5) {
            shipCanvasContext.drawImage(
                    imageRepository.getImage(ENTITY_TYPE.SHIP_BLINKING), 
                    that.centerX - that.radius,
                    that.centerY - that.radius);
        }
        
        if (that.blinkingMod > 40) {
            that.blinking = false;
            that.blinkingMod = 0;
        }
    } else {
        shipCanvasContext.drawImage(
                imageRepository.getImage(ENTITY_TYPE.SHIP), 
                that.centerX - that.radius, 
                that.centerY - that.radius);
    }
};

var Level = function() {
    var that = this;
    
    that.entityList = [];

    that.levelNumber = 1;
    that.levelWidth = 0;
    that.levelSpeed = 0;
    
    that.levelOffsetX = 0;
    that.levelOffsetY = 0;
};

Level.prototype.init = function() {
    var that = this;
    
    that.levelNumber = 1;
    that.levelOffsetX = 0;
    
    that.generateLevel();
};

Level.prototype.generateLevel = function() {
    var that = this;
    
    var randomX = 0;
    var randomY = 0;
    var randomShape = 0;
    
    var beaconIndex = 0;
    var seedIndex = 0;
    var rockIndex = 0;

    that.levelWidth = LEVEL_WIDTH_START + (that.levelNumber * LEVEL_WIDTH_GROWTH);
    that.levelSpeed = LEVEL_SPEED + Math.floor(that.levelNumber * 0.5);
    
    // Clear entityList array
    that.entityList.length = 0;

    // Create Beacons
    for (beaconIndex = 0; beaconIndex < LEVEL_BEACONS + Math.floor(that.levelNumber * 0.5); beaconIndex++) {
        if (0 === beaconIndex) {
            // Put a beacon at the end of the level
            randomX = getRandomNumber(that.levelWidth - CANVAS_WIDTH, that.levelWidth - BEACON_DIAMETER);
        } else {
            randomX = getRandomNumber(CANVAS_WIDTH * 2, that.levelWidth - BEACON_DIAMETER);
        }
        randomY = getRandomNumber(HEADER_HEIGHT, LEVEL_HEIGHT - BEACON_DIAMETER);

        that.entityList.push(new Beacon(ENTITY_TYPE.BEACON, randomX, randomY, BEACON_RADIUS));
    }

    // Create Seeds
    for (seedIndex = 0; seedIndex < LEVEL_SEEDS + Math.floor(that.levelNumber * 0.5); seedIndex++)
    { 
        randomX = getRandomNumber(CANVAS_WIDTH, that.levelWidth - SEED_DIAMETER);
        randomY = getRandomNumber(HEADER_HEIGHT, LEVEL_HEIGHT - SEED_DIAMETER);

        randomShape = getRandomNumber(0, 3);

        that.entityList.push(new Entity(randomShape, randomX, randomY, SEED_RADIUS));
    }
    
    // Create Rocks
    for (rockIndex = 0; rockIndex < LEVEL_ROCKS * that.levelNumber; rockIndex++)
    {
        randomX = getRandomNumber(CANVAS_WIDTH, that.levelWidth - ROCK_DIAMETER);
        randomY = getRandomNumber(HEADER_HEIGHT, LEVEL_HEIGHT - ROCK_DIAMETER);

        that.entityList.push(new Entity(ENTITY_TYPE.ROCK, randomX, randomY, ROCK_RADIUS));
    }
};

Level.prototype.checkEntityCollisions = function() {
    var that = this;
    
    var entityIndex = 0;
    
    var x = 0,
        y = 0,
        centerX = 0,
        centerY = 0,
        radius = 0,
        translatedX = 0,
        translatedY = 0,
        type = 0,
        setFound = true;

    var inventoryIndex = 0,
        particleIndex = 0;

    var randomCount = 0,
        randomRadius = 0,
        r = 0,
        g = 0,
        b = 0,
        randomDirX = 0,
        randomDirY = 0;
    
    for (entityIndex = 0; entityIndex < that.entityList.length; entityIndex++) {
        x = that.entityList[entityIndex].x;
        y = that.entityList[entityIndex].y;
        centerX = that.entityList[entityIndex].centerX;
        centerY = that.entityList[entityIndex].centerY;
        radius = that.entityList[entityIndex].radius;
        type = that.entityList[entityIndex].type;

        // Check if seed is in canvas view
        if (!that.entityList[entityIndex].collided &&
            x + that.entityList[entityIndex].diameter > -that.levelOffsetX &&
            x < -that.levelOffsetX + CANVAS_WIDTH) {

            translatedX = centerX + that.levelOffsetX;
            translatedY = centerY;

            if (isCircleCollision(
                    translatedX, 
                    translatedY, 
                    radius, 
                    ship.centerX, 
                    ship.centerY, 
                    SHIP_RADIUS)) {
                if (ENTITY_TYPE.HEART === type ||
                    ENTITY_TYPE.CLOVER === type ||
                    ENTITY_TYPE.STAR === type ||
                    ENTITY_TYPE.DIAMOND === type) {

                    that.entityList[entityIndex].collided = true;

                    collidedSeedList.push(new Entity(
                            type, 
                            translatedX - radius, 
                            translatedY - radius, 
                            radius));
                } else if (ENTITY_TYPE.BEACON === type) {
                    setFound = true;
            
                    for (inventoryIndex = 0; inventoryIndex < seedInventoryList.length; inventoryIndex++) {
                        if (0 === seedInventoryList[inventoryIndex]) {
                            setFound = false;
                        }
                    }
                
                    if (setFound) {
                        for (inventoryIndex = 0; inventoryIndex < seedInventoryList.length; inventoryIndex++) {
                            seedInventoryList[inventoryIndex]--;
                        }
                    
                        updateSeedInventory = true;
                    
                        that.entityList[entityIndex].collided = true;
                        luck++;
                        if (luck > MAX_LUCK) {
                            luck = MAX_LUCK;
                        } else {
                            ship.increaseSpeed();
                        }                  
                    
                        updateLuck = true;
                    
                        score += 500;
                    }
                } else if (ENTITY_TYPE.ROCK === type) {
                    if (!ship.blinking) {
                        luck--;
                        updateLuck = true;
                
                        if (0 === luck) {
                            randomCount = getRandomNumber(20, 30);

                            for (particleIndex = 0; particleIndex < randomCount; particleIndex++) {
                                randomRadius = getRandomNumber(3, 6);
                                particleList.push(new Entity(ENTITY_TYPE.PARTICLE, translatedX, translatedY, randomRadius));

                                r = Math.floor(Math.random() * 256);
                                g = Math.floor(Math.random() * 256);
                                b = Math.floor(Math.random() * 256);

                                particleList[particleList.length - 1].color = "rgb(" + r + "," + g + "," + b + ")";

                                randomDirX = getRandomNumber(0, 1);
                                randomDirY = getRandomNumber(0, 1);
                                particleList[particleList.length - 1].vx = randomDirX ? -getRandomNumber(1, 5) : getRandomNumber(1, 5);
                                particleList[particleList.length - 1].vy = randomDirY ? -getRandomNumber(1, 5) : getRandomNumber(1, 5);
                                particleList[particleList.length - 1].endGameParticle = true;
                            }
                        
                            endGame = true;
                        } else {                
                            that.entityList[entityIndex].collided = true;
                            ship.blinking = true;
                            ship.decreaseSpeed();

                            randomCount = getRandomNumber(5, 10);

                            for (particleIndex = 0; particleIndex < randomCount; particleIndex++) {
                                randomRadius = getRandomNumber(1, 3);
                                particleList.push(new Entity(ENTITY_TYPE.PARTICLE, translatedX, translatedY, randomRadius));


                                var randomDir = getRandomNumber(0, 1);
                                particleList[particleList.length - 1].vx = -getRandomNumber(3, 6);
                                particleList[particleList.length - 1].vy = randomDir ? -getRandomNumber(1, 3) : getRandomNumber(1, 3);
                                particleList[particleList.length - 1].color = "#CCCCCC";
                            }
                        }
                    }
                }
            }
        }
    }
};

Level.prototype.drawEntities = function() {
    var that = this;

    var x = 0;
    var entityIndex = 0;
    
    bgContext.save();
    bgContext.translate(that.levelOffsetX, that.levelOffsetY);

    // Draw all entities in array
    for (entityIndex = 0; entityIndex < that.entityList.length; entityIndex++) {
        x = that.entityList[entityIndex].x;
        
        if (x + that.entityList[entityIndex].diameter > -that.levelOffsetX &&
            x < -that.levelOffsetX + CANVAS_WIDTH) {
            that.entityList[entityIndex].draw();
        }
    }

    bgContext.restore();
    
    that.levelOffsetX -= that.levelSpeed;
    
    if (that.levelOffsetX < -that.levelWidth) {
        that.levelOffsetX = 0;
        
        that.levelNumber++;
        updateLevel = true;
        
        that.generateLevel();
    }
};

////////////////////////////////////////////////

var Game = function() {
};

Game.prototype.init = function() {
    headerCanvas = document.getElementById("headerCanvas");
    headerContext = headerCanvas.getContext("2d");

    headerCanvasWidth = headerCanvas.width;
    headerCanvasHeight = headerCanvas.height;

    bgCanvas = document.getElementById("bgCanvas");
    bgContext = bgCanvas.getContext("2d");

    bgCanvasWidth = bgCanvas.width;
    bgCanvasHeight = bgCanvas.height;

    entityCanvas = document.getElementById("entityCanvas");
    entityCanvasContext = entityCanvas.getContext("2d");

    textCanvas = document.getElementById("textCanvas");
    textContext = textCanvas.getContext("2d");

    shipCanvas = document.getElementById("shipCanvas");
    shipCanvasContext = shipCanvas.getContext("2d");

    shipCanvasWidth = shipCanvas.width;
    shipCanvasHeight = shipCanvas.height;

    boundingClientRect = shipCanvas.getBoundingClientRect();

    shipCanvas.style.cursor = "crosshair";

    shipCanvas.addEventListener('mousemove', handleMouseEvent, false);
    shipCanvas.addEventListener('click', handleMouseClickEvent, false);

    imageRepository = new ImageRepository();
    imageRepository.init();

    drawHeaderCanvas();
    drawScrollingBackgroundCanvas();

    levelData = new Level();
    levelData.init();

    ship = new Ship(ENTITY_TYPE.SHIP, 0, 0, SHIP_RADIUS);

    loop();  
};

Game.prototype.startGame = function() {
    var seedInventoryIndex = 0;
    
    // Clear canvas
    entityCanvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Clear seed inventory
    for (seedInventoryIndex = 0; seedInventoryIndex < seedInventoryList.length; seedInventoryIndex++) {
        seedInventoryList[seedInventoryIndex] = 0;
    }
       
    luck = 3;
    score = 0;

    updateSeedInventory = true;
    updateLuck = true;
    updateLevel = true;
        
    collidedSeedList.length = 0;
    particleList.length = 0;
        
    ship.init();
    levelData.init();    
};

Game.prototype.drawTitleBox = function(x, y) {
    shipCanvasContext.fillStyle = "rgba(0, 0, 155, 0.8)";
    shipCanvasContext.strokeStyle = "#0000EE";
    shipCanvasContext.fillRect(x, y, 700, 52);
    shipCanvasContext.strokeRect(x, y, 700, 52);

    shipCanvasContext.font = "30px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("Lucky Seeds", x + 270, y + 30);

    shipCanvasContext.font = "10px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("Created for GSSOC", x + 252, y + 45);
};

Game.prototype.drawStartBox = function(x, y) {
    shipCanvasContext.fillStyle = "rgba(0, 0, 155, 0.8)";
    shipCanvasContext.strokeStyle = "#0000EE";
    shipCanvasContext.fillRect(x, y, 86, 35);
    shipCanvasContext.strokeRect(x, y, 86, 35);

    shipCanvasContext.font = "20px Helvetica";
    shipCanvasContext.fillStyle = "#DDDDFF";
    shipCanvasContext.fillText("START", x + 11, y + 25);
};

Game.prototype.drawInstructionBox = function(x, y) {
    shipCanvasContext.fillStyle = "rgba(0, 0, 155, 0.8)";
    shipCanvasContext.strokeStyle = "#0000EE";
    shipCanvasContext.fillRect(x, y, 490, 140);
    shipCanvasContext.strokeRect(x, y, 490, 140);

    shipCanvasContext.font = "13px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("Instructions", x + 10, y + 23);

    shipCanvasContext.font = "12px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("1. Collect the four lucky seeds.", x + 15, y + 43);
    shipCanvasContext.drawImage(imageRepository.getImage(ENTITY_TYPE.HEART), x + 185, y + 28);
    shipCanvasContext.drawImage(imageRepository.getImage(ENTITY_TYPE.CLOVER), x + 215, y + 28);
    shipCanvasContext.drawImage(imageRepository.getImage(ENTITY_TYPE.STAR), x + 245, y + 28);
    shipCanvasContext.drawImage(imageRepository.getImage(ENTITY_TYPE.DIAMOND), x + 275, y + 28);

    shipCanvasContext.fillText("2. Each set of four lucky seeds will increase your luck when you touch a beacon.", x + 15, y + 63);
    shipCanvasContext.beginPath();
    shipCanvasContext.arc(x + 467, y + 58, 6, 0, 2 * Math.PI, true);
    shipCanvasContext.strokeStyle = "#FFFFFF";
    shipCanvasContext.stroke();
    shipCanvasContext.beginPath();
    shipCanvasContext.arc(x + 467, y + 58, 10, 0, 2 * Math.PI, true);
    shipCanvasContext.strokeStyle = "#FFFFFF";
    shipCanvasContext.stroke();

    shipCanvasContext.fillText("3. Avoid rocks.  Rocks will decrease your luck.", x + 15, y + 83);
    shipCanvasContext.drawImage(imageRepository.getImage(ENTITY_TYPE.ROCK), x + 270, y + 70);

    shipCanvasContext.fillText("4. You lose the game when you lose all your luck.", x + 15, y + 103);
    shipCanvasContext.fillText("5. The higher your luck, the faster your ship.", x + 15, y + 123);
};

Game.prototype.drawEndGameBox = function(x, y) {
    shipCanvasContext.fillStyle = "rgba(0, 0, 155, 0.8)";
    shipCanvasContext.strokeStyle = "#0000EE";
    shipCanvasContext.fillRect(x, y, 390, 70);
    shipCanvasContext.strokeRect(x, y, 390, 70);

    shipCanvasContext.font = "20px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("Game Over!", x + 150, y + 25);

    shipCanvasContext.font = "16px Helvetica";
    shipCanvasContext.fillStyle = "#FFFFFF";
    shipCanvasContext.fillText("Score: " + score, x + 40, y + 55);
    shipCanvasContext.fillText("Level: " + levelData.levelNumber, x + 280, y + 55);
};

Game.prototype.showTitle = function() {
    var that = this;
    
    shipCanvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    shipCanvasContext.fillRect(0, 0, shipCanvasWidth, shipCanvasHeight);

    that.drawTitleBox(10, 10);
    that.drawStartBox(40, 200);
    that.drawInstructionBox(200, 200);

    if (endGame) {
        endGame = false;

        // Draw this at the end of the game
        that.drawEndGameBox(165, 95);
    }
};
///

var loop = function() {
    
    if (showTitle) {
        showTitle = false;

        game.showTitle();
    }

    if (init) {
        init = false;
        
        game.startGame();
    }
    
    if (!started) {
        if (mouse.x >= HEADER_HEIGHT && mouse.x <= 126 &&
            mouse.y >= 200 && mouse.y <= 235) {
            shipCanvasContext.strokeStyle = "#EE0000";
            shipCanvasContext.strokeRect(40, 200, 85, 35);
            mouseOverStartButton = true;
        } else {
            shipCanvasContext.strokeStyle = "#0000EE";
            shipCanvasContext.strokeRect(40, 200, 85, 35);
            mouseOverStartButton = false;
        }
    }
    
    var seedX = 0;
    var seedY = 0;
    var seedCenterX = 0;
    var seedCenterY = 0;
    var seedRadius = 0;
    var seedType = 0;
    
    var collidedSeedIndex = 0;
    var distance = 0;
    
    var particleIndex = 0;

    if (started && !endGame) {
        ship.update();

        levelData.checkEntityCollisions();

        for (collidedSeedIndex = 0; collidedSeedIndex < collidedSeedList.length; collidedSeedIndex++) {
            seedX = collidedSeedList[collidedSeedIndex].x;
            seedY = collidedSeedList[collidedSeedIndex].y;
            seedCenterX = collidedSeedList[collidedSeedIndex].centerX;
            seedCenterY = collidedSeedList[collidedSeedIndex].centerY;
            seedRadius = collidedSeedList[collidedSeedIndex].radius;
            seedType = collidedSeedList[collidedSeedIndex].type;

            if (collidedSeedList[collidedSeedIndex].alive) {
                // Clear current position
                entityCanvasContext.clearRect(
                        seedX, 
                        seedY, 
                        collidedSeedList[collidedSeedIndex].diameter, 
                        collidedSeedList[collidedSeedIndex].diameter);

                distance = getDistance(
                        staticSeedList[seedType].centerX,
                        staticSeedList[seedType].centerY,
                        seedCenterX,
                        seedCenterY);

                if (distance > 4) {
                    seedCenterX += Math.floor(((staticSeedList[seedType].centerX - seedCenterX) / distance) * 7);
                    seedCenterY += Math.floor(((staticSeedList[seedType].centerY - seedCenterY) / distance) * 7);

                    collidedSeedList[collidedSeedIndex].centerX = seedCenterX;
                    collidedSeedList[collidedSeedIndex].centerY = seedCenterY;
                    collidedSeedList[collidedSeedIndex].x = seedCenterX - seedRadius;
                    collidedSeedList[collidedSeedIndex].y = seedCenterY - seedRadius;
                } else {
                    collidedSeedList[collidedSeedIndex].alive = false;

                    // update current inventory
                    seedInventoryList[seedType]++;
                    if (seedInventoryList[seedType] > MAX_SEED_INVENTORY) {
                        seedInventoryList[seedType] = MAX_SEED_INVENTORY;
                    }

                    score += 100;
                    updateSeedInventory = true;
                }
            }
        }
        
        for (collidedSeedIndex = 0; collidedSeedIndex < collidedSeedList.length; collidedSeedIndex++) {
            if (!collidedSeedList[collidedSeedIndex].alive) {
                collidedSeedList.splice(particleIndex, 1);
            }
        }
    }

    if (started) {
        for (particleIndex = 0; particleIndex < particleList.length; particleIndex++) {
            if (particleList[particleIndex].alive) {
                // Clear current particle position
                entityCanvasContext.clearRect(
                    particleList[particleIndex].x,
                    particleList[particleIndex].y,
                    particleList[particleIndex].radius,
                    particleList[particleIndex].radius);

                particleList[particleIndex].x += particleList[particleIndex].vx;
                particleList[particleIndex].y += particleList[particleIndex].vy;

                if (particleList[particleIndex].x < 0 ||
                    particleList[particleIndex].x > CANVAS_WIDTH ||
                    particleList[particleIndex].y < 0 ||
                    particleList[particleIndex].y > CANVAS_HEIGHT) {
                    particleList[particleIndex].alive = false;

                    if (particleList[particleIndex].endGameParticle) {
                        showTitle = true;
                        started = false;
                    }
                }
            }
        }
        
        for (particleIndex = 0; particleIndex < particleList.length; particleIndex++) {
            if (!particleList[particleIndex].alive) {
                particleList.splice(particleIndex, 1);
            }
        }
    }

    requestAnimationFrame(loop);

    drawBackground();
        
    if (started) {
        drawEntities();
        
        if (!endGame) {
            ship.draw();
        }
    }
};

///////////////

var ImageRepository = function() {
    var that = this;
    
    var imageList = [];

    that.init = function() {
        imageList[ENTITY_TYPE.HEART] = drawHeartCanvas();
        imageList[ENTITY_TYPE.CLOVER] = drawCloverCanvas();
        imageList[ENTITY_TYPE.STAR] = drawStarCanvas();
        imageList[ENTITY_TYPE.DIAMOND] = drawDiamondCanvas();
        imageList[ENTITY_TYPE.ROCK] = drawRockCanvas();
        imageList[ENTITY_TYPE.SHIP] = drawShipCanvas();
        imageList[ENTITY_TYPE.SHIP_BLINKING] = drawBlinkingShipCanvas();
    };
    
    that.getImage = function(type) {
        return imageList[type];
    };
    
    var drawHeartCanvas = function() {
        var centerX = SEED_RADIUS,
            centerY = SEED_RADIUS,
            heartCanvas = document.createElement("canvas"),
            heartContext = heartCanvas.getContext("2d");

        heartCanvas.width = heartCanvas.height = SEED_DIAMETER;

        heartContext.beginPath();
        heartContext.arc(centerX - 4, centerY - 3, 4, 0, 2 * Math.PI, true);
        heartContext.arc(centerX + 4, centerY - 3, 4, 0, 2 * Math.PI, true);
        heartContext.moveTo(centerX, centerY - 4);
        heartContext.lineTo(centerX + 8, centerY - 1);
        heartContext.lineTo(centerX, centerY + 8);
        heartContext.lineTo(centerX - 8, centerY - 1);
        heartContext.moveTo(centerX, centerY - 4);
        heartContext.lineTo(centerX + 8, centerY - 1);
        heartContext.lineTo(centerX, centerY + 8);
        heartContext.lineTo(centerX - 8, centerY - 1);

        var heartGradient = heartContext.createRadialGradient(centerX, centerY, 2, centerX, centerY, 10);
        heartGradient.addColorStop(0, "#AA0000");
        heartGradient.addColorStop(1, "#FF0000");
        heartContext.fillStyle = heartGradient;
        heartContext.fill();        

        return heartCanvas;
    };
    
    var drawCloverCanvas = function() {
        var centerX = SEED_RADIUS,
            centerY = SEED_RADIUS,
            cloverCanvas = document.createElement("canvas"),
            cloverContext = cloverCanvas.getContext("2d");

        cloverCanvas.width = cloverCanvas.height = SEED_DIAMETER;

        cloverContext.beginPath();
        cloverContext.arc(centerX - 4, centerY - 4, 4, 0, 2 * Math.PI, true);
        cloverContext.moveTo(centerX + 4, centerY - 4);
        cloverContext.arc(centerX + 4, centerY - 4, 4, 0, 2 * Math.PI, true);
        cloverContext.moveTo(centerX + 4, centerY + 4);
        cloverContext.arc(centerX + 4, centerY + 4, 4, 0, 2 * Math.PI, true);
        cloverContext.moveTo(centerX - 4, centerY + 5);
        cloverContext.arc(centerX - 4, centerY + 4, 4, 0, 2 * Math.PI, true);
        cloverContext.moveTo(centerX, centerY);
        cloverContext.arc(centerX, centerY, 4, 0, 2 * Math.PI, true);

        var cloverGradient = cloverContext.createRadialGradient(centerX, centerY, 2, centerX, centerY, 10);
        cloverGradient.addColorStop(0, "#00FF00");
        cloverGradient.addColorStop(1, "#00BB00");
        cloverContext.fillStyle = cloverGradient;
        cloverContext.fill();

        return cloverCanvas;    
    };

    var drawStarCanvas = function() {
        var centerX = SEED_RADIUS,
            centerY = SEED_RADIUS,
            starCanvas = document.createElement("canvas"),
            starContext = starCanvas.getContext("2d");

        starCanvas.width = starCanvas.height = SEED_DIAMETER;

        starContext.beginPath();
        starContext.moveTo(centerX, centerY - 10);
        starContext.lineTo(centerX - 6, centerY + 9); //bgContext.lineTo(380, 360);
        starContext.lineTo(centerX + 9, centerY - 3);
        starContext.lineTo(centerX - 9, centerY - 3);
        starContext.lineTo(centerX + 6, centerY + 9); //bgContext.lineTo(420, 355);
        starContext.lineTo(centerX, centerY - 10);

        var starGradient = starContext.createRadialGradient(centerX, centerY, 2, centerX, centerY, 10);
        starGradient.addColorStop(0, "#FFDD00");
        starGradient.addColorStop(1, "#FFEE00");
        starContext.fillStyle = starGradient;
        starContext.fill();

        return starCanvas;
    };

    var drawDiamondCanvas = function() {
        var centerX = SEED_RADIUS,
            centerY = SEED_RADIUS,
            diamondCanvas = document.createElement("canvas"),
            diamondContext = diamondCanvas.getContext("2d");

        diamondCanvas.width = diamondCanvas.height = SEED_DIAMETER;

        diamondContext.beginPath();
        diamondContext.moveTo(centerX, centerY - 9);
        diamondContext.lineTo(centerX - 7, centerY);
        diamondContext.lineTo(centerX, centerY + 9);
        diamondContext.lineTo(centerX + 7, centerY);
        diamondContext.lineTo(centerX, centerY - 9);

        var diamondGradient = diamondContext.createRadialGradient(centerX, centerY, 2, centerX, centerY, 10);
        diamondGradient.addColorStop(0, "#5555FF");
        diamondGradient.addColorStop(1, "#CCCCFF");
        diamondContext.fillStyle = diamondGradient;

        diamondContext.fill();
        
        return diamondCanvas;
    };

    var drawRockCanvas = function() {
        var centerX = ROCK_RADIUS,
            centerY = ROCK_RADIUS,
            rockCanvas = document.createElement("canvas"),
            rockContext = rockCanvas.getContext("2d");

        rockCanvas.width = rockCanvas.height = ROCK_DIAMETER;

        rockContext.beginPath();
        rockContext.moveTo(centerX, centerY - 9);
        rockContext.lineTo(centerX - 9, centerY);
        rockContext.lineTo(centerX, centerY + 7);
        rockContext.lineTo(centerX + 4, centerY);
        rockContext.lineTo(centerX, centerY - 7);        
        rockContext.lineTo(centerX - 2, centerY + 6);
        rockContext.lineTo(centerX + 6, centerY - 3);
        rockContext.lineTo(centerX - 9, centerY - 9);
        rockContext.lineTo(centerX + 3, centerY + 9);
        rockContext.lineTo(centerX, centerY - 9);

        var rockGradient = rockContext.createRadialGradient(centerX, centerY, 2, centerX, centerY, 10);
        rockGradient.addColorStop(0, "#555555");
        rockGradient.addColorStop(1, "#EEEEEE");
        rockContext.fillStyle = rockGradient;
        rockContext.fill();

        return rockCanvas;
    };

    var drawShipCanvas = function() {
        var centerX = SHIP_RADIUS,
            centerY = SHIP_RADIUS,
            shipCanvas = document.createElement("canvas"),
            shipContext = shipCanvas.getContext("2d");

        shipCanvas.width = shipCanvas.height = SHIP_DIAMETER;

        shipContext.fillStyle = "rgba(50, 100, 200, 1)"; //"#449488";
        shipContext.strokeStyle = "#CCFF00";

        shipContext.beginPath();
        shipContext.arc(centerX, centerY, 9, 0, 2 * Math.PI, true);
        shipContext.fill();
        shipContext.stroke();
        
        return shipCanvas;
    };

    var drawBlinkingShipCanvas = function() {
        var centerX = SHIP_RADIUS,
            centerY = SHIP_RADIUS,
            blinkingShipCanvas = document.createElement("canvas"),
            blinkingShipContext = blinkingShipCanvas.getContext("2d");

        blinkingShipCanvas.width = blinkingShipCanvas.height = SHIP_DIAMETER;

        blinkingShipContext.fillStyle = "rgba(50, 100, 200, 0.5)"; //"#449488";
        blinkingShipContext.strokeStyle = "#CCFF00";

        blinkingShipContext.beginPath();
        blinkingShipContext.arc(centerX, centerY, 9, 0, 2 * Math.PI, true);
        blinkingShipContext.fill();
        blinkingShipContext.stroke();
        
        return blinkingShipCanvas;
    };
};

/////

var drawHeaderCanvas = function() {
    //var headerGradient = headerContext.createLinearGradient(0,0,400,0);
    //headerGradient.addColorStop(0,"#0000CC");
    //headerGradient.addColorStop(1,"#000044");

    // Draw header with gradient
    //headerContext.fillStyle = headerGradient;
    
    headerContext.fillStyle = "rgba(0, 0, 200, 0.5)";
    headerContext.fillRect(0, 0, headerCanvasWidth, HEADER_HEIGHT);

    // Draw a line
    headerContext.fillStyle = "#0000CC";
    headerContext.fillRect(0, 38, headerCanvasWidth, 2);
    
    // Draw Inventory
    headerContext.drawImage(imageRepository.getImage(ENTITY_TYPE.HEART), 250, 10);
    headerContext.drawImage(imageRepository.getImage(ENTITY_TYPE.CLOVER), 300, 10);
    headerContext.drawImage(imageRepository.getImage(ENTITY_TYPE.STAR), 350, 10);
    headerContext.drawImage(imageRepository.getImage(ENTITY_TYPE.DIAMOND), 400, 10);

    staticSeedList[ENTITY_TYPE.HEART] = new Entity(ENTITY_TYPE.HEART, 250, 10, SEED_RADIUS);
    staticSeedList[ENTITY_TYPE.CLOVER] = new Entity(ENTITY_TYPE.CLOVER, 300, 10, SEED_RADIUS);
    staticSeedList[ENTITY_TYPE.STAR] = new Entity(ENTITY_TYPE.STAR, 350, 10, SEED_RADIUS);
    staticSeedList[ENTITY_TYPE.DIAMOND] = new Entity(ENTITY_TYPE.DIAMOND, 400, 10, SEED_RADIUS);

    seedInventoryList[ENTITY_TYPE.HEART] = 0;
    seedInventoryList[ENTITY_TYPE.CLOVER] = 0;
    seedInventoryList[ENTITY_TYPE.STAR] = 0;
    seedInventoryList[ENTITY_TYPE.DIAMOND] = 0;
    
    // Luck Header
    headerContext.fillStyle = "#FFFFFF";
    headerContext.font = "14px Helvetica";
    headerContext.fillText("Luck:", 15, 25);
    
    // Level Header
    headerContext.fillStyle = "#FFFFFF";
    headerContext.font = "14px Helvetica";
    headerContext.fillText("Level:", 170, 25);
    
    // Score Header
    headerContext.fillStyle = "#FFFFFF";
    headerContext.font = "14px Helvetica";
    headerContext.fillText("Score:", 480, 25);
};

////////////////

// var backgroundCanvas;
// var backgroundContext;

var drawScrollingBackgroundCanvas = function() {
    for (var canvasIndex = 0; canvasIndex < SCROLLING_BG_BUFFER_LENGTH; canvasIndex++) {
        var backgroundCanvas = document.createElement("canvas");
        backgroundCanvas.width = SCROLLING_BG_WIDTH;
        backgroundCanvas.height = SCROLLING_BG_HEIGHT;

        var backgroundContext = backgroundCanvas.getContext("2d");

        var gradient = backgroundContext.createLinearGradient(0, 0, SCROLLING_BG_WIDTH, 0);
        gradient.addColorStop(0, "#000000");

        // Randomize the middle gradient color (choose dull colors)
        var r = Math.floor(Math.random() * 80),
            g = Math.floor(Math.random() * 80),
            b = Math.floor(Math.random() * 80);

        gradient.addColorStop(0.5, "rgb(" + r + "," + g + "," + b + ")");
        gradient.addColorStop(1, "#000000");

        backgroundContext.fillStyle = gradient;
        backgroundContext.fillRect(0, 0, SCROLLING_BG_WIDTH, SCROLLING_BG_HEIGHT);

        // Draw starry background
        backgroundContext.fillStyle = "#FFFFFF";

        // Create random X and Y coordinates for the background stars
        for (var starIndex = 0; starIndex < SCROLLING_BG_STARS; starIndex++)
        {
            var randomX = Math.floor(Math.random() * (SCROLLING_BG_WIDTH + 1));
            var randomY = Math.floor(Math.random() * (SCROLLING_BG_HEIGHT + 1));
            backgroundContext.fillRect(randomX, randomY, 1, 1);
        }
        //
        scrollingBackgroundList.push(backgroundCanvas);
    }
};

////////////////

var drawBackground = function() {
    bgContext.drawImage(scrollingBackgroundList[scrollingBackgroundCurrentIndex], Math.floor(offsetX), 0 - offsetY);
       
    if (offsetX < -(SCROLLING_BG_WIDTH - bgCanvasWidth)) {
        bgContext.drawImage(scrollingBackgroundList[scrollingBackgroundNextIndex], Math.floor(offsetX) + SCROLLING_BG_WIDTH, 0 - offsetY);
    }
    
    offsetX -= SCROLLING_BG_SPEED;
    
    if (offsetX <= -SCROLLING_BG_WIDTH) {
        offsetX = 0;
        scrollingBackgroundCurrentIndex = scrollingBackgroundNextIndex;
        scrollingBackgroundNextIndex = getRandomNumber(0, SCROLLING_BG_BUFFER_LENGTH - 1);
    }
};

var drawEntities = function() {
    levelData.drawEntities();

    var collidedSeedIndex = 0;
    
    for (collidedSeedIndex = 0; collidedSeedIndex < collidedSeedList.length; collidedSeedIndex++) {
        if (collidedSeedList[collidedSeedIndex].alive) {           
            xPos = collidedSeedList[collidedSeedIndex].x;
            yPos = collidedSeedList[collidedSeedIndex].y;
            type = collidedSeedList[collidedSeedIndex].type;

            entityCanvasContext.drawImage(imageRepository.getImage(type), xPos, yPos);
        }
    }
    
    // Draw Particles  
    var particleIndex = 0;
    for (particleIndex = 0; particleIndex < particleList.length; particleIndex++) {
        if (particleList[particleIndex].alive) {
            entityCanvasContext.fillStyle = particleList[particleIndex].color;
            entityCanvasContext.fillRect(
                particleList[particleIndex].x,
                particleList[particleIndex].y,
                particleList[particleIndex].radius,
                particleList[particleIndex].radius);
        }
    }
    
    if (updateSeedInventory) {
        updateSeedInventory = false;
        
        // Clear current inventory display
        textContext.clearRect(275, 10, 20, 20); // Heart
        textContext.clearRect(325, 10, 20, 20); // Clover
        textContext.clearRect(375, 10, 20, 20); // Star
        textContext.clearRect(425, 10, 20, 20); // Diamond
        
        // Inventory text
        textContext.font = "14px Helvetica";
    
        textContext.fillStyle = "#FF8888";
        textContext.fillText(seedInventoryList[ENTITY_TYPE.HEART].toString(), 280, 25); // Heart  
    
        textContext.fillStyle = "#00FF00";
        textContext.fillText(seedInventoryList[ENTITY_TYPE.CLOVER].toString(), 330, 25); // Clover
    
        textContext.fillStyle = "#FFFF00";
        textContext.fillText(seedInventoryList[ENTITY_TYPE.STAR].toString(), 380, 25); // Star
    
        textContext.fillStyle = "#AAAAFF";
        textContext.fillText(seedInventoryList[ENTITY_TYPE.DIAMOND].toString(), 430, 25); // Diamond
        
        textContext.clearRect(524, 10, 105, 20);
        textContext.fillStyle = "#FFFFFF";
        textContext.fillText(score.toString(), 525, 25);
    }
    
    if (updateLuck) {
        updateLuck = false;
        
        // Clear the current luck count
        textContext.clearRect(53, 10, 112, 20);

        var xPos = 54,
            yPos = 12,
            widthBuffer = 4,
            width = 7,
            height = 16;

        if (1 === luck) {
            textContext.fillStyle = "#FF0000";
        } else if (2 === luck) {
            textContext.fillStyle = "#FFFF00";
        } else if (3 === luck) {
            textContext.fillStyle = "#77DD00";
        } else {
            textContext.fillStyle = "#00DD00";
        }
        
        for (var i = 0; i < luck; i++) {
            textContext.fillRect(xPos, yPos, width, height);
            xPos += width + widthBuffer;
        }
    }
    
    if (updateLevel) {        
        textContext.clearRect(210, 10, 35, 20);

        blinkingLevelMod++;
        if (blinkingLevelMod % 10 < 5) {
            textContext.fillStyle = "#FFFFFF";
        } else {
            textContext.fillStyle = "#000000";
        }
        
        if (blinkingLevelMod > 40) {
            updateLevel = false;
            textContext.fillStyle = "#FFFFFF";
            blinkingLevelMod = 0;
        }

        textContext.fillText(levelData.levelNumber.toString(), 212, 25); 
    }
};

//////////////
      
var handleMouseClickEvent = function(mouseEvent) {
    if (!started) {
        if (mouseOverStartButton) {
            started = true;
            init = true;
            shipCanvasContext.clearRect(0, 0, shipCanvasWidth, shipCanvasHeight);
        }
    }
};
      
var handleMouseEvent = function(mouseEvent) {
    mouse.x = mouseEvent.clientX - boundingClientRect.left;
    mouse.y = mouseEvent.clientY - boundingClientRect.top;
};

///////////////////
// Canvas Check
var testCanvas = document.createElement('canvas');
if (testCanvas.getContext && testCanvas.getContext('2d')) {
    var testContext = testCanvas.getContext('2d');
    if (typeof testContext.fillText === 'function') {
        var game = new Game();
        game.init();
    }
}

}());