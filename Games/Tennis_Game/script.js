// Canvas vars
var canvas;
var canvasContext;
// Ball vars
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var ballRad = 10;
var ballColor = "white";
//paddles vars
var paddle1Y = 250;
var paddle2Y = 250;
const paddle_height = 100;
const paddle_thick = 10;
//Score vars
var player1Score = 0;
var player2Score = 0;
const winningScore = 10;
var showWinner = false;
// Colors vars
var leftPlayerColor = "red";
var rightPlayerColor = "blue";
var bgColor = "black";
var textColor = "white";
// Font Style var
var fontStyle = "20px Arial";
// Net Color var
var netColor = "white";

//Getting mouse position
function mousePos(e) {
  var rec = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = e.clientX - root.scrollLeft - rec.left;
  var mouseY = e.clientY - root.scrollTop - rec.top;
  return {
    x: mouseX,
    y: mouseY
  };
}

// Enemy ( right player ) movement
function enemyMove() {
  var paddle2Center = paddle2Y + (paddle_height/2);
  if(paddle2Center < ballY - 35) {
    paddle2Y += 6;
  } else if(paddle2Center > ballY + 35) {
    paddle2Y -= 6;
  }
}

// Launching the game when window is loaded
window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  //drawEverything();
  var framesPerSec = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSec);
  // Adding event to restart the game when clicking on canvas
  canvas.addEventListener("mousedown", restartGame);
  //Adding event to move the left paddle from the center with mouse movement
  canvas.addEventListener("mousemove", function(e){
    var calMousePos = mousePos(e);
    paddle1Y = calMousePos.y-(paddle_height/2);
  });
}

// Restarting the game function
function restartGame() {
  if(showWinner) {
    player1Score = 0;
    player2Score = 0;
    showWinner = false;
  }
}

// Moving everything in canvas function
function moveEverything() {
  // Showing if there's a winner or not
  if(showWinner) {
    return;
  }
  // moving the right paddle
  enemyMove();
  // Moving the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // When the ball reach the right side of canvas
  // move it left
  if(ballX > canvas.width - (paddle_thick + ballRad)){
    if(ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
       ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y+paddle_height/2);
      ballSpeedY = deltaY * .35;
     } else {
       player1Score++;
       ballReset();       
     }
  }
  // When the ball reach the left side of canvas
  // move it right
  if(ballX < (paddle_thick + ballRad)){
    if(ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
       ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y+paddle_height/2);
      ballSpeedY = deltaY * .35;
     } else {
       player2Score++;
       ballReset();       
     }
  }
  // when the ball reach the bottom of the canvas
  // move it up
  if(ballY > canvas.height){
    ballSpeedY = -ballSpeedY;
  }
  // when the ball reach the top of the canvas
  // move it down
  if(ballY < 0){
    ballSpeedY = -ballSpeedY;
  }
}

// when a player scores let the ball start from the center
function ballReset() {
  if(player1Score >= winningScore || player2Score >= winningScore) {
    showWinner = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

// Draw everything in the canvas function
function drawEverything() { 
  //Draw black bg
  colorRect(0,0,canvas.width,canvas.height,bgColor);
  // showing the result
  if(showWinner) {
    if(player1Score>= winningScore) {
      canvasContext.fillStyle = leftPlayerColor;
      var text = "Left Player Wins!";
    } else if(player2Score>= winningScore) {
      canvasContext.fillStyle = rightPlayerColor;
      var text = "Right Player Wins!";
    }
    
    canvasContext.font = fontStyle;
    var x = (canvasContext.measureText(text).width);
    canvasContext.fillText(text,(canvas.width-x)/2, 200);
    canvasContext.fillStyle = textColor;
    canvasContext.fillText("Click To Continue",(canvas.width-x)/2, 400);
    return;
  }
  
  //Draw the net
  drawNet();
  
  //Draw the left paddle
  colorRect(0,paddle1Y,paddle_thick,paddle_height,leftPlayerColor);
  //Draw the right paddle
  colorRect(canvas.width-paddle_thick,paddle2Y,paddle_thick,paddle_height,rightPlayerColor);
  //Draw the ball
  colorCircle(ballX, ballY,ballRad,ballColor);
  // the player one score text
  canvasContext.font = fontStyle;
  canvasContext.fillStyle = leftPlayerColor;
  canvasContext.fillText(player1Score, 100, 100);
  // the player two score text
  canvasContext.fillStyle = rightPlayerColor;
  canvasContext.fillText(player2Score, canvas.width-100, 100);
}

// Drawing the circle function ( for the ball )
function colorCircle(centeX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centeX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

// Draw the net function
function drawNet() {
  for(var i =0; i < canvas.width; i+=45) {
    colorRect((canvas.width/2)-1,i, 2,20, netColor);
  }
}

// Drawing rectangles function
function colorRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}