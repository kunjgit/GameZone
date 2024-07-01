let score = 0;
let timeLeft = 30; // Game duration of 1 minute
let gameInterval;
let dotInterval;
let dotSpeed = 1000; // Start with a moderate speed for dot spawn (in milliseconds)

const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const gameArea = document.getElementById('gameArea');
const startButton = document.getElementById('startButton');
const gameContainer = document.querySelector('.game-container');

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    timeLeft = 30; // Reset timer to 1 minute
    dotSpeed = 1000; // Reset speed to moderate initial value
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    startButton.disabled = true;
    gameArea.innerHTML = ''; // Clear any dots before starting
    gameInterval = setInterval(updateTimer, 1000);
    spawnDot();
}

function updateTimer() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    if (timeLeft === 0) {
        clearInterval(gameInterval);
        clearTimeout(dotInterval);
        startButton.disabled = false;
        showGameOverMessage();
    }
}

function spawnDot() {
    if (timeLeft <= 0) return; // Prevent spawning new dots if time is up

    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = `${Math.random() * 90}%`;
    dot.style.left = `${Math.random() * 90}%`;
    dot.addEventListener('click', () => {
        score++;
        scoreElement.textContent = score;
        dot.remove();
        adjustDotSpeed();
        spawnDot();
    });
    gameArea.appendChild(dot);

    dotInterval = setTimeout(() => {
        if (dot.parentNode && timeLeft > 0) {
            dot.remove();
            spawnDot();
        }
    }, dotSpeed);
}

function adjustDotSpeed() {
    // Increase the speed of dot spawning as the score increases
    if (score % 5 === 0 && dotSpeed > 500) {
        dotSpeed -= 100; // Increase speed by reducing interval time
    }
}

function showGameOverMessage() {
    gameArea.innerHTML = ''; // Clear any remaining dots
    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over-message');
    gameOverMessage.innerHTML = `
        <h2>Game Over!</h2>
        <p>You caught ${score} dots.</p>
        <p>Reloading in <span id="reload-timer">5</span> seconds...</p>
    `;
    gameContainer.appendChild(gameOverMessage);

    let reloadTimeLeft = 5;
    const reloadTimerElement = document.getElementById('reload-timer');
    const reloadInterval = setInterval(() => {
        reloadTimeLeft--;
        reloadTimerElement.textContent = reloadTimeLeft;
        if (reloadTimeLeft === 0) {
            clearInterval(reloadInterval);
            location.reload();
        }
    }, 1000);
}




