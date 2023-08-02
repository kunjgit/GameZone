const target = document.querySelector('.target');
const arrow = document.querySelector('.arrow');
const gameContainer = document.querySelector('.game-container');
const shootButton = document.querySelector('.shoot-button');
const scoreElement = document.getElementById('score');
const arrowsLeftElement = document.getElementById('arrows-left');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');

let score = 0;
let level = 1;
const maxArrows = 5;
let arrowsShot = 0;
let isArrowMoving = false;
let timer;

gameContainer.addEventListener('mousemove', (e) => {
  if (!isArrowMoving) {
    const rect = gameContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    arrow.style.transform = `rotate(${Math.atan2(y - 380, x - 200)}rad)`;
  }
});

function shootArrow() {
  if (isArrowMoving || arrowsShot >= maxArrows) return;

  arrowsShot++;
  isArrowMoving = true;
  arrow.classList.add('shoot-animation');

  setTimeout(() => {
    const targetCenterX = gameContainer.clientWidth / 2;
    const targetCenterY = gameContainer.clientHeight / 2;
    const arrowCenterX = arrow.getBoundingClientRect().left + arrow.clientWidth / 2;
    const arrowCenterY = arrow.getBoundingClientRect().top + arrow.clientHeight;

    const distance = Math.sqrt(
      (targetCenterX - arrowCenterX) ** 2 + (targetCenterY - arrowCenterY) ** 2
    );

    const maxDistance = gameContainer.clientWidth / 2;
    const scoreMultiplier = Math.max(0, (maxDistance - distance) / maxDistance);

    score += Math.round(scoreMultiplier * 100);
    updateScore();

    arrow.style.transform = '';
    arrow.classList.remove('shoot-animation');
    isArrowMoving = false;

    if (arrowsShot >= maxArrows) {
      nextLevel();
    }
  }, 1500);
}

function nextLevel() {
  clearInterval(timer);
  level++;
  arrowsShot = 0;
  maxArrows = Math.min(maxArrows + 1, 10); // Maximum 10 arrows per level
  updateLevel();
  updateArrowsLeft();
  resetTimer();

  const nextLevelText = document.createElement('div');
  nextLevelText.className = 'next-level-text';
  nextLevelText.textContent = `Level ${level}`;
  gameContainer.appendChild(nextLevelText);

  setTimeout(() => {
    gameContainer.removeChild(nextLevelText);
  }, 1500);
}

function updateScore() {
  scoreElement.textContent = score;
}

function updateLevel() {
  levelElement.textContent = level;
}

function updateArrowsLeft() {
  arrowsLeftElement.textContent = maxArrows - arrowsShot;
}

function resetTimer() {
  let timeLeft = 30 + level * 10;
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  alert('Game Over! Your total score is ' + score);
  score = 0;
  level = 1;
  arrowsShot = 0;
  maxArrows = 5;
  updateScore();
  updateLevel();
  updateArrowsLeft();
  resetTimer();
}

shootButton.addEventListener('click', shootArrow);
resetTimer();
