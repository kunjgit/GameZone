let score = 0;
let timeLeft = 30;
let timerId;
let moleTimerId;
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const holes = document.querySelectorAll('.hole');

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function showMole() {
    const hole = randomHole();
    const mole = document.createElement('div');
    mole.classList.add('mole');
    hole.appendChild(mole);

    mole.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        hole.removeChild(mole);
    });

    setTimeout(() => {
        if (hole.contains(mole)) {
            hole.removeChild(mole);
        }
    }, 1000);
}

function startGame() {
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft === 0) {
            clearInterval(timerId);
            clearInterval(moleTimerId);
            alert(`Game Over! Your score is ${score}`);
        }
    }, 1000);

    moleTimerId = setInterval(showMole, 800);
}

startGame();
