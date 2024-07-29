const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const startButton = document.getElementById('start-button');
const background = document.getElementById('background');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');

let gameInterval;
let lights = [];
let obstacles = [];
let powerUps = [];
let isGameRunning = false;
let score = 0;
let time = 60;

startButton.addEventListener('click', startGame);

function startGame() {
  resetGame();
  isGameRunning = true;
  gameInterval = setInterval(updateGame, 20);
}

function resetGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  lights.forEach(light => gameArea.removeChild(light));
  obstacles.forEach(obstacle => gameArea.removeChild(obstacle));
  powerUps.forEach(powerUp => gameArea.removeChild(powerUp));
  lights = [];
  obstacles = [];
  powerUps = [];
  score = 0;
  time = 60;
  updateHUD();
  winMessage.style.display = 'none';
  loseMessage.style.display = 'none';
  player.style.top = '50%'; 
  player.style.left = '50%'; 
  createLights();
  createObstacles();
  createPowerUps();
}

function updateHUD() {
  scoreDisplay.textContent = `Score: ${score}`;
  timeDisplay.textContent = `Time: ${time}`;
}

function moveElements() {
  lights.forEach((light, index) => {
    const top = parseFloat(light.style.top);
    if (top > gameArea.offsetHeight) {
      gameArea.removeChild(light);
      lights.splice(index, 1);
      createLights();
    } else {
      light.style.top = `${top + 2}px`;
    }
  });

  obstacles.forEach((obstacle, index) => {
    const top = parseFloat(obstacle.style.top);
    if (top > gameArea.offsetHeight) {
      gameArea.removeChild(obstacle);
      obstacles.splice(index, 1);
      createObstacles();
    } else {
      obstacle.style.top = `${top + 2}px`;
    }
  });

  powerUps.forEach((powerUp, index) => {
    const top = parseFloat(powerUp.style.top);
    if (top > gameArea.offsetHeight) {
      gameArea.removeChild(powerUp);
      powerUps.splice(index, 1);
      createPowerUps();
    } else {
      powerUp.style.top = `${top + 2}px`;
    }
  });
}

function updateGame() {
  moveElements();
  checkCollisions();
  updatePlayerPosition();
  updateHUD();
}

function checkCollisions() {
  const isShadowPresent = document.getElementById('background').classList.contains('shadow');
  const player = document.getElementById('player');
  const gameArea = document.getElementById('game-area');
  const scoreElement = document.getElementById('score');

  lights.forEach((light, index) => {
    if (isColliding(player, light)) {
      if (isShadowPresent) {
        light.style.width = `${parseFloat(light.style.width) * 2}px`;
        light.style.height = `${parseFloat(light.style.height) * 2}px`;
        score -= 10; 
      } else {
        score -= 5;
      }
      gameArea.removeChild(light);
      lights.splice(index, 1);
      createLights();
    }
  });

  obstacles.forEach((obstacle, index) => {
    if (isColliding(player, obstacle)) {
      if (isShadowPresent) {
        obstacle.style.width = `${parseFloat(obstacle.style.width) * 2}px`;
        obstacle.style.height = `${parseFloat(obstacle.style.height) * 2}px`;
        score += 30; 
      } else {
        score += 15;
      }
      gameArea.removeChild(obstacle);
      obstacles.splice(index, 1);
      createObstacles();
    }
  });

  powerUps.forEach((powerUp, index) => {
    if (isColliding(player, powerUp)) {
      if (isShadowPresent) {
        powerUp.style.width = `${parseFloat(powerUp.style.width) * 2}px`;
        powerUp.style.height = `${parseFloat(powerUp.style.height) * 2}px`;
        score += 20; // Double score if shadow is present
      } else {
        score += 10;
      }
      gameArea.removeChild(powerUp);
      powerUps.splice(index, 1);
      createPowerUps();
    }
  });

  scoreElement.textContent = `Score: ${score}`;
}

function isColliding(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

function updatePlayerPosition() {
  if (keysPressed['ArrowUp']) {
    player.style.top = `${Math.max(0, player.offsetTop - 5)}px`;
  }
  if (keysPressed['ArrowDown']) {
    player.style.top = `${Math.min(gameArea.offsetHeight - player.offsetHeight, player.offsetTop + 5)}px`;
  }
  if (keysPressed['ArrowLeft']) {
    player.style.left = `${Math.max(0, player.offsetLeft - 5)}px`;
  }
  if (keysPressed['ArrowRight']) {
    player.style.left = `${Math.min(gameArea.offsetWidth - player.offsetWidth, player.offsetLeft + 5)}px`;
  }
}

const keysPressed = {};
window.addEventListener('keydown', event => {
  keysPressed[event.key] = true;
});
window.addEventListener('keyup', event => {
  delete keysPressed[event.key];
});

function gameOver(win) {
  isGameRunning = false;
  clearInterval(gameInterval);
  if (win) {
    winMessage.style.display = 'block';
  } else {
    loseMessage.style.display = 'block';
  }
}

setInterval(() => {
  if (isGameRunning && time > 0) {
    time--;
    updateHUD();
  } else if (isGameRunning && time <= 0) {
    gameOver(true);
  }
}, 1000);

function createLights() {
  const light = document.createElement('div');
  light.className = 'light';
  light.style.top = '0px';
  light.style.left = `${Math.random() * (gameArea.offsetWidth - 100)}px`;
  gameArea.appendChild(light);
  lights.push(light);
}

function createObstacles() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.top = '0px';
  obstacle.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

function createPowerUps() {
  const powerUp = document.createElement('div');
  powerUp.className = 'power-up';
  powerUp.style.top = '0px';
  powerUp.style.left = `${Math.random() * (gameArea.offsetWidth - 40)}px`;
  gameArea.appendChild(powerUp);
  powerUps.push(powerUp);
}