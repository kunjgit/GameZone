// script.js

const cardsArray = [
    { name: 'A', img: 'A' },
    { name: 'B', img: 'B' },
    { name: 'C', img: 'C' },
    { name: 'D', img: 'D' },
    { name: 'E', img: 'E' },
    { name: 'F', img: 'F' },
    { name: 'G', img: 'G' },
    { name: 'H', img: 'H' }
];

// Duplicate the cards array to create pairs
const gameCards = cardsArray.concat(cardsArray);
gameCards.sort(() => 0.5 - Math.random()); // Shuffle the cards

const gameBoard = document.getElementById('game-board');

let firstCard = null;
let secondCard = null;
let lockBoard = false;

gameCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.name = card.name;

    const frontFace = document.createElement('div');
    frontFace.classList.add('front');
    frontFace.textContent = card.img;

    const backFace = document.createElement('div');
    backFace.classList.add('back');
    backFace.textContent = '?';

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);

    cardElement.addEventListener('click', flipCard);

    gameBoard.appendChild(cardElement);
});

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}
