const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1100;
canvas.height = 650;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  width: 40,
  height: 40,
  color: "blue",
  speed: 5,
};

const obstacles = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameIsRunning = true;
let difficulty = "medium";
let blockSpeeds = {
  easy: 1.5,
  medium: 3,
  hard: 5,
};

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 37 && player.x > 0) {
    player.x -= player.speed;
  } else if (e.keyCode === 39 && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
});

function createObstacle() {
  const obstacle = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    color: "red",
    speed: blockSpeeds[difficulty],
  };
  obstacles.push(obstacle);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
  ctx.fillText("High Score: " + highScore, 20, 70);
}

function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (
      player.x < obstacles[i].x + obstacles[i].width &&
      player.x + player.width > obstacles[i].x &&
      player.y < obstacles[i].y + obstacles[i].height &&
      player.y + player.height > obstacles[i].y
    ) {
      gameIsRunning = false;
      gameOver();
      break;
    }
  }
}

function gameOver() {
  if (score >= highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    alert(
      "Congratulations! You have beaten your previous high score. New High Score: " +
        highScore
    );
  } else {
    alert("Game Over! Your Score: " + score);
  }

  const playAgain = confirm("Play Again?");
  if (playAgain) {
    resetGame();
  }
}

function resetGame() {
  player.x = canvas.width / 2;
  player.y = canvas.height - 80;
  score = 0;
  obstacles.length = 0;
  gameIsRunning = true;

  setTimeout(() => {
    updateGame();
  }, 1000);
}

function updateGame() {
  if (!gameIsRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += obstacles[i].speed;
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  checkCollisions();

  if (Math.random() < 0.02) {
    createObstacle();
  }

  drawObstacles();
  drawPlayer();
  drawScore();

  requestAnimationFrame(updateGame);
}

function setDifficulty(selectedDifficulty) {
  difficulty = selectedDifficulty;
  // Update the block speed based on the selected difficulty
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].speed = blockSpeeds[difficulty];
  }
}

updateGame();