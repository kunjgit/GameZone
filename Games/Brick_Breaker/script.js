
/********** Global Vars ***********/
var canvas, canvasContext;

// Bricks (rows/cols constant so Bricks Remaining stays 70 and your score math stays intact)
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 10;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var brickCount = 0;

// Ball
var ballX = 75;
var ballSpeedX = 8;
var ballY = 75;
var ballSpeedY = 8;

// Main Paddle
var paddleX = 400;
const PADDLE_THICKNESS = 15;
const PADDLE_WIDTH = 100;
const PADDLE_DIST_FROM_EDGE = 60;

// Mouse
var mouseX = 0;
var mouseY = 0;

// UI
let startBtn;

/********** General GamePlay ***********/
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  // UI refs
  startBtn = document.getElementById('startBtn');

  // 30 FPS game loop (always running)
  var framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", updateMousePos);

  // Initial board
  brickReset();
  ballRest();

  // Start: reset board and ball
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      brickReset();
      ballRest();
    });
  }
};

function updateAll() {
  movement();
  playArea();
}

function ballRest() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2.5;
}

function brickReset() {
  brickCount = 0;
  initializeBrickColors();

  // top 3 rows empty
  let i = 0;
  for (; i < 3 * BRICK_COLS; i++) {
    brickGrid[i] = false;
  }
  // fill remainder
  for (; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
    brickCount++;
  }

  // update UI
  updateScore(brickCount);     // should show 70
  scoredisplay(false);         // keep your original scoring behavior
}

function ballMove() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // bottom edge -> reset board
  if (ballY > canvas.height) {
    ballRest();
    brickReset();
  } else if (ballY < 0 && ballSpeedY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // sides
  if (ballX > canvas.width && ballSpeedX > 0.0) {
    ballSpeedX = -ballSpeedX;
  } else if (ballX < 0 && ballSpeedX < 0.0) {
    ballSpeedX = -ballSpeedX;
  }
}

function isBrickAtColRow(col, row) {
  if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
    var brickIndexUnderCoord = rowColToArrayIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else {
    return false;
  }
}

function ballBrickColl() {
  var ballBrickCol = Math.floor(ballX / BRICK_W);
  var ballBrickRow = Math.floor(ballY / BRICK_H);
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS
  ) {
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false;
      brickCount--;

      var prevBallX = ballX - ballSpeedX;
      var prevBallY = ballY - ballSpeedY;
      var prevBrickCol = Math.floor(prevBallX / BRICK_W);
      var prevBrickRow = Math.floor(prevBallY / BRICK_H);

      var bothTestFailed = true;

      if (prevBrickCol !== ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX = -ballSpeedX;
          bothTestFailed = false;
        }
      }

      if (prevBrickRow !== ballBrickRow) {
        if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
          ballSpeedY = -ballSpeedY;
          bothTestFailed = false;
        }
      }

      if (bothTestFailed) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
      }
    }
  }

  if (brickCount === 0) {
    // board cleared -> rebuild same layout and continue playing
    brickReset();
    ballRest();
  } else {
    updateScore(brickCount);
    scoredisplay(true);
  }
}

function updateScore(score) {
  var scoreElement = document.getElementById("score");
  if (scoreElement) scoreElement.textContent = "Bricks Remaining: " + score;
}

// ===== Original scoring logic kept intact =====
var s = 0;
var y = 0;
function scoredisplay(hit) {
  if (hit) {
    s = 70 - brickCount;
    if (s > 20) {
      y = s - 20;
      s = s + y * 4;
    }
    else if (s > 10) {
      y = s - 10;
      s = s + y;
    }
  } else if (brickCount == 70) {
    s = 0;
  }
  var scoredisplayElement = document.getElementById("s");
  if (scoredisplayElement) scoredisplayElement.textContent = "Score: " + s;
}

function paddleMove() {
  var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleX + PADDLE_WIDTH;

  if (
    ballY > paddleTopEdgeY && // top of paddle
    ballY < paddleBottomEdgeY && // bottom of paddle
    ballX > paddleLeftEdgeX && // left half
    ballX < paddleRightEdgeX   // right half
  ) {
    ballSpeedY = -ballSpeedY;

    var paddleCenterX = paddleX + PADDLE_WIDTH / 2;
    var ballDistFromCenterX = ballX - paddleCenterX;
    ballSpeedX = ballDistFromCenterX * 0.35;
  }
}

function movement() {
  ballMove();
  ballBrickColl();
  paddleMove();
}

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - PADDLE_WIDTH / 2;
}

/********** Draw ***********/
function playArea() {
  colorRect(0, 0, canvas.width, canvas.height, "#222");
  colorCircle();
  colorRect(
    paddleX,
    canvas.height - PADDLE_DIST_FROM_EDGE,
    PADDLE_WIDTH,
    PADDLE_THICKNESS,
    "#61dafb"
  );
  drawbricks();
}

function colorRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorText(showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row;
}

var brickColors = [];

// Initialize brick colors
function initializeBrickColors() {
  brickColors = [];
  for (var i = 0; i < BRICK_ROWS * BRICK_COLS; i++) {
    brickColors.push(getRandomColor());
  }
}

// Random color
function getRandomColor() {
  var colors = ["#f86257", "#5bb9a9", "#7d5ba6", "#0b5394", "#ec9b00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawbricks() {
  for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
      if (brickGrid[arrayIndex]) {
        colorRect(
          BRICK_W * eachCol,
          BRICK_H * eachRow,
          BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP,
          brickColors[arrayIndex]
        );
      }
    }
  }
}

function colorCircle() {
  var gradient = canvasContext.createRadialGradient(
    ballX, ballY, 0,
    ballX, ballY, 10
  );
  gradient.addColorStop(0, "#61dafb");
  gradient.addColorStop(0.5, "#888");
  gradient.addColorStop(1, "#000");

  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
  canvasContext.fill();
}
