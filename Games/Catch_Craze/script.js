const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const timerElement = document.getElementById('timer');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const reloadButton = document.getElementById('reloadButton');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let timeLeft = 60;
let keys = {};
let gameInterval;
let timerInterval;
let fallingInterval;

const basket = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    color: '#e74c3c',
    speed: 10
};

const fallingObjects = [];
let objectSize = 20;
let objectSpeed = 3;
let spawnInterval = 1000; // Spawn a new object every 1000 ms

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function drawBasket() {
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawFallingObjects() {
    ctx.fillStyle = '#f1c40f';
    fallingObjects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, objectSize, objectSize);
    });
}

function moveBasket() {
    if (keys['ArrowLeft'] && basket.x > 0) {
        basket.x -= basket.speed;
    }
    if (keys['ArrowRight'] && basket.x < canvas.width - basket.width) {
        basket.x += basket.speed;
    }
}

function spawnFallingObject() {
    const x = Math.random() * (canvas.width - objectSize);
    fallingObjects.push({ x: x, y: 0 });
}

function updateFallingObjects() {
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        fallingObjects[i].y += objectSpeed;
        if (fallingObjects[i].y > canvas.height) {
            fallingObjects.splice(i, 1); // Remove the object if it goes out of canvas
        } else if (fallingObjects[i].x > basket.x && fallingObjects[i].x < basket.x + basket.width &&
                   fallingObjects[i].y + objectSize > basket.y && fallingObjects[i].y < basket.y + basket.height) {
            score++;
            scoreBoard.innerHTML = 'Score: ' + score;
            fallingObjects.splice(i, 1); // Remove the object if it is caught

            // Increase difficulty
            if (score % 5 === 0) {
                objectSpeed += 0.5;
                spawnInterval = Math.max(200, spawnInterval - 50);
                clearInterval(fallingInterval);
                fallingInterval = setInterval(spawnFallingObject, spawnInterval);
            }
        }
    }
}

function updateTime() {
    timeLeft--;
    timerElement.innerHTML = 'Time: ' + timeLeft;
    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        clearInterval(fallingInterval);
        gameOverScreen.style.display = 'block';
        finalScoreElement.innerHTML = 'Your score is ' + score;
    }
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    objectSpeed = 3;
    spawnInterval = 1000;
    scoreBoard.innerHTML = 'Score: ' + score;
    timerElement.innerHTML = 'Time: ' + timeLeft;
    fallingObjects.length = 0;
    basket.x = canvas.width / 2 - 50;
    gameOverScreen.style.display = 'none';
}

function startGame() {
    resetGame();
    gameInterval = setInterval(gameLoop, 20);
    timerInterval = setInterval(updateTime, 1000);
    fallingInterval = setInterval(spawnFallingObject, spawnInterval);
    startScreen.style.display = 'none';
    scoreBoard.style.display = 'block';
    timerElement.style.display = 'block';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawFallingObjects();
    moveBasket();
    updateFallingObjects();
}

startButton.addEventListener('click', () => {
    startGame();
});

reloadButton.addEventListener('click', () => {
    startGame();
});

