const basket = document.getElementById('basket');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');

let score = 0;
let lives = 5;
let fallingObjectInterval;
let gameOver = false;

document.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        let containerRect = gameContainer.getBoundingClientRect();
        let basketWidth = basket.offsetWidth;
        let x = event.clientX - containerRect.left - basketWidth / 2;
        if (x < 0) x = 0;
        if (x > containerRect.width - basketWidth) x = containerRect.width - basketWidth;
        basket.style.left = x + 'px';
    }
});

function createFallingObject() {
    if (gameOver) return;

    const fallingObject = document.createElement('div');
    fallingObject.classList.add('falling-object');
    fallingObject.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
    gameContainer.appendChild(fallingObject);

    let fallingInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallingInterval);
            return;
        }

        let top = parseInt(fallingObject.style.top || 0);
        if (top > gameContainer.offsetHeight - 40) {
            clearInterval(fallingInterval);
            fallingObject.remove();
            loseLife();
        } else {
            fallingObject.style.top = top + 5 + 'px';
            if (isCaught(fallingObject)) {
                clearInterval(fallingInterval);
                fallingObject.remove();
                score++;
                scoreDisplay.innerText = 'Score: ' + score;
            }
        }
    }, 20);
}

function isCaught(fallingObject) {
    let objectRect = fallingObject.getBoundingClientRect();
    let basketRect = basket.getBoundingClientRect();
    return (
        objectRect.right >= basketRect.left &&
        objectRect.left <= basketRect.right &&
        objectRect.bottom >= basketRect.top &&
        objectRect.top <= basketRect.bottom
    );
}

function loseLife() {
    if (lives > 0) {
        lives--;
        updateLivesDisplay();
    }
    if (lives <= 0) {
        endGame();
    }
}

function updateLivesDisplay() {
    livesContainer.innerText = 'Lives: ';
    for (let i = 1; i <= 5; i++) {
        const heart = document.createElement('span');
        heart.classList.add('heart');
        if (i > lives) {
            heart.style.color = 'transparent';
        }
        heart.innerText = '❤';
        livesContainer.appendChild(heart);
    }
}

function endGame() {
    gameOver = true;
    clearInterval(fallingObjectInterval);
    finalScoreDisplay.innerText = 'Final Score: ' + score; // Display total score
    gameOverDisplay.innerHTML = 'Game Over<br>' + finalScoreDisplay.innerHTML + '<br><button onclick="startGame()">Restart</button>'; // Update game over display with total score and restart button
    gameOverDisplay.style.display = 'block';
}

function startGame() {
    gameOver = false;
    score = 0;
    lives = 5;
    scoreDisplay.innerText = 'Score: ' + score;
    updateLivesDisplay();
    gameOverDisplay.style.display = 'none';

    // Remove existing falling objects
    document.querySelectorAll('.falling-object').forEach(obj => obj.remove());

    // Start creating falling objects again
    fallingObjectInterval = setInterval(createFallingObject, 1000);
}

// Initialize the game
startGame();
