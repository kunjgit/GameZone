// Paddle and ball properties
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
let paddleSpeed = 5;
let ballXSpeed = 5;
let ballYSpeed = 2;

// Paddle and ball initial positions
let leftPaddleY = 160;
let rightPaddleY = 160;
let ballX = 300;
let ballY = 200;

// Keyboard event listeners for paddle movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    } else if (event.key === 'ArrowDown' && rightPaddleY < 320) {
        rightPaddleY += paddleSpeed;
    }

    if (event.key === 'w' && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    } else if (event.key === 's' && leftPaddleY < 320) {
        leftPaddleY += paddleSpeed;
    }
});

// Update the game state
function update() {
    // Move the ball
    ballX += ballXSpeed;
    ballY += ballYSpeed;

    // Ball collisions with top and bottom walls
    if (ballY < 0 || ballY > 380) {
        ballYSpeed = -ballYSpeed;
    }

    // Ball collisions with paddles
    if (
        (ballX < 20 && ballY > leftPaddleY && ballY < leftPaddleY + 80) ||
        (ballX > 570 && ballY > rightPaddleY && ballY < rightPaddleY + 80)
    ) {
        ballXSpeed = -ballXSpeed;
    }

    // Ball out of bounds
    if (ballX < 0 || ballX > 600) {
        // Reset ball position
        ballX = 300;
        ballY = 200;
    }
    
    // Move paddles
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';

    // Move ball
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
