const totalBowls = 5;
let correctBowlIndex = null;
let score = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBowl(index) {
    const bowl = document.createElement('div');
    bowl.classList.add('bowl');
    bowl.dataset.index = index;
    bowl.innerHTML = `<div class="ball"></div>`;
    bowl.addEventListener('click', revealBowl);
    return bowl;
}

function revealBowl() {
    const index = parseInt(this.dataset.index);
    this.classList.add('flipped');
    
    if (index === correctBowlIndex) {
        this.querySelector('.ball').style.display = 'block';
        updateScore(10);
    } else {
        updateScore(-5);
    }

    disableBowls();
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

function disableBowls() {
    document.querySelectorAll('.bowl').forEach(bowl => {
        bowl.removeEventListener('click', revealBowl);
    });
}

function resetGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    initGame();
}

function initGame() {
    const gameContainer = document.getElementById('game-container');
    const bowls = Array.from({ length: totalBowls }, (_, index) => createBowl(index));
    shuffle(bowls);
    bowls.forEach(bowl => gameContainer.appendChild(bowl));
    correctBowlIndex = Math.floor(Math.random() * totalBowls);
}

document.getElementById('reset-button').addEventListener('click', resetGame);

// Initialize the game on page load
window.onload = initGame;
