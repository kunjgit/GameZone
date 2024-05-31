const shapes = ['circle', 'square', 'triangle', 'star'];
const cards = [...shapes, ...shapes]; // Duplicate shapes to create pairs
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCard(shape) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.shape = shape;
    card.innerHTML = `<div class="shape ${shape}"></div>`;
    card.addEventListener('click', revealCard);
    return card;
}

function revealCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('revealed');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.shape === secondCard.dataset.shape;
    isMatch ? handleMatch() : unflipCards();
}

function handleMatch() {
    disableCards();
    updateScore(10);
}

function disableCards() {
    firstCard.removeEventListener('click', revealCard);
    secondCard.removeEventListener('click', revealCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        updateScore(-5);
        resetBoard();
    }, 1500);
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
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
    shuffle(cards);
    cards.forEach(shape => {
        const card = createCard(shape);
        gameContainer.appendChild(card);
    });
}

document.getElementById('reset-button').addEventListener('click', resetGame);

// Initialize the game on page load
window.onload = initGame;
