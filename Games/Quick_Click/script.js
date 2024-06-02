const circles = document.querySelectorAll('.circle');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
let score = 0;
let activeCircle = null;
let gameTimer = null;
let countdownTimer = null;
let timeLeft = 60;

function randomCircle() {
    circles.forEach(circle => circle.classList.remove('active'));
    const randomIndex = Math.floor(Math.random() * circles.length);
    activeCircle = circles[randomIndex];
    activeCircle.classList.add('active');
    console.log("Random Circle Selected:", activeCircle);
}

function startGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startButton.disabled = true;
    randomCircle();
    gameTimer = setInterval(randomCircle, 1000);
    countdownTimer = setInterval(countDown, 1000);
    circles.forEach(circle => circle.addEventListener('click', whack));
    console.log("Game Started");
}

function whack(event) {
    if (event.target === activeCircle) {
        score++;
        scoreDisplay.textContent = score;
        activeCircle.classList.remove('active');
        randomCircle();
    } else {
        endGame('You Lose!');
    }
}

function countDown() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame('Time\'s Up! Game Over!');
    }
}

function endGame(message) {
    console.log("Game Ended:", message);
    clearInterval(gameTimer);
    clearInterval(countdownTimer);
    circles.forEach(circle => circle.classList.remove('active'));
    circles.forEach(circle => circle.removeEventListener('click', whack));
    startButton.disabled = false;
    alert(`${message} Your final score is ${score}`);
}

startButton.addEventListener('click', startGame);