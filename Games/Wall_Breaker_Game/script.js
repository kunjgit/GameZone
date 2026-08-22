const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElem = document.getElementById("score");
const livesElem = document.getElementById("lives");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const actionBtn = document.getElementById("action-btn");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle
const paddle = {
  width: 90,
  height: 12,
  x: (WIDTH - 90) / 2,
  y: HEIGHT - 30,
  speed: 7,
};

let leftPressed = false;
let rightPressed = false;

// Ball
const BALL_RADIUS = 8;
let ball = {
  x: WIDTH / 2,
  y: paddle.y - BALL_RADIUS,
  dx: 3,
  dy: -3,
};

// Bricks
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 18;
const BRICK_PADDING = 8;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT =
  (WIDTH - (BRICK_COLS * (BRICK_WIDTH + BRICK_PADDING) - BRICK_PADDING)) / 2;

const BRICK_COLORS = ["#e63946", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d"];

let bricks = [];
let score = 0;
let lives = 3;
let running = false;
let animationId = null;

function createBricks() {
  bricks = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    bricks[r] = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      const x = BRICK_OFFSET_LEFT + c * (BRICK_WIDTH + BRICK_PADDING);
      const y = BRICK_OFFSET_TOP + r * (BRICK_HEIGHT + BRICK_PADDING);
      bricks[r][c] = { x, y, status: 1 };
    }
  }
}

function resetBallAndPaddle() {
  paddle.x = (WIDTH - paddle.width) / 2;
  ball.x = WIDTH / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() < 0.5 ? -1 : 1);
  ball.dy = -3;
}

function drawPaddle() {
  ctx.fillStyle = "#4f5bd5";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#f1faee";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const brick = bricks[r][c];
      if (brick.status !== 1) continue;
      ctx.fillStyle = BRICK_COLORS[r % BRICK_COLORS.length];
      ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    }
  }
}

function collisionDetection() {
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const brick = bricks[r][c];
      if (brick.status !== 1) continue;

      if (
        ball.x > brick.x &&
        ball.x < brick.x + BRICK_WIDTH &&
        ball.y > brick.y &&
        ball.y < brick.y + BRICK_HEIGHT
      ) {
        ball.dy = -ball.dy;
        brick.status = 0;
        score += 10;
        scoreElem.textContent = score;

        if (checkWin()) {
          endGame(true);
        }
      }
    }
  }
}

function checkWin() {
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      if (bricks[r][c].status === 1) return false;
    }
  }
  return true;
}

function movePaddle() {
  if (leftPressed) paddle.x -= paddle.speed;
  if (rightPressed) paddle.x += paddle.speed;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > WIDTH) paddle.x = WIDTH - paddle.width;
}

function update() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  movePaddle();

  // Wall collisions
  if (ball.x + ball.dx > WIDTH - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < BALL_RADIUS) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > paddle.y - BALL_RADIUS) {
    // Paddle collision
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      const hitPos = (ball.x - paddle.x) / paddle.width - 0.5; // -0.5 to 0.5
      ball.dx = hitPos * 7;
      ball.dy = -Math.abs(ball.dy);
    } else if (ball.y + ball.dy > HEIGHT - BALL_RADIUS) {
      // Missed the paddle
      loseLife();
      return;
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (running) {
    animationId = requestAnimationFrame(update);
  }
}

function loseLife() {
  lives -= 1;
  livesElem.textContent = lives;

  if (lives <= 0) {
    endGame(false);
    return;
  }

  resetBallAndPaddle();
  animationId = requestAnimationFrame(update);
}

function endGame(won) {
  running = false;
  cancelAnimationFrame(animationId);
  overlayText.textContent = won
    ? `You Win! Final Score: ${score}`
    : `Game Over — Score: ${score}`;
  actionBtn.textContent = "Restart";
  overlay.classList.remove("hide");
}

function startGame() {
  score = 0;
  lives = 3;
  scoreElem.textContent = score;
  livesElem.textContent = lives;

  createBricks();
  resetBallAndPaddle();

  overlay.classList.add("hide");
  running = true;
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(update);
}

actionBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;

  if (!running && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ")) {
    startGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

// Initial static draw before the game starts
createBricks();
drawBricks();
drawPaddle();
drawBall();
