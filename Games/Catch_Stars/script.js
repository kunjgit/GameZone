const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const scoreDisp = document.getElementById('score');
let score = 0;
let intervalId;

function createStar() {
    const star = document.createElement('span');
    star.classList.add('star');
    star.textContent = '★';
    const leftPos = Math.floor(Math.random() * 100); // Random horizontal position
    star.style.left = `${leftPos}%`;
    gameArea.appendChild(star);
    animateStar(star);
}

function animateStar(star) {
    star.style.animationPlayState = 'running';
    star.addEventListener('click', catchStar);
}

function catchStar() {
    this.parentNode.removeChild(this);
    score++;
    scoreDisp.textContent = score;
}

function startGame() {
    score = 0;
    scoreDisp.textContent = score;
    gameArea.innerHTML = ''; // Clear existing stars
    intervalId = setInterval(createStar, 1500); // Create a new star every 1500ms
    startBtn.enabled = false; // Disable start button after game starts
    resetBtn.enabled = true; // Enable stop button
}

function resetGame() {
    console.log("clearInterval called");
    clearInterval(intervalId);
    score = 0;
    startBtn.enabled = true; // Enable start button after game stops
    resetBtn.enabled = false; // Disable stop button

    // Remove click event listener from existing stars
    const stars = gameArea.querySelectorAll('.star');
    stars.forEach(star => star.removeEventListener('click', catchStar));
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);