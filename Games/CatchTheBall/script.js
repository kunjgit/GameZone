const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 80;
const paddleHeight = 10;
const paddleSpeed = 7;

let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = ballRadius;
let ballSpeedY = 2;

let rightPressed = false;
let leftPressed = false;

// New variables for tracking missed balls and game over state
let missedBalls = 0;
const maxMissedBalls = 5;
let gameOver = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
}

// Function to show the alert message
function showAlert(message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.textContent = message;
    alertDiv.style.display = 'block'; // Show the alert
    setTimeout(() => {
        alertDiv.style.display = 'none'; // Hide the alert after 2 seconds
    }, 2000);
}

function moveBall() {
    ballY += ballSpeedY;
    if (ballY + ballRadius > canvas.height) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballY = ballRadius; // Reset ball position to top
            ballX = Math.random() * (canvas.width - ballRadius * 2) + ballRadius; // Randomize ball horizontal position
        } else {
            ballY = ballRadius; // Reset ball position to top
            missedBalls++; // Increment missed balls count
            if (missedBalls < maxMissedBalls) {
                showAlert(`${maxMissedBalls - missedBalls} balls left`); // Show alert with remaining balls
            }
            if (missedBalls >= maxMissedBalls) {
                gameOver = true; // Set game over state
            }
        }
    }
}

function drawGameOver() {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

function draw() {
    if (gameOver) {
        drawGameOver(); // Draw game over message
        return; // Exit the draw function to stop the game
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    movePaddle();
    moveBall();

    requestAnimationFrame(draw);
}

draw();