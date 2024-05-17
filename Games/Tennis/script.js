// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: 2,
  speedY: 2,
  color: "#ffffff"
};

const paddle1 = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 50
};

const paddle2 = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 50
};

let player1Score = 0;
let player2Score = 0;

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
  context.closePath();
}

function drawPaddles() {
  context.fillStyle = "#ffffff";
  context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (
    ball.x - ball.radius < paddle1.x + paddle1.width &&
    ball.y + ball.radius > paddle1.y &&
    ball.y - ball.radius < paddle1.y + paddle1.height
  ) {
    ball.speedX = -ball.speedX;
  }

  if (
    ball.x + ball.radius > paddle2.x &&
    ball.y + ball.radius > paddle2.y &&
    ball.y - ball.radius < paddle2.y + paddle2.height
  ) {
    ball.speedX = -ball.speedX;
  }

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
  }

  if (ball.x - ball.radius < 0) {
    player2Score++;
    reset();
  }

  if (ball.x + ball.radius > canvas.width) {
    player1Score++;
    reset();
  }
}

function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = -ball.speedX;
  ball.speedY = -ball.speedY;
}

function draw() {

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();

  drawPaddles();
  const p1score=document.getElementById("player1Score")
  p1score.innerHTML=player1Score
  const p2score=document.getElementById("player2Score")
  p2score.innerHTML=player2Score
}


function handleKeyDown(event) {
  if (event.keyCode === 38) {

    paddle2.y -= 20;
  } else if (event.keyCode === 40) {

    paddle2.y += 20;
  } else if (event.keyCode === 87) {

    paddle1.y -= 20;
  } else if (event.keyCode === 83) {

    paddle1.y += 20;
  }
}

function startGame() {
  window.addEventListener("keydown", handleKeyDown);

  setInterval(function() {
    update();
    draw();
  }, 10);
}

startGame();
