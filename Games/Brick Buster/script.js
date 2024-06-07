const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const bricksContainer = document.getElementById('bricks');
const scoreElement = document.getElementById('score');

const gameArea = document.getElementById('game-area');
const gameAreaRect = gameArea.getBoundingClientRect();

const paddleWidth = paddle.clientWidth;
const paddleHeight = paddle.clientHeight;
const ballSize = ball.clientWidth;

let score = 0;
let ballX = gameAreaRect.width / 2;
let ballY = gameAreaRect.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
let paddleX = (gameAreaRect.width - paddleWidth) / 2;

const rows = 5;
const cols = 10;
const brickWidth = 80;
const brickHeight = 20;
const brickMargin = 10;

let bricks = [];

function createBricks() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.left = `${col * (brickWidth + brickMargin)}px`;
            brick.style.top = `${row * (brickHeight + brickMargin)}px`;
            bricksContainer.appendChild(brick);
            bricks.push(brick);
        }
    }
}

function movePaddle(event) {
    const step = 20;
    if (event.key === 'ArrowLeft' && paddleX > 0) {
        paddleX -= step;
    } else if (event.key === 'ArrowRight' && paddleX < gameAreaRect.width - paddleWidth) {
        paddleX += step;
    }

    updatePaddlePosition();
}

function updatePaddlePosition() {
    paddle.style.left = `${paddleX}px`;
}

function resetBall() {
    ballX = gameAreaRect.width / 2;
    ballY = gameAreaRect.height / 2;
    ballSpeedX = 3;
    ballSpeedY = -3;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX <= 0 || ballX >= gameAreaRect.width - ballSize) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY >= gameAreaRect.height - ballSize) {
        alert('Game Over');
        resetBall();
    }

    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (ballRect.bottom >= paddleRect.top && ballRect.right >= paddleRect.left && ballRect.left <= paddleRect.right) {
        ballSpeedY = -ballSpeedY;
    }

    bricks.forEach((brick, index) => {
        const brickRect = brick.getBoundingClientRect();
        if (ballRect.right >= brickRect.left && ballRect.left <= brickRect.right && ballRect.bottom >= brickRect.top && ballRect.top <= brickRect.bottom) {
            ballSpeedY = -ballSpeedY;
            bricksContainer.removeChild(brick);
            bricks.splice(index, 1);
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    if (bricks.length === 0) {
        alert('You Win!');
        resetBall();
        createBricks();
    }
}

function gameLoop() {
    updateBall();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', movePaddle);

createBricks();
resetBall();
gameLoop();