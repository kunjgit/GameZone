let score = 0;
let timeLeft = 10;
let timer;

const startButton = document.getElementById('startButton');
const clickButton = document.getElementById('clickButton');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', incrementScore);

function startGame() {
  score = 0;
  timeLeft = 10;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  clickButton.disabled = false;
  gameOverScreen.classList.add('hidden');
  
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
}

function incrementScore() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
}

function endGame() {
  clickButton.disabled = true;
  gameOverScreen.classList.remove('hidden');
  finalScoreDisplay.textContent = score;
}
