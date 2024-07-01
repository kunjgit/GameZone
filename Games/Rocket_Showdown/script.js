// Game parameters
let canvas, centerPoint, ctx, game_mode, playing, player1, player2, start;
// The scoreboard is used to keep track of the health of the players at the top of the screen
const scoreboard = document.querySelector(".scoreboard");
// Each player has a shield score in percent
const shield_p1 = document.querySelector(".shield_p1");
const shield_p2 = document.querySelector(".shield_p2");
// The game over screen has an explosion controlled and sized with two variables
const crash = document.querySelector(".crash");
const explosion = document.querySelector(".explosion");
// The result screen has a customised message and result of the game
const message = document.querySelector(".message");
const result = document.querySelector(".result");
// Each of the planet graphics is dynamically styled and positioned
const planet1 = document.querySelector(".planet-one");
const planet2 = document.querySelector(".planet-two");
// The space variable is where the stars are drawn
const space = document.querySelector(".space");
// On the start screen there are buttons to toggle whether the player is a computer or human
const playerOneToggle = document.querySelector("#playerOne");
const playerTwoToggle = document.querySelector("#playerTwo");
// There is also a toggle button for the asteroids to create variety in the game
const asteroidsToggle = document.querySelector("#obstacles");
// The gutter hides the new asteroids being added to the game so it is best to keep the rocket on screen to avoid being hit
const gutter = 150;
// For the popup boxes there is a background overlay
const overlay = document.getElementById("overlay");
// The popup messages has its own selector so that they can be toggled from the start screen to the end game screen
let popup = document.getElementById("popup");
const contenders = document.getElementById("contenders");
const p1_graphic = document.getElementById("player1");
const p2_graphic = document.getElementById("player2");
// Asteroid parameters group
let asteroids;
let asteroidColor;
// How often new asteroids appear on screen
const asteroidRate = 200;
// The maximum number of asteroids that can be in the game at any given time
let asteroidMax = 5;
// Start the timeout at zero
let asteroidTimeout = 0;
// Define subtle colour differences between the size of the asteroids
const asteroidColors = ["#9F96BC", "#666078", "#494556"];
// The maximum size of the asteroids
const asteroidSizeMax = 30;
// The maximum speed of the asteroids
const asteroidSpeed = 2;
// How big the asteroids should split when they are broken
const splitSize = 10;

// Rocket parameters
const rocketSize = 33;
const rocketWidth = 40;
const rocketArea = 1236.22;
const acceleration = 0.15;
const turnRate = 5;

// Shooting parameters
const shootingRate = 10;
const shootingSpeed = 12;

// Function to handle SVG files
function importSVG(name) {
  const svg = document.getElementById(name);
  let object_svg = new Image();
  const data = new XMLSerializer().serializeToString(svg);
  object_svg.src = "data:image/svg+xml;base64," + window.btoa(data); // The btoa() method encodes a string in base-64
  return object_svg;
}

// Import the inline SVG elements
let player1_svg = importSVG("player1");
let player2_svg = importSVG("player2");
let flicker_svg = importSVG("flicker");

// Set the size of the explosion early on because the size changes with the animation cause a bug
const explosionSize = {
  width: (explosion.getBoundingClientRect().width / 2).toFixed(),
  height: (explosion.getBoundingClientRect().height / 2).toFixed()
};

// Popup UI handling
function openPopup() {
  start = popup.querySelector(".start-button");
  start.addEventListener("click", startGame);
  contenders.style.display = "block";
  popup.style.display = "block";
  overlay.style.display = "block";
  contenders.style.opacity = "1";
  popup.style.opacity = "1";
  overlay.style.opacity = "0.6";
}

function closePopup() {
  start.removeEventListener("click", startGame);
  overlay.style.opacity = "0";
  popup.style.opacity = "0";
  contenders.style.opacity = "0";
  popup.style.display = "none";
  overlay.style.display = "none";
  contenders.style.display = "none";
}

// The following function creates a tesseract effect to keep the game objects roughly on screen
function tesseractMove() {
  // If on the right side of the screen then come back on the left side
  if (this.x > canvas.width + gutter) {
    this.x = 0 - gutter / 2 + this.vx;
  } else if (this.x < 0 - gutter) {
    // Or if they go off the left side then they come back on the right
    this.x = canvas.width + gutter / 2 + this.vx;
  } else {
    // Otherwise just update the x position with the velocity
    this.x += this.vx;
  }
  // If on the bottom side of the screen then come back on the top side
  if (this.y > canvas.height + gutter) {
    this.y = 0 - gutter / 2 + this.vy;
  } else if (this.y < 0 - gutter) {
    // Or if they go off the top side then they come back on the bottom
    this.y = canvas.height + gutter / 2 + this.vy;
  } else {
    // Otherwise just update the y position with the velocity
    this.y += this.vy;
  }
}

