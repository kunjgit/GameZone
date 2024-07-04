const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const characterSize = 20;
const obstacleWidth = 60;
const obstacleHeight = 20;
const colors = ['red', 'blue', 'green', 'yellow'];

let characterX = canvasWidth / 2 - characterSize / 2;
let characterY = canvasHeight - characterSize - 10;
let characterColor = colors[Math.floor(Math.random() * colors.length)];
let obstacles = [];
let score = 0;
let gameInterval, obstacleInterval;
let gameActive = false;

document.addEventListener('keydown', moveCharacter);

function moveCharacter(event) {
    if (!gameActive) return;

    switch (event.key) {
        case 'ArrowLeft':
            characterX -= 20;
            if (characterX < 0) characterX = 0;
            break;
        case 'ArrowRight':
            characterX += 20;
            if (characterX > canvasWidth - characterSize) characterX = canvasWidth - characterSize;
            break;
        case 'ArrowUp':
            characterY -= 20;
            if (characterY < 0) characterY = 0;
            break;
        case 'ArrowDown':
            characterY += 20;
            if (characterY > canvasHeight - characterSize) characterY = canvasHeight - characterSize;
            break;
    }
}

function createObstacle() {
    const x = Math.random() * (canvasWidth - obstacleWidth);
    const y = -obstacleHeight;
    const color = colors[Math.floor(Math.random() * colors.length)];
    obstacles.push({ x, y, color });
}

function updateGame() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw character
    ctx.fillStyle = characterColor;
    ctx.fillRect(characterX, characterY, characterSize, characterSize);

    // Draw and move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.y += 2;

        if (obstacle.y > canvasHeight) {
            obstacles.splice(i, 1);
            i--;
            continue;
        }

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);

        // Check collision
        if (
            characterX < obstacle.x + obstacleWidth &&
            characterX + characterSize > obstacle.x &&
            characterY < obstacle.y + obstacleHeight &&
            characterY + characterSize > obstacle.y
        ) {
            if (characterColor === obstacle.color) {
                score++;
                scoreDisplay.innerText = `Score: ${score}`;
                obstacles.splice(i, 1);
                i--;
            } else {
                gameOver();
                return;
            }
        }
    }

    // Change character color randomly
    if (Math.random() < 0.01) {
        characterColor = colors[Math.floor(Math.random() * colors.length)];
    }
}

function startGame() {
    score = 0;
    characterX = canvasWidth / 2 - characterSize / 2;
    characterY = canvasHeight - characterSize - 10;
    characterColor = colors[Math.floor(Math.random() * colors.length)];
    obstacles = [];
    scoreDisplay.innerText = `Score: ${score}`;
    gameActive = true;
    gameOverMessage.style.display = 'none';

    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, 1000);
}

function gameOver() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);

    finalScore.innerText = score;
    gameOverMessage.style.display = 'block';

    setTimeout(() => {
        gameOverMessage.style.display = 'none';
        startGame();
    }, 3000);
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    startGame();
});



