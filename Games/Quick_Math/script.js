let score = 0;
let currentProblem = null;
let timer;
const GAME_DURATION = 30; // in seconds

function startGame() {
    score = 0;
    document.getElementById('finalScore').textContent = score; // Reset end screen score
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.end-screen').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('score').textContent = score;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('playAgainBtn').disabled = true;
    document.getElementById('timerDisplay').style.display = 'block';
    nextProblem();
    startTimer();
}

function nextProblem() {
    currentProblem = generateProblem();
    document.getElementById('problem').textContent = currentProblem.question;
}

function generateProblem() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    return { question: `${num1} + ${num2}`, answer: num1 + num2 };
}

function checkAnswer() {
    let userAnswer = parseInt(document.getElementById('answer').value);
    if (userAnswer === currentProblem.answer) {
        score++;
        document.getElementById('score').textContent = score;
        flashScreen('green');
    } else {
        flashScreen('red');
    }
    nextProblem();
    document.getElementById('answer').value = '';
}

function flashScreen(color) {
    document.body.style.backgroundColor = color;
    setTimeout(() => {
        document.body.style.backgroundColor = '#f8f9fa'; // Reset background color
    }, 200);
}

function startTimer() {
    let timeLeft = GAME_DURATION;
    updateTimerDisplay(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft === 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay(time) {
    document.getElementById('timer').textContent = time;
}

function endGame() {
    clearInterval(timer);
    document.getElementById('submitBtn').disabled = true;
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('finalScore').textContent = score;
    document.querySelector('.end-screen').style.display = 'flex';
    document.getElementById('playAgainBtn').disabled = false;
}

function playAgain() {
    score = 0;
    document.getElementById('score').textContent = score;
    document.querySelector('.end-screen').style.display = 'none';
    document.querySelector('.main-menu').style.display = 'flex';
}