// Function to check whether two positions intersect other by returning a distance
function checkBoundary(dot1, dot2) {
  const x1 = dot1[0],
    y1 = dot1[1],
    x2 = dot2[0],
    y2 = dot2[1];
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// Math functions
function rad(angle) {
  return angle * Math.PI / 180;
}

// Define a new rocket with a token and a role
function Rocket(token, role) {
  // Give the rocket an ID based on the token of its creation
  this.id = token;
  // Starting position for player one is on the left of the screen
  if (token == "one") {
    this.x = canvas.width / 4;
  } else {
    // The other player starts on the right hand side of the screen
    this.x = canvas.width / 4 * 3;
  }
  // Both players start in the middle of the y axis
  this.y = centerPoint.y;

  // Starting velocity is 0 on both axis
  this.vx = 0;
  this.vy = 0;

  // Rocket controls
  this.thruster = false;
  this.rotateLeft = false;
  this.rotateRight = false;
  this.fire = false;
  // Set the SVG to use
  if (token == "one") {
    this.svg = player1_svg;
    this.score = shield_p1;
  } else {
    this.svg = player2_svg;
    this.score = shield_p2;
  }

  // Set rocket dependent timeouts
  this.shotTimeout = shootingRate;
  this.flameTimeout = 0;
  // Starting health for the rockets is 100% and the game ends when one rocket reaches zero
  this.health = 100;
  // Set the direction for the rocket to be facing this needs to match the SVG direction to avoid a display bug on Safari (90 is towards the top of the screen)
  if (token == "one") {
    // Player one faces the bottom of the screen to match the start screen graphic
    this.direction = 270;
  } else {
    this.direction = 90;
  }

  // Store all rocket's shots in an array
  this.shots = [];

  // Rocket methods
  this.getPoints = getRocketPoints;
  this.update = updateRocket;
  this.move = tesseractMove;
  this.render = renderRocket;
}

// Define the Enemy object which is a computer controlled Rocket
function Enemy(token, role) {
  // The enemy takes all the parameters of the Rocket
  Rocket.call(this, token, role);
  // The enemy also has a "sworn enemy" which is the oposing player and is defined in the start game function
  this.swornEnemy = "";
  // New direction to calculate how much the Enemy should turn
  this.newDirection = 0;
  // Result of the difference between the direction and the new direction
  this.angleDiff = 0;
  // New position to define where the Enemy should aim at
  this.newPosition = {
    x: 0,
    y: 0
  };
  // Set an interval for how often the Enemy should be searching
  this.searchInterval = 0;
  // Check if the Enemy has found its target
  this.targetFound = false;
  // Set an interval for how often the Enemy moves
  this.moveInterval = 0;
  // Set an interval for how often the Enemy should panic
  this.panicInterval = 50;
  // Set the proximity for how close the Enemy is to its target
  this.proximity = 0;
  // Check if the Enemy is "safe" and out of the proximity of other game objects
  this.safe = true;
  // Store the closest target to the Enemy
  this.closestTarget = "";
  // Track the distance of the closest target
  this.closestDistance = 0;
  // Create a random reaction if the target is too close
  this.fightOrFlight = 0;
}

// Setup the Enemy prototype
Enemy.prototype = Object.create(Rocket.prototype);
Object.defineProperty(Enemy.prototype, "constructor", {
  value: Enemy,
  enumerable: false,
  writable: true
});

// Give the enemy player a set of functions which creates a behaviour
Enemy.prototype.behaviour = function() {
  // Keep the direction within 360 degrees
  if (this.direction > 360) {
    this.direction -= 360;
  } else if (this.direction < 0) {
    this.direction += 360;
  }
  // If the enemy is "safe" then give it a fight or flight instinct
  if (this.safe) {
    this.fightOrFlight = randomise(2);
  }
  // Set a function to create random numbers to make less predictable behaviour
  function randomise(max) {
    return Math.floor(Math.random() * max);
  }
  // Function to set a new position for the enemy to target and move to
  const randomPosition = function() {
    this.newPosition.x = randomise(canvas.width);
    this.newPosition.y = randomise(canvas.height);
  }.bind(this);

  // Set function to find the angle of the target from the enemy's rocket's position
  const findAngle = function(target) {
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    let angle = Math.atan2(dy, dx);
    if (this.safe) {
      this.newPosition.x = this.x - dx;
      this.newPosition.y = this.y - dy;
    }
    // Set the newDirection based on the calculated angle of the given target
    this.newDirection = 180 - angle * (180 / Math.PI);
    // The enemy needs to work out the quickest way to turn to face the target
    this.angleDiff = this.newDirection - this.direction;
    if (this.angleDiff < -180) {
      this.angleDiff = this.angleDiff + 360;
    } else if (this.angleDiff > 180) {
      this.angleDiff = this.angleDiff - 360;
    }
    this.angleDiff = this.angleDiff.toFixed();
  }.bind(this);
  // Set a function to turn the rocket to face the target
  const turnToFace = function(target) {
    if (this.targetFound) {
      return;
    } else if (this.angleDiff > 5) {
      this.rotateLeft = true;
      this.rotateRight = false;
      return;
    } else if (this.angleDiff < 5) {
      this.rotateLeft = false;
      this.rotateRight = true;
      return;
    } else {
      this.targetFound = true;
      this.rotateLeft = false;
      this.rotateRight = false;
      return;
    }
  }.bind(this);
  // Try to mimic human behaviour so only shoot if the target is in range
  const shootIfInRange = function() {
    if (this.angleDiff < 7 && this.angleDiff > -7) {
      this.fire = true;
    } else {
      this.fire = false;
    }
  }.bind(this);
  // Vary the thruster usage
  const move = function() {
    if (this.moveInterval <= 0) {
      if (this.thruster == false) {
        this.thruster = true;
        this.moveInterval = randomise(12) + 6;
      } else {
        this.thruster = false;
        this.moveInterval = randomise(30) + 80;
      }
    } else {
      this.moveInterval--;
    }
  }.bind(this);
  // Set the attack function in bursts
  const attack = function(target) {
    if (this.searchInterval <= 0) {
      this.targetFound = false;
      this.fire = false;
      this.searchInterval = randomise(30) + 35;
    } else {
      this.searchInterval--;
    }
    // First find the angle
    findAngle(target);
    // Then shoot if in range
    if (this.targetFound) {
      shootIfInRange();
      // Don't move towards the target
      this.thruster = false;
    } else {
      // Otherwise move towards the target
      turnToFace(target);
      this.thruster = true;
    }
    move();
  }.bind(this);

  // Find a new direction
  const changeDirection = function() {
    randomPosition();
    this.safe = false;
  }.bind(this);

  // Define a flee function
  const flee = function() {
    // If the enemy was "safe" then it should change direction!
    if (this.safe) {
      // To help change direction there should be a new position
      changeDirection();
      // The enemy needs to use the thruster to flee
      this.thruster = true;
    }
    // The enemy should then find out what the new angle is
    findAngle(this.newPosition);
    // The enemy turns to face the new direction and moves towards it
    turnToFace(this.newPosition);
    move();
    // The panic interval gives the chance to find a new position if the enemy doesn't feel like it can find a "safe" position
    if (this.panicInterval <= 0) {
      // Setting safe to true will cause the algoritm to find a new position on the next iteration
      this.safe = true;
      // Then the panic interval should be reset to a new randomised value
      this.panicInterval = randomise(60) + 30;
    } else {
      // Otherwise the panic interval is just counting down to zero
      this.panicInterval--;
    }
  }.bind(this);
  // Define an ability for the Enemy to find the closest target
  const findClosest = function(target) {
    // The following calculates the distance between the target and the Enemy
    let dist_x = this.x - target.x;
    let dist_y = this.y - target.y;
    this.proximity = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
  }.bind(this);
  // While checking for the closest distance we need to set the distance which is the closest
  const setClosest = function() {
    this.closestDistance = this.proximity;
  }.bind(this);
  // First option should always be the sworn enemy
  findClosest(this.swornEnemy);
  // Set this as a default value
  this.closestTarget = this.swornEnemy;
  // Set the distance
  setClosest();
  // Make similar checks on the other objects in the game
  if (obstacles) {
    for (let i = 0; i < asteroids.length; i++) {
      findClosest(asteroids[i]);
      if (this.proximity < this.closestDistance) {
        this.closestTarget = asteroids[i];
        setClosest();
      }
    }
  }
  // Define what the Enemy should do with the variables it has calculated
  if (this.closestDistance < 150) {
    this.fire = true;
    // If too close to the target then it should consider to attack or flee
    if (this.fightOrFlight === 0) {
      attack(this.closestTarget);
    } else {
      flee();
    }
    // From a bit further away the more likely option could be to flee
  } else if (this.closestDistance < 300 || !this.safe) {
    flee();
    // Fire in case things get in the way
    this.fire = true;
    // If the Enemy feels safe then it will attack
  } else if (this.safe) {
    // Switch off the fire option
    this.fire = false;
    attack(this.closestTarget);
    // If there is some distance between the Enemy and the target then it can consider itself "safe" and attack from a distance
  } else if (this.closestDistance > 500) {
    this.safe = true;
    this.fire = false;
    this.thruster = false;
    attack(this.closestTarget);
  }
};

// Calculate the position of the rocket
function getRocketPoints() {
  // Store the points in an array to loop over later
  let points = [];
  // Define the left and right sides based on the direction
  let leftSide = rad(this.direction - rocketWidth);
  let rightSide = rad(this.direction + rocketWidth);
  // Simplify the rocket's shape to a triangle
  // Rocket top point
  points.push([
    this.x + rocketSize * Math.cos(rad(this.direction)),
    this.y - rocketSize * Math.sin(rad(this.direction))
  ]);
  // Rocket left point
  points.push([
    this.x - rocketSize * Math.cos(leftSide),
    this.y + rocketSize * Math.sin(leftSide)
  ]);
  // Rocket right point
  points.push([
    this.x - rocketSize * Math.cos(rightSide),
    this.y + rocketSize * Math.sin(rightSide)
  ]);
  // Return the array of points
  return points;
}

// Update the effects on the rocket
function updateRocket() {
  // If pushing the up key then apply the thruster
  if (this.thruster) {
    this.vx += acceleration * Math.cos(rad(this.direction));
    this.vy -= acceleration * Math.sin(rad(this.direction));
  }
  // Left rotates the rocket anti-clockwise
  if (this.rotateLeft) {
    this.direction += turnRate;
  }
  // Right rotates the rocket clockwise
  if (this.rotateRight) {
    this.direction -= turnRate;
  }
  // If the rocket is firing with the spacebar
  if (this.fire) {
    // Limit the shots being fired with a timeout
    if (this.shotTimeout >= shootingRate) {
      // Get the points for the rocket to work out where the rocket is firing from
      let position = this.getPoints();
      // Add a new shot taking into account the direction the shot is being fired and who fired the shot
      this.shots.push(
        new Shot(position[0][0], position[0][1], this.direction, this.id)
      );
      // Reset the timeout
      this.shotTimeout = 0;
    } else {
      // Otherwise increase the timeout
      this.shotTimeout++;
    }
    // If not firing
  } else {
    // Reset shot timeout directly
    this.shotTimeout = shootingRate;
  }
  // Loop through all the shots and update them all
  for (let i = 0; i < this.shots.length; i++) {
    this.shots[i].update(i);
    if (this.shots[i].hit == true) {
      // Remove shots that have hit a game object
      this.shots.splice(i, 1);
    }
  }

  // If the rocket is moving then slow this motion slightly
  if (this.vx != 0) {
    // Reduce X velocity
    this.vx -= 0.01 * this.vx;
  }
  if (this.vy != 0) {
    // Reduce Y velocity
    this.vy -= 0.01 * this.vy;
  }
  // Move the rocket
  this.move();
}
// Try to prevent collisions by using the rockets' shields to repel each other
function collisionPrevention() {
  // Calculate the distance between the plater and enemy
  let dist_x = player1.x - player2.x;
  let dist_y = player1.y - player2.y;
  // Get the repel distance
  let repel = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
  // If the rockets are too close to each other
  if (repel < 40) {
    // Set new repel variables for x and y
    let repelX = dist_x / repel;
    let repelY = dist_y / repel;
    // Apply this to both rockets
    player1.vx += repelX * 5;
    player1.vy += repelY * 5;
    player2.vx -= repelX * 5;
    player2.vy -= repelY * 5;
    // Reduce the health of both rockets as a consequence of the impact on the shield
    player1.health -= 5;
    player2.health -= 5;
  }
}

// Function to render the appearence of the rocket
function renderRocket() {
  // Get the points of the rocket
  let points = this.getPoints();
  // Calculate the angle it is facing
  let angle = rad((this.direction + 270) * -1);
  // The following between "save" and "restore" is used to position the SVG image in the right place and angle
  ctx.save();
  ctx.translate(points[0][0], points[0][1]);
  ctx.rotate(angle);
  ctx.translate(-33.85, 0);
  ctx.drawImage(this.svg, 0, 0);
  // Adding in the addition of the rocket's thruster if it is active
  if (this.thruster) {
    // First reset the timeout if the thruster key is pushed
    this.flameTimeout = 12;
  }
  // If the timeout is above zero then add the flicker svg
  if (this.flameTimeout > 0) {
    ctx.drawImage(flicker_svg, 0, 0);
    this.flameTimeout--;
  }
  ctx.restore();
  // Loop through all the shots
  for (let i = 0; i < this.shots.length; i++) {
    // And display the shot on the screen
    this.shots[i].render();
  }
}

// For a little variation let the asteroid color depend on the size
function sizeColor(size) {
  if (size > 30) {
    return 2;
  } else if (size > 20) {
    return 1;
  } else {
    return 0;
  }
}

// Define a new Asteroid
function Asteroid(x, y, size, vx, vy) {
  // Position on the x and y axis
  this.x = x;
  this.y = y;
  this.size = size;
  this.radius = size * 2 + 5;
  this.vx = vx;
  this.vy = vy;

  // Store the position of the points on the asteroid
  this.points = [];
  for (let i = 0; i < size; i++) {
    // Calculate random sizes to create an asteroid-like jagged edge
    let dist = Math.random() * 15 - 5 + this.radius;
    // Distrubute the points around the whole circumference of the asteroid
    let angle = i * 360 / size;
    // Add the randomly calculated point to the array
    this.points.push([
      dist * Math.cos(rad(angle)),
      dist * Math.sin(rad(angle))
    ]);
  }

  //Define the color of the asteroid based on the size
  this.color = sizeColor(this.size);

  // Define the methods of the asteroid
  this.explode = explodeAsteroid;
  this.update = updateAsteroid;
  this.move = tesseractMove;
  this.render = renderAsteroid;
}

// Define what happens when the asteroid is blasted by a shot from the rocket
function explodeAsteroid() {
  // Reduce the size by the predefined split size variable
  if (this.size - splitSize >= splitSize - 1) {
    // This leaves two new asteroids, the first being the reduced size of the original
    asteroids.push(
      new Asteroid(this.x, this.y, this.size - splitSize, this.vx, this.vy)
    );
    // The second asteroid is the broken off piece
    asteroids.push(
      new Asteroid(
        this.x,
        this.y,
        splitSize,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      )
    );
  }
}

// Update the affects of the asteroid
function updateAsteroid(num) {
  // Set the asteroid's position in an array to check for collisions
  const asteroid_xy = [this.x, this.y];
  // Define a function to check the proximity of the game's active rockets
  function checkProximity(target) {
    // Avoid checking asteroids that have already been removed
    if (asteroids[num] === undefined) {
      return;
    }
    // Need to load in the rocket points to check for collisions
    let rocketPoints = target.getPoints();
    // Check all the rocket's points for collisions
    for (let i = 0; i < rocketPoints.length; i++) {
      // Check whether the rocket has crashed into the asteroid
      let proximityToRocket = checkBoundary(asteroid_xy, [
        rocketPoints[i][0],
        rocketPoints[i][1]
      ]);
      // If the proximity is less than the radius then there has been a collision and reduce the health based on the radius of the asteroid
      if (proximityToRocket < asteroids[num].radius) {
        target.health -= (asteroids[num].radius / 4).toFixed();
        asteroids[num].explode();
        asteroids.splice(num, 1);
        return;
      }
    }
  }

  // Need to check the proximity of both of the players with the asteroids
  checkProximity(player1);
  checkProximity(player2);
  // Don't check an asteroid if it was removed
  if (asteroids[num] === undefined) {
    return;
  } else {
    // Move the asteroids
    asteroids[num].move();
  }
}

// Define the appearance of the asteroids
function renderAsteroid() {
  ctx.beginPath();
  ctx.moveTo(this.x + this.points[0][0], this.y + this.points[0][1]);
  for (let i = this.size - 1; i >= 0; i -= 1) {
    ctx.lineTo(this.x + this.points[i][0], this.y + this.points[i][1]);
  }
  ctx.fillStyle = asteroidColor;
  ctx.fill();
}

// Define a new shot being made in the game
function Shot(x, y, direction, owner) {
  this.x = x;
  this.y = y;
  this.vx = shootingSpeed * Math.cos(rad(direction));
  this.vy = -shootingSpeed * Math.sin(rad(direction));
  this.hit = false;
  this.owner = owner;
  // Define player based shot colours
  if (owner == "one") {
    this.color = "#5ecb84";
  } else {
    this.color = "#EDBB0B";
  }
  // Shot methods
  this.update = updateShot;
  this.render = renderShot;
}

// Update the game affects on the shot
function updateShot(slug) {
  // If the shot goes off screen then just count it as a hit for it to be easily removed from the game
  if (
    this.x > canvas.width + gutter ||
    this.x < 0 - gutter ||
    this.y > canvas.height + gutter ||
    this.y < 0 - gutter
  ) {
    this.hit = true;
  }
  // If the shot hasn't hit anything so far
  if (!this.hit) {
    function checkProximity(target, slug) {
      // Need the rocket to check for collisions
      const points = target.getPoints();
      // Rocket co-ordinates for calculating the areas
      const aX = points[0][0];
      const aY = points[0][1];
      const bX = points[2][0];
      const bY = points[2][1];
      const cX = points[1][0];
      const cY = points[1][1];
      // Shot co-ordinates
      const sX = slug.x;
      const sY = slug.y;
      // Calculate the combined areas of the shot and the target
      const area1 = Math.abs(
        (sX * (bY - cY) + bX * (cY - sY) + cX * (sY - bY)) / 2
      ); // SBC
      const area2 = Math.abs(
        (aX * (sY - cY) + sX * (cY - aY) + cX * (aY - sY)) / 2
      ); // ASC
      const area3 = Math.abs(
        (aX * (bY - sY) + bX * (sY - aY) + sX * (aY - bY)) / 2
      ); // ABS
      const area = (area1 + area2 + area3).toFixed(2);
      // If the rocket area is the same as the area calculated above then the shot has hit the target
      if (rocketArea == area) {
        slug.hit = true;
        target.health--;
      }
    }
    // Only check for collisions with the oposing player
    if (this.owner == "one") {
      checkProximity(player2, this);
    } else {
      checkProximity(player1, this);
    }
  }
  // If the shot still hasn't hit anything and obstacles were enabled
  if (!this.hit && obstacles) {
    // Check all the asteroids for collisions
    for (let i = 0; i < asteroids.length; i++) {
      let proximityToAsteroid = checkBoundary(
        [asteroids[i].x, asteroids[i].y],
        [this.x, this.y]
      );
      // Check whether the proximity is less than the asteroid's radius
      if (proximityToAsteroid <= asteroids[i].radius) {
        // Explode the asteroid which was hit, this creates two smaller asteroids
        asteroids[i].explode();
        // Remove the asteroid from the game
        asteroids.splice(i, 1);
        // The shot has hit something and will be removed from the game
        this.hit = true;
      }
    }
  }
  // Now remove the shot from the game if it has hit something
  if (this.hit == true) {
    return;
  } else {
    // Otherwise move the shot according to the velocity
    this.x += this.vx;
    this.y += this.vy;
  }
}

// Define how the shot looks on screen
function renderShot() {
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x + this.vx, this.y + this.vy);
  ctx.stroke();
}

