const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: 5,
  speedY: 5,
};

const paddle1 = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  speed: 10,
  movingUp: false,
  movingDown: false,
};

const paddle2 = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  speed: 10,
  movingUp: false,
  movingDown: false,
};

let score1 = 0;
let score2 = 0;

const player1Score = document.getElementById("player1Score");
const player2Score = document.getElementById("player2Score");

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Check collision with walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
  }

  // Check collision with paddles
  if (
    ball.x - ball.radius < paddle1.x + paddle1.width &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddle1.height
  ) {
    ball.speedX = -ball.speedX;
  }

  if (
    ball.x + ball.radius > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddle2.height
  ) {
    ball.speedX = -ball.speedX;
  }

  // Check if ball goes out of bounds
  if (ball.x + ball.radius > canvas.width) {
    score1++;
    player1Score.textContent = score1;
    resetBall();
  } else if (ball.x - ball.radius < 0) {
    score2++;
    player2Score.textContent = score2;
    resetBall();
  }

  // Move paddles
  if (paddle1.movingUp && paddle1.y > 0) {
    paddle1.y -= paddle1.speed;
  }
  if (paddle1.movingDown && paddle1.y + paddle1.height < canvas.height) {
    paddle1.y += paddle1.speed;
  }
  if (paddle2.movingUp && paddle2.y > 0) {
    paddle2.y -= paddle2.speed;
  }
  if (paddle2.movingDown && paddle2.y + paddle2.height < canvas.height) {
    paddle2.y += paddle2.speed;
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = -ball.speedX;
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "w":
      paddle1.movingUp = true;
      break;
    case "s":
      paddle1.movingDown = true;
      break;
    case "ArrowUp":
      paddle2.movingUp = true;
      break;
    case "ArrowDown":
      paddle2.movingDown = true;
      break;
  }
});

window.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "w":
      paddle1.movingUp = false;
      break;
    case "s":
      paddle1.movingDown = false;
      break;
    case "ArrowUp":
      paddle2.movingUp = false;
      break;
    case "ArrowDown":
      paddle2.movingDown = false;
      break;
  }
});

gameLoop();
