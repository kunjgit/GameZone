const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const spaceshipImage = new Image();
spaceshipImage.src = 'assets/img/spaceship.png'; // Replace with the actual path to your spaceship image

const asteroidImage = new Image();
asteroidImage.src = 'assets/img/asteroid.png'; // Replace with the actual path to your asteroid image

const spaceship = {
  x: canvas.width / 2 - 25, // Adjust the x position to center the image
  y: canvas.height - 260,
  width: 150,
  height: 250,
  speed: 5
};

let asteroids = [];
const asteroidSpeed = 8;
const asteroidInterval = 700; // Interval to create new asteroids (in milliseconds)
let lastAsteroidTime = 0;

let gameOver = false;

function endGame() {
  gameOver = true;
  document.getElementById('gameOver').classList.remove('hidden');
}

document.getElementById('restartButton').addEventListener('click', () => {
  location.reload(); // Restart the game
});

function drawSpaceship() {
  ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawAsteroids() {
  for (const asteroid of asteroids) {
    const asteroidWidth = 120; // Adjust the width of the asteroid
    const asteroidHeight = 120; // Adjust the height of the asteroid
    ctx.drawImage(asteroidImage, asteroid.x, asteroid.y, asteroidWidth, asteroidHeight);
  }
}

function update() {
  if (gameOver) {
    return; // Stop the game if it's over
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move spaceship
  if (keyState['ArrowLeft'] && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  }
  if (keyState['ArrowRight'] && spaceship.x < canvas.width - spaceship.width) {
    spaceship.x += spaceship.speed;
  }

  // Create new asteroids
  const currentTime = Date.now();
  if (currentTime - lastAsteroidTime > asteroidInterval) {
    const asteroid = {
      x: Math.random() * (canvas.width - 30),
      y: 0,
      width: 30,
      height: 30
    };
    asteroids.push(asteroid);
    lastAsteroidTime = currentTime;
  }

  // Move asteroids
  for (const asteroid of asteroids) {
    asteroid.y += asteroidSpeed;
  }

  // Check for collisions
  for (const asteroid of asteroids) {
    if (
      spaceship.x < asteroid.x + asteroid.width &&
      spaceship.x + spaceship.width > asteroid.x &&
      spaceship.y < asteroid.y + asteroid.height &&
      spaceship.y + spaceship.height > asteroid.y
    ) {
      endGame();
      return;
    }
  }

  drawSpaceship();
  drawAsteroids();

  requestAnimationFrame(update);
}

// Keyboard input handling
const keyState = {};
window.addEventListener('keydown', (event) => {
  keyState[event.key] = true;
});
window.addEventListener('keyup', (event) => {
  keyState[event.key] = false;
});

update();