// Show the shield health of both players but only update it if there has been a change
function renderScore(target) {
  let count = target.score.innerHTML;
  if (playing && target.health < count) {
    target.score.innerHTML = target.health;
  }
}

// Define a function which is checking for the end of the game
function checkGameStatus() {
  // First check if both players have been destroyed
  if (player1.health <= 0 && player2.health <= 0) {
    gameOver("tie");
    // Check player 1's health
  } else if (player1.health <= 0) {
    gameOver(player1);
    // Check player 2's health
  } else if (player2.health <= 0) {
    gameOver(player2);
  }
}

// Handling the random position of the background planet
function placePlanet(planet) {
  let x = Math.floor(Math.random() * canvas.width);
  let y = Math.floor(Math.random() * canvas.height);
  // Vary the scale to keep the background interesting
  let scale = 0.5 + Math.random() * 2;
  let transform = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
  planet.style.transform = transform;
}

// Deciding where things should go
function placeElements() {
  // Changing the opacity is to prevent a visual bug
  planet1.style.opacity = 0;
  planet2.style.opacity = 0;
  space.style.opacity = 0;
  // Calculate the new solar system layout
  placePlanet(planet1);
  placePlanet(planet2);
  createStars();
  // Make the elements visible again
  planet1.style.opacity = 1;
  planet2.style.opacity = 1;
  space.style.opacity = 1;
}

