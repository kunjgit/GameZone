const target = document.querySelector('.target');
const arrow = document.querySelector('.arrow');
const gameContainer = document.querySelector('.game-container');
const button = document.querySelector('button');
const scoreElement = document.getElementById('score');
const arrowsLeftElement = document.getElementById('arrows-left');

let score = 0;
const maxArrows = 5;
let arrowsShot = 0;

gameContainer.addEventListener('mousemove', (e) => {
  const rect = gameContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  arrow.style.transform = `rotate(${Math.atan2(y - 380, x - 200)}rad)`;
});

function shootArrow() {
  if (arrowsShot >= maxArrows) {
    alert('Game Over! Your total score is ' + score);
    return;
  }

  arrowsShot++;

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

  alert(`You scored ${Math.round(scoreMultiplier * 100)} points!`);
  updateScore();
}

function updateScore() {
  scoreElement.textContent = score;
  arrowsLeftElement.textContent = maxArrows - arrowsShot;
}

const gameLoop = setInterval(() => {
  if (arrowsShot >= maxArrows) {
    clearInterval(gameLoop);
    return;
  }

  const targetX = Math.random() * (gameContainer.clientWidth - 100);
  const targetY = Math.random() * (gameContainer.clientHeight - 100);

  target.style.left = `${targetX}px`;
  target.style.top = `${targetY}px`;
}, 2000);

button.addEventListener('click', shootArrow);
