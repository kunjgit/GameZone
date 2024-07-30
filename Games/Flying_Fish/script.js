const fish = document.getElementById('fish');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

let fishTop = fish.offsetTop;
let fishLeft = fish.offsetLeft;
let gameHeight = game.clientHeight;
let gameWidth = game.clientWidth;
let score = 0;
let gameInterval;
let isGameRunning = false;

startButton.addEventListener('click', startGame);

function startGame() {
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    fishTop = gameHeight / 2;
    fishLeft = 50;
    fish.style.top = fishTop + 'px';
    fish.style.left = fishLeft + 'px';
    startButton.style.display = 'none';
    gameInterval = setInterval(gameLoop, 20);
    document.addEventListener('keydown', controlFish);
}

function gameLoop() {
    if (!isGameRunning) return;

    // Gravity
    fishTop += 2;
    fish.style.top = fishTop + 'px';

    // Check for collision with bottom of the game area
    if (fishTop > gameHeight - fish.clientHeight) {
        endGame();
    }

    // Increase score
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
}

function controlFish(event) {
    switch (event.code) {
        case 'ArrowUp':
            fishTop -= 20;
            if (fishTop < 0) {
                fishTop = 0;
            }
            fish.style.top = fishTop + 'px';
            break;
        case 'ArrowDown':
            fishTop += 20;
            if (fishTop > gameHeight - fish.clientHeight) {
                fishTop = gameHeight - fish.clientHeight;
            }
            fish.style.top = fishTop + 'px';
            break;
        case 'ArrowLeft':
            fishLeft -= 20;
            if (fishLeft < 0) {
                fishLeft = 0;
            }
            fish.style.left = fishLeft + 'px';
            break;
        case 'ArrowRight':
            fishLeft += 20;
            if (fishLeft > gameWidth - fish.clientWidth) {
                fishLeft = gameWidth - fish.clientWidth;
            }
            fish.style.left = fishLeft + 'px';
            break;
    }
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', controlFish);
    startButton.textContent = 'Restart Game';
    startButton.style.display = 'block';
}