// Fill the background with randomly positioned stars
function createStars() {
  let heightMax = window.innerHeight - 4,
    widthMax = window.innerWidth - 4;
  space.innerHTML = "";

  for (let i = 0; i < 50; i++) {
    const star =
      '\n <div style="left:' +
      Math.floor(Math.random() * widthMax) +
      "px; top:" +
      Math.floor(Math.random() * heightMax) +
      "px; height:" +
      Math.ceil(Math.random() * 100) / 100 +
      "vmax; width:" +
      Math.ceil(Math.random() * 100) / 100 +
      'vmax;" class="star star' +
      i +
      '"><svg viewBox="0 0 513 513"><use xlink:href="#star"/></svg></div>';
    space.insertAdjacentHTML("beforeend", star);
  }
}

// Calculate the sizes for the game which are dependent on the window size
function calculateSizes() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerPoint = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };
  // Hide the score counter for the start of the game
  scoreboard.style.opacity = 0;
}

// Variables relating to the start screen toggles
let playerOne = true;
let playerTwo = false;
let obstacles = true;

// Inverse the option
function toggleOption(option) {
  return !option;
}

// Switch the player from computer to human
function switchPlayer(target) {
  if (target) {
    return "Computer";
  } else {
    return "Human";
  }
}

// Switch the obstacles on or off
function switchObstacles() {
  if (obstacles) {
    return "Asteroids: On";
  } else {
    return "Asteroids: Off";
  }
}

