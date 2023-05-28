const player = document.getElementById("player");
const fruit = document.getElementById("fruit");
const scoreElement = document.getElementById("score");

let score = 0;

function updateScore() {
  scoreElement.textContent = "Score: " + score;
}

function movePlayer(event) {
  const containerWidth = document.getElementById("game-container").offsetWidth;
  const playerWidth = player.offsetWidth * 0.5;

  let x = event.clientX;
  if (x < playerWidth / 2) {
    x = playerWidth / 2;
  }
  if (x > containerWidth - playerWidth / 2) {
    x = containerWidth - playerWidth / 2;
  }

  player.style.left = x - playerWidth / 2 + "px";
}

function getRandomPosition() {
  const containerWidth = document.getElementById("game-container").offsetWidth;
  const fruitWidth = fruit.offsetWidth;
  const randomPosition = Math.floor(Math.random() * (containerWidth - fruitWidth));
  return randomPosition;
}

function dropFruit() {
  const startPosition = getRandomPosition();
  fruit.style.left = startPosition + "px";

  const fallSpeed = Math.random() * 2 + 1; // Adjust the fall speed as desired

  let top = 10;
  const gameContainerHeight = document.getElementById("game-container").offsetHeight;
  const fruitHeight = fruit.offsetHeight;
  const playerHeight = player.offsetHeight;

  const fallInterval = setInterval(() => {
    top += fallSpeed;
    fruit.style.top = top + "px";

    if (top > gameContainerHeight - fruitHeight - playerHeight) {
      const playerPosition = parseFloat(player.style.left);
      const fruitPosition = parseFloat(fruit.style.left);

      if (Math.abs(playerPosition - fruitPosition) <= player.offsetWidth / 2) {
        score++;
        updateScore();
      }

      clearInterval(fallInterval);
      fruit.style.top = "10px";
      dropFruit();
    }
  }, 5);
}

// Add event listener to move the player
document.addEventListener("mousemove", movePlayer);

// Start dropping fruits
dropFruit();
