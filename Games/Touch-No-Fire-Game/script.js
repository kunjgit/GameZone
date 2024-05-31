const container = document.getElementById("container");
const move = document.getElementById("mover");
const maxWidth = container.clientWidth - move.clientWidth;
const maxHeight = container.clientHeight - move.clientHeight;

let enemies = document.querySelectorAll(".enemy");

let x = Math.random() * maxWidth;
let y = Math.random() * maxHeight;
let a;
let b;
let count = -1;
const h3 = document.getElementById("h3");
let gameActive = true;

const initialEnemy = document.querySelector(".enemy");
let initialEnemyRect = initialEnemy.getBoundingClientRect();
let initialEnemyX = Math.random() * (maxWidth - initialEnemyRect.width);
let initialEnemyY = Math.random() * (maxHeight - initialEnemyRect.height);
initialEnemy.style.left = `${initialEnemyX}px`;
initialEnemy.style.top = `${initialEnemyY}px`;

document.addEventListener("keydown", (event) => {
  if (!gameActive) return;
  const para = document.getElementById("para");
  event.preventDefault();

  if (event.key === "ArrowUp") {
    h3.innerHTML = "&#128513";
    y = Math.max(y - 10, 0);
  } else if (event.key === "ArrowDown") {
    h3.innerHTML = "&#128513";
    y = Math.min(y + 10, maxHeight);
  } else if (event.key === "ArrowLeft") {
    h3.innerHTML = "&#128513";
    x = Math.max(x - 10, 0);
  } else if (event.key === "ArrowRight") {
    h3.innerHTML = "&#128513";
    x = Math.min(x + 10, maxWidth);
  } else {
    para.innerHTML = "error";
    return;
  }

  if (isOverlapping()) {
    foodfun();
  }
  if (die()) {
    end();
  }

  move.style.left = `${x}px`;
  move.style.top = `${y}px`;
});

document.addEventListener("keyup", (event) => {
  h3.innerHTML = "&#128515";
  keyIsPressed = false;
});

function isOverlapping() {
  if (!gameActive) return;
  const moverRect = move.getBoundingClientRect();
  const foodRect = food.getBoundingClientRect();
  return (
    moverRect.left < foodRect.right &&
    moverRect.right > foodRect.left &&
    moverRect.top < foodRect.bottom &&
    moverRect.bottom > foodRect.top
  );
}

const food = document.getElementById("food");
const foodfun = function () {
  if (!gameActive) return;
a = Math.floor(Math.random() * (maxWidth - food.clientWidth));
b = Math.floor(Math.random() * (maxHeight - food.clientHeight));


a = Math.max(a, 0);
b = Math.max(b, 0);
a = Math.min(a, maxWidth - food.clientWidth);
b = Math.min(b, maxHeight - food.clientHeight);

food.style.transform = `translate(${a}px, ${b}px)`;
count++;
h3.innerHTML = "&#128523";
console.log("your score is " + count);

if (count % 2 === 0) {
  const newEnemy = document.createElement("div");
  newEnemy.className = "enemy";

  container.appendChild(newEnemy);
  newEnemy.innerHTML = '&#128293';
  enemies = document.querySelectorAll(".enemy");
  
  let newEnemyRect = newEnemy.getBoundingClientRect();
  let newEnemyX = Math.random() * (maxWidth - newEnemyRect.width);
  let newEnemyY = Math.random() * (maxHeight - newEnemyRect.height);
  newEnemy.style.left = `${newEnemyX}px`;
  newEnemy.style.top = `${newEnemyY}px`;
}
};
if (!gameActive) foodfun();


function die() {
  if (!gameActive) return;
  const moverRect = move.getBoundingClientRect();

  for (const enemy of enemies) {
    const enemyRect = enemy.getBoundingClientRect();
    if (
      moverRect.left < enemyRect.right &&
      moverRect.right > enemyRect.left &&
      moverRect.top < enemyRect.bottom &&
      moverRect.bottom > enemyRect.top
    ) {
      return true; 
    }
  }

  return false; 
}

function end() {
console.log("game over");
gameActive = false;
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';

const gameOverText = document.createElement('span');
gameOverText.style.fontWeight = 'bold';
gameOverText.textContent = 'Game Over';
container.appendChild(gameOverText);

const scoreText = document.createElement('span');
scoreText.style.fontWeight = 'bold';
scoreText.textContent = 'Your Score: ' + count;
container.appendChild(scoreText);

const replayButton = document.createElement('button');
replayButton.style.fontWeight = 'bold';
replayButton.textContent = 'Replay';
replayButton.addEventListener('click', () => {
  location.reload();
});
container.appendChild(replayButton);


}



function enemyMove() {
  if (!gameActive) return;
  for (const enemy of enemies) {
    let m = Math.ceil(Math.random() * maxWidth);
    let n = Math.ceil(Math.random() * maxHeight);
    enemy.style.left = `${m}px`;
    enemy.style.top = `${n}px`;
  }
}


setInterval(enemyMove, 2000);