// Button event listeners
playerOneToggle.addEventListener("click", function() {
  playerOne = toggleOption(playerOne);
  this.textContent = switchPlayer(playerOne);
});

playerTwoToggle.addEventListener("click", function() {
  playerTwo = toggleOption(playerTwo);
  this.textContent = switchPlayer(playerTwo);
});
asteroidsToggle.addEventListener("click", function() {
  obstacles = toggleOption(obstacles);
  this.textContent = switchObstacles();
});

// Define if the player takes the Rocket or Enemy object
function setPlayer(toggle, number) {
  // Checking if the toggle is true which means that it is computer controlled and takes the Enemy class
  if (toggle == true) {
    return new Enemy(number, "computer");
  } else {
    // If not true then the player is human
    return new Rocket(number, "human");
  }
}
// Define the changes to be made at the start of the game
function startGame() {
  // Setup the background
  placeElements();
  // Empty the arrays of asteroids
  asteroids = [];
  // Create the players for the new game
  player1 = setPlayer(playerOne, "one");
  player2 = setPlayer(playerTwo, "two");
  // Define the sworn enemy of the players if they are controlled by the computer
  if (playerOne == true) {
    player1.swornEnemy = player2;
  }
  if (playerTwo == true) {
    player2.swornEnemy = player1;
  }
  // Reset the scoreboard
  shield_p1.innerHTML = player1.health;
  shield_p2.innerHTML = player2.health;
  scoreboard.style.opacity = 1;
  // Hide the explosion
  crash.style.opacity = 0;
  explosion.classList.remove("explode");
  // Close the popup UI
  closePopup();
  // Reset the result and message
  result.innerHTML = "";
  message.innerHTML = "";
  // Set playing to true to start the game!
  playing = true;
  // Set the interval to make the game work
  game_mode = setInterval(function() {
    if (playing) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Add new asteroids based on a timeout and if toggled on at the start screen
      if (obstacles) {
        if (
          asteroidTimeout >= asteroidRate &&
          asteroids.length <= asteroidMax
        ) {
          // Choose a side at random
          let side = Math.floor(Math.random() * 2);
          if (side == 0) {
            // Place the asteroid at the left side
            asteroids.push(
              new Asteroid(
                -gutter,
                Math.random() * canvas.height,
                Math.floor(Math.random() * asteroidSizeMax) + 10,
                Math.random() * asteroidSpeed,
                Math.random() * (asteroidSpeed * 2) - asteroidSpeed
              )
            );
          } else if (side == 1) {
            // Place the asteroid at the right side
            asteroids.push(
              new Asteroid(
                canvas.width + gutter,
                Math.random() * canvas.height,
                Math.floor(Math.random() * asteroidSizeMax) + 10,
                Math.random() * -asteroidSpeed,
                Math.random() * (asteroidSpeed * 2) - asteroidSpeed
              )
            );
          }
          // Reset the timeout
          asteroidTimeout = 0;
        } else {
          // If a new asteroid isn't being made then increase the timeout
          asteroidTimeout++;
        }
      }
      // Check for computer controlled players and apply the behaviour algorithm
      if (playerOne == true) {
        player1.behaviour();
      }
      if (playerTwo == true) {
        player2.behaviour();
      }
      // Calculate the player position
      player1.update();
      // Calculate the enemy's position
      player2.update();
      // Check for potential collisions
      collisionPrevention();
      // Loop over the asteroids array and update them all if the obstacles are toggled on
      if (obstacles) {
        for (let i = 0; i < asteroids.length; i++) {
          // Calculate the asteroids' positions
          asteroids[i].update(i);
        }
      }
      // Render the player's position
      player1.render();
      // Render the enemy's position
      player2.render();
      // Loop through and render the asteroids in order of colour to optimize canvas capabilities
      if (obstacles) {
        for (let i = 0; i < asteroidColors.length; i++) {
          asteroidColor = asteroidColors[i];
          for (let j = 0; j < asteroids.length; j++) {
            if (asteroids[j].color == i) {
              // Render the asteroids if the colour matches
              asteroids[j].render();
            }
          }
        }
      }
      // Render the score for both players
      renderScore(player1);
      renderScore(player2);
      // Check for potential game over condition
      checkGameStatus();
    }
    // If the game ends during the updates then make sure that everything gets rendered first before clearing the interval
    if (!playing) {
      clearInterval(game_mode);
    }
  }, 1000 / 60);
}

