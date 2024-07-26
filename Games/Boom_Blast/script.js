const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameOverElement = document.getElementById('game-over');
const timeSelect = document.getElementById('time-select');

let score = 0;
let timeLeft = 30;
let gameInterval;
let balloonInterval;

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    timeLeft = parseInt(timeSelect.value);
    updateScore();
    updateTimer();
    startButton.disabled = true;
    timeSelect.disabled = true;
    gameOverElement.style.display = 'none';
    clearInterval(gameInterval);
    clearInterval(balloonInterval);

    gameInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    balloonInterval = setInterval(createBalloon, 1000);
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    const size = Math.random() * 50 + 20;
    const colors = getRandomGradient();

    balloon.style.width = `${size}px`;
    balloon.style.height = `${size}px`;
    balloon.style.background = colors;
    balloon.style.left = `${Math.random() * (gameArea.clientWidth - size)}px`;
    balloon.style.top = `${Math.random() * (gameArea.clientHeight - size)}px`;

    balloon.addEventListener('click', () => {
        score++;
        updateScore();
        gameArea.removeChild(balloon);
    });

    gameArea.appendChild(balloon);

    setTimeout(() => {
        if (gameArea.contains(balloon)) {
            gameArea.removeChild(balloon);
        }
    }, 2000);
}

function getRandomGradient() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `radial-gradient(circle, ${color1}, ${color2})`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateTimer() {
    timerElement.textContent = `Time: ${timeLeft}s`;
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(balloonInterval);
    gameOverElement.textContent = `Game Over! Final Score: ${score}`;
    gameOverElement.style.display = 'block';
    startButton.disabled = false;
    timeSelect.disabled = false;
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }
    gameArea.appendChild(gameOverElement);
}