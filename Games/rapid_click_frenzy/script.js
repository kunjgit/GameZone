let score = 0;
let timeLeft = 10;
let timer;

const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const clickButton = document.getElementById('click-button');
const startButton = document.getElementById('start-button');
const gameOverContainer = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

clickButton.addEventListener('click', () => {
    if (timeLeft > 0) {
        score++;
        scoreElement.textContent = score;
    }
});

startButton.addEventListener('click', () => {
    resetGame();
    startGame();
});

function startGame() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    timeLeft = 10;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    gameOverContainer.style.display = 'none';
    clickButton.disabled = false;
}

function endGame() {
    clickButton.disabled = true;
    gameOverContainer.style.display = 'block';
    finalScoreElement.textContent = score;
}