// Define what happens at the end of the game
function gameOver(target) {
  p1_graphic.style.opacity = 0;
  p2_graphic.style.opacity = 0;
  // Stop the game from being played
  playing = false;
  // If the window was resized
  if (target == "resized") {
    result.innerHTML = "The game is using your screen size.";
    message.innerHTML = "Don't resize the screen during the game.";
  } else if (target == "tie") {
    // If the game was a tie.
    result.innerHTML = "TIE!";
    message.innerHTML = "Both rockets exploded, try again?";
  } else if (target == player1) {
    // If player1 caused the game to end
    p2_graphic.style.opacity = 1;
    result.innerHTML = "Red Rocket Is Victorious!";
  } else if (target == player2) {
    // If player2 caused the game to end
    p1_graphic.style.opacity = 1;
    result.innerHTML = "Blue Rocket Is Victorious!";
  }
  // Set the explosion for the middle of the screen it it was a tie
  if (target == "tie") {
    target = centerPoint;
  }
  // Define the place for the end game graphic to be displayed using the target that caused the game to end
  const x = target.x - explosionSize.width;
  const y = target.y - explosionSize.height;
  // For variation add some rotation to the graphic
  degrees = Math.floor(Math.random() * 360);
  // Compile the transform properties
  const transform =
    "translate(" + x + "px, " + y + "px) rotate(" + degrees + "deg)";
  // Sednd the transform to the container for the graphic
  crash.style.transform = transform;
  // Make the graphic visible
  crash.style.opacity = 1;
  // Add the class that triggers the end game animation
  explosion.classList.add("explode");
  // Make sure that the results popup screen is selected
  popup = document.getElementById("results");
  // Show the popup UI to the player
  openPopup();
}

