let character;
let obstacle;
let isGameRunning = false;
let gravityDirection = 'down';

function startGame() {
  character = document.getElementById('character');
  obstacle = document.getElementsByClassName('obstacle')[0];

  resetGame();

  document.addEventListener('keydown', handleKeyPress);
  isGameRunning = true;
  gameLoop();
}

function resetGame() {
  character.style.top = '0px';
  character.style.left = '0px';
  gravityDirection = 'down';
}

function handleKeyPress(event) {
  if (!isGameRunning) return;

  switch (event.code) {
    case 'ArrowUp':
      gravityDirection = 'up';
      break;
    case 'ArrowDown':
      gravityDirection = 'down';
      break;
    case 'ArrowLeft':
      gravityDirection = 'left';
      break;
    case 'ArrowRight':
      gravityDirection = 'right';
      break;
  }
}

function gameLoop() {
  if (!isGameRunning) return;

  moveCharacter();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

function moveCharacter() {
  let characterTop = parseInt(character.style.top);
  let characterLeft = parseInt(character.style.left);

  switch (gravityDirection) {
    case 'up':
      character.style.top = characterTop - 5 + 'px';
      break;
    case 'down':
      character.style.top = characterTop + 5 + 'px';
      break;
    case 'left':
      character.style.left = characterLeft - 5 + 'px';
      break;
    case 'right':
      character.style.left = characterLeft + 5 + 'px';
      break;
  }
}

function checkCollision() {
  let characterTop = parseInt(character.style.top);
  let characterLeft = parseInt(character.style.left);
  let obstacleTop = parseInt(obstacle.style.top);
  let obstacleLeft = parseInt(obstacle.style.left);

  if (
    characterTop < obstacleTop + obstacle.offsetHeight &&
    characterTop + character.offsetHeight > obstacleTop &&
    characterLeft < obstacleLeft + obstacle.offsetWidth &&
    characterLeft + character.offsetWidth > obstacleLeft
  ) {
    isGameRunning = false;
    alert('Game Over!');
    resetGame();
  }
}
