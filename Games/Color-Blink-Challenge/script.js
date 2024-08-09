let colors = ['red', 'green', 'blue', 'yellow', 'purple'];
let targetColor = '';
let currentColorIndex = 0;
let score = 0;
let colorCount = 0;
let interval, timerInterval;
let timeLeft = 30;
let gameActive = false;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('endButton').addEventListener('click', endGame);
document.getElementById('submitButton').addEventListener('click', submitAnswer);

function startGame() {
    if (gameActive) return;
    gameActive = true;

    targetColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('targetColor').textContent = targetColor;
    colorCount = 0;
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('userInput').disabled = true;
    document.getElementById('userInput').value = '';

    changeColor();
    interval = setInterval(changeColor, 1000);
    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(interval);
    clearInterval(timerInterval);
    resetGame(true); // Pass true to indicate the game is fully resetting
    alert(`Game Over! Your final score is ${score}`);
}

function submitAnswer() {
    if (!gameActive && timeLeft === 0) {
        let userInput = parseInt(document.getElementById('userInput').value);

        if (userInput === colorCount) {
            score += 10;
            alert('Correct! You earned 10 points.');
        } else {
            alert(`Wrong! The correct count was ${colorCount}.`);
        }
        document.getElementById('score').textContent = score;
        resetGame();
        startGame(); // Start the next round immediately
    }
}

function resetGame(fullReset = false) {
    colorCount = 0;
    document.getElementById('userInput').value = '';
    document.getElementById('targetColor').textContent = '';
    document.getElementById('timer').textContent = '30';
    document.getElementById('userInput').disabled = true;
    gameActive = false;

    if (fullReset) {
        score = 0;
        document.getElementById('score').textContent = score;
    }

    document.getElementById('circle').style.backgroundColor = 'transparent';
}

function changeColor() {
    let circle = document.getElementById('circle');
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    let currentColor = colors[currentColorIndex];
    circle.style.backgroundColor = currentColor;

    if (currentColor === targetColor) {
        colorCount++;
    }
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(interval);
        clearInterval(timerInterval);
        document.getElementById('userInput').disabled = false;
        gameActive = false;
    }
}