// Define what to do when the page loads
document.addEventListener("DOMContentLoaded", function(event) {
  // Define the sizes based on the user's window
  calculateSizes();
  // Place the background elements
  placeElements();
  // Open the popup UI for the player
  openPopup();
  // Define keyboard functions
  document.addEventListener(
    "keydown",
    function(event) {
      if (event.defaultPrevented) {
        return;
      }
      if (playing) {
        // Prevent the default keyboard function while playing the game
        event.preventDefault();
        const key = event.code || event.key || event.keyCode; // Preferred order
        // If player two is not a computer
        if (playerTwo == false) {
          switch (key) {
            case "ArrowUp": // event.key || event.code
            case 38: // event.keyCode
              // Apply Thruster
              player2.thruster = true;
              break;
            case "ArrowLeft": // event.key || event.code
            case 37: // event.keyCode
              // Rotate Left
              player2.rotateLeft = true;
              break;
            case "ArrowRight": // event.key || event.code
            case 39: // event.keyCode
              // Rotate Right
              player2.rotateRight = true;
              break;
            case "Space": // event.code
            case " ": // event.key
            case 32: // event.keyCode
              // Start firing
              player2.fire = true;
              break;
          }
        }
        // If player one is not a computer
        if (playerOne == false) {
          switch (key) {
            case "KeyW": // event.code
            case "w": // event.key
            case 87: // event.keyCode
              player1.thruster = true;
              break;
            case "KeyA": // event.code
            case "a": // event.key
            case 65: // event.keyCode
              // Stop rotating Left
              player1.rotateLeft = true;
              break;
            case "KeyD": // event.code
            case "d": // event.key
            case 68: // event.keyCode
              // Stop rotating Right
              player1.rotateRight = true;
              break;
            case "KeyZ": // event.code
            case "z": // event.key
            case 90: // event.keyCode
              // Stop firing
              player1.fire = true;
              break;
          }
        }
      }
    },
    true
  );

  document.addEventListener(
    "keyup",
    function(event) {
      if (event.defaultPrevented) {
        return;
      }
      const key = event.code || event.key || event.keyCode; // Preferred order
      if (playing) {
        // If player two is not a computer
        if (playerTwo == false) {
          switch (key) {
            case "ArrowUp": // event.key || event.code
            case 38: // event.keyCode
              // Apply Thruster
              player2.thruster = false;
              break;
            case "ArrowLeft": // event.key || event.code
            case 37: // event.keyCode
              // Rotate Left
              player2.rotateLeft = false;
              break;
            case "ArrowRight": // event.key || event.code
            case 39: // event.keyCode
              // Rotate Right
              player2.rotateRight = false;
              break;
            case "Space": // event.code
            case " ": // event.key
            case 32: // event.keyCode
              // Start firing
              player2.fire = false;
              break;
          }
        }
        //if player one is not a computer
        if (playerOne == false) {
          switch (key) {
            case "KeyW": // event.code
            case "w": // event.key
            case 87: // event.keyCode
              player1.thruster = false;
              break;
            case "KeyA": // event.code
            case "a": // event.key
            case 65: // event.keyCode
              // Stop rotating Left
              player1.rotateLeft = false;
              break;
            case "KeyD": // event.code
            case "d": // event.key
            case 68: // event.keyCode
              // Stop rotating Right
              player1.rotateRight = false;
              break;
            case "KeyZ": // event.code
            case "z": // event.key
            case 90: 
              player1.fire = false;
              break;
          }
        }
      }
    },
    true
  );

  // If the window is resized
  window.addEventListener("resize", function(event) {
    calculateSizes();
    if (playing) {
      gameOver("resized");
    }
  });
});
