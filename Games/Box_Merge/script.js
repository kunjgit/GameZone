const gameArea = document.getElementById('game-area');
const playerBox = document.getElementById('player-box');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
let score = 0;
let gameActive = false;

const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
let playerColor = '#0f0';
playerBox.style.backgroundColor = playerColor;
playerBox.style.boxShadow = `0 0 10px ${playerColor}`;

const createBox = (number) => {
  const box = document.createElement('div');
  box.classList.add('box');
  const color = colors[Math.floor(Math.random() * colors.length)];
  box.style.backgroundColor = color;
  box.style.boxShadow = `0 0 10px ${color}`;
  box.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
  box.style.top = `${Math.random() * (gameArea.offsetHeight - 30)}px`;
  box.textContent = number;
  gameArea.appendChild(box);
};

const startGame = () => {
  const startNumber = parseInt(document.getElementById('start-number').value);
  gameActive = true;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  messageDisplay.textContent = '';
  playerBox.style.width = '30px';
  playerBox.style.height = '30px';
  playerBox.style.left = '385px';
  playerBox.style.top = '285px';
  playerBox.textContent = startNumber;
  
  const existingBoxes = document.querySelectorAll('.box');
  existingBoxes.forEach(box => box.remove());
  
  for (let i = 0; i < 10; i++) {
    createBox(i + 1);
  }
};

document.getElementById('start-button').addEventListener('click', startGame);

const movePlayer = (direction) => {
  if (!gameActive) return;
  
  const step = 10;
  const rect = playerBox.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();
  switch (direction) {
    case 'up':
      playerBox.style.top = `${Math.max(rect.top - step - gameAreaRect.top, 0)}px`;
      break;
    case 'down':
      playerBox.style.top = `${Math.min(rect.top + step - gameAreaRect.top, gameArea.offsetHeight - rect.height)}px`;
      break;
    case 'left':
      playerBox.style.left = `${Math.max(rect.left - step - gameAreaRect.left, 0)}px`;
      break;
    case 'right':
      playerBox.style.left = `${Math.min(rect.left + step - gameAreaRect.left, gameArea.offsetWidth - rect.width)}px`;
      break;
  }
  checkCollision();
};

const checkCollision = () => {
    const playerRect = playerBox.getBoundingClientRect();
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box) => {
      const boxRect = box.getBoundingClientRect();
      if (
        playerRect.left < boxRect.left + boxRect.width &&
        playerRect.left + playerRect.width > boxRect.left &&
        playerRect.top < boxRect.top + boxRect.height &&
        playerRect.top + playerRect.height > boxRect.top
      ) {
        if (box.style.backgroundColor === playerColor) {
          score += 10;
          playerBox.style.width = `${playerRect.width + 10}px`;
          playerBox.style.height = `${playerRect.height + 10}px`;
          playerBox.textContent = parseInt(playerBox.textContent) + parseInt(box.textContent);
        } else {
          score -= 5;
          playerBox.style.width = `${playerRect.width - 10}px`;
          playerBox.style.height = `${playerRect.height - 10}px`;
          playerBox.textContent = parseInt(playerBox.textContent) - parseInt(box.textContent);
        }
        scoreDisplay.textContent = `Score: ${score}`;
        box.remove();
        createBox(parseInt(box.textContent));
  
        if (score >= 100) {
          gameActive = false;
          messageDisplay.textContent = 'You win!';
        } else if (parseInt(playerBox.textContent) <= 0) {
          gameActive = false;
          messageDisplay.textContent = 'You lose!';
        }
      }
    });
  };
  
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      movePlayer('up');
      break;
    case 'ArrowDown':
      movePlayer('down');
      break;
    case 'ArrowLeft':
      movePlayer('left');
      break;
    case 'ArrowRight':
      movePlayer('right');
      break;
  }
});