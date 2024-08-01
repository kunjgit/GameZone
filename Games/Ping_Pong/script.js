var ball = document.getElementById("ball");
var paddleLeft = document.getElementById("paddle-left");
var paddleRight = document.getElementById("paddle-right");
var game = document.getElementById("game");
var ballX = 250;
var ballY = 150;
var xSpeed = 2;
var ySpeed = 2;
var ballSpeed = 10;
var paddleSpeed = 20;
var paddleTopBoundary = 0;
var paddleBottomBoundary = game.clientHeight - paddleLeft.clientHeight;
var paddleLeftInitialX = 0;
var paddleLeftInitialY = (game.clientHeight - paddleLeft.clientHeight) / 2;
var paddleRightInitialX = game.clientWidth - paddleRight.clientWidth;
var paddleRightInitialY = (game.clientHeight - paddleRight.clientHeight) / 2;


paddleLeft.style.left = paddleLeftInitialX + "px";
paddleLeft.style.top = paddleLeftInitialY + "px";
paddleRight.style.left = paddleRightInitialX + "px";
paddleRight.style.top = paddleRightInitialY + "px";



document.addEventListener("keydown", function (e) {
  if (e.keyCode === 38) {
    var top = paddleRight.offsetTop;
    if (top > paddleTopBoundary) {
      paddleRight.style.top = top - paddleSpeed + "px";
    }
  } else if (e.keyCode === 40) {
    var top = paddleRight.offsetTop;
    if (top < paddleBottomBoundary) {
      paddleRight.style.top = top + paddleSpeed + "px";
    }
  } else if (e.keyCode === 87) {
    var top = paddleLeft.offsetTop;
    if (top > paddleTopBoundary) {
      paddleLeft.style.top = top - paddleSpeed + "px";
    }
  } else if (e.keyCode === 83) {
    var top = paddleLeft.offsetTop;
    if (top < paddleBottomBoundary) {
      paddleLeft.style.top = top + paddleSpeed + "px";
    }
  }
});


function moveBall() {
  ballX += xSpeed;
  ballY += ySpeed;

  if (ballX + 10 > game.clientWidth || ballX < 0) {
    xSpeed = -xSpeed;
  }

  if (ballY + 10 > game.clientHeight || ballY < 0) {
    ySpeed = -ySpeed;
  }

  if (ballX < paddleLeft.clientWidth && ballY > paddleLeft.offsetTop && ballY < paddleLeft.offsetTop + paddleLeft.clientHeight) {
    xSpeed = -xSpeed;
  }

  if (ballX + 10 > game.clientWidth - paddleRight.clientWidth && ballY > paddleRight.offsetTop && ballY < paddleRight.offsetTop + paddleRight.clientHeight) {
    xSpeed = -xSpeed;
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  setTimeout(moveBall, ballSpeed);
}

moveBall();

