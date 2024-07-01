const cells = document.querySelectorAll('.cell');
const scoreBoard = document.getElementById('score');
const timerBoard = document.getElementById('timer');
const startButton = document.getElementById('startButton');

let lastHole;
let timeUp = false;
let score = 0;
let timeLeft = 30;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(cells) {
    const index = Math.floor(Math.random() * cells.length);
    const cell = cells[index];
    if (cell === lastHole) {
        return randomHole(cells);
    }
    lastHole = cell;
    return cell;
}

function showBall() {
    const time = randomTime(200, 1000);
    const cell = randomHole(cells);
    cell.classList.add('up');
    cell.firstElementChild.style.display = 'block';
    setTimeout(() => {
        cell.classList.remove('up');
        cell.firstElementChild.style.display = 'none';
        if (!timeUp) showBall();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timerBoard.textContent = 30;
    score = 0;
    timeLeft = 30;
    timeUp = false;
    showBall();
    startButton.disabled = true;

    const countdown = setInterval(() => {
        timeLeft--;
        timerBoard.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timeUp = true;
            startButton.disabled = false;
            alert('Time up! Your final score is ' + score);
        }
    }, 1000);
}

function whack(event) {
    if (!event.isTrusted) return;
    score++;
    this.parentNode.classList.remove('up');
    this.style.display = 'none';
    scoreBoard.textContent = score;
}

cells.forEach(cell => {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.addEventListener('click', whack);
    cell.appendChild(ball);
});

startButton.addEventListener('click', startGame);