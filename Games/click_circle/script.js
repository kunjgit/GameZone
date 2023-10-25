let score = 0;
let timeLeft = 15;
let gameInterval;
const gameArea = document.getElementById('gameArea');
const circle = document.getElementById('circle');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', startGame);

function startGame() {
  score = 0;
  timeLeft = 15;
  circle.style.display = 'block';
  updateScore();
  updateTimer();
  gameInterval = setInterval(moveCircle, 1000);
  setTimeout(endGame, timeLeft * 1000);
  startButton.disabled = true;

  // Reattach the click event listener when the game starts
  circle.addEventListener('click', incrementScore);
}

function moveCircle() {
  const randomX = Math.floor(Math.random() * (gameArea.clientWidth - circle.clientWidth));
  const randomY = Math.floor(Math.random() * (gameArea.clientHeight - circle.clientHeight));
  circle.style.left = `${randomX}px`;
  circle.style.top = `${randomY}px`;
}

function endGame() {
  circle.style.display = 'none';
  clearInterval(gameInterval);
  startButton.disabled = false;

  // Remove the click event listener when the game ends
  circle.removeEventListener('click', incrementScore);
}

function incrementScore() {
  score++;
  updateScore();
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}`;
  if (timeLeft > 0) {
    setTimeout(() => {
      timeLeft--;
      updateTimer();
    }, 1000);
  }
}

// Set initial position of the circle
circle.style.left = `${gameArea.clientWidth / 2}px`;
circle.style.top = `${gameArea.clientHeight / 2}px`;
