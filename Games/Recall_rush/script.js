const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const resetBtn = document.getElementById('reset-btn');

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let timer;
let seconds = 0;

const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

// Shuffle the card values
cardValues.sort(() => 0.5 - Math.random());

function createBoard() {
    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        frontFace.textContent = value;

        const backFace = document.createElement('div');
        backFace.classList.add('back');
        backFace.textContent = '?';

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        hasFlippedCard = false;
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
    } else {
        unflipCards();
    }
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Time: ${seconds}`;
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    moves = 0;
    timerDisplay.textContent = `Time: ${seconds}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    cards = [];
    gameBoard.innerHTML = '';
    setTimeout(createBoard, 500);
    startTimer();
}

resetBtn.addEventListener('click', resetGame);

// Start the game
createBoard();
startTimer();
