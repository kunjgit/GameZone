let score = 0;
const scoreElement = document.getElementById('score');

function randomPosition() {
  const gameContainer = document.querySelector('.game-container');
  const maxX = gameContainer.clientWidth - 50;
  const maxY = gameContainer.clientHeight - 50;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  return { x: randomX, y: randomY };
}

function updateScore() {
  score++;
  scoreElement.textContent = score;
}

function createMonster() {
  const monster = document.createElement('div');
  monster.classList.add('monster');
  const position = randomPosition();
  monster.style.left = `${position.x}px`;
  monster.style.top = `${position.y}px`;

  monster.addEventListener('click', () => {
    monster.remove();
    updateScore();
  });

  document.querySelector('.game-container').appendChild(monster);

  setTimeout(() => {
    monster.remove();
  }, 1000);
}

setInterval(createMonster, 1000);

