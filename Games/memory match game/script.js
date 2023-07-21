const images = [
    '🍎', '🍌', '🍓', '🍇', '🍒', '🍊', '🍉', '🍋',
    '🥝', '🍍', '🍑', '🥭', '🍐', '🍈', '🍏', '🥥'
];

let cards = [];

function createCards() {
    const gameContainer = document.getElementById('gameContainer');
    cards = [...images, ...images];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.dataset.index = index;
        card.textContent = image;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

let flippedCards = [];
let lockBoard = false;

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');

    if (!flippedCards.length) {
        flippedCards.push(this);
    } else {
        const secondCard = this;
        flippedCards.push(secondCard);
        checkForMatch();
    }
}

function checkForMatch() {
    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];

    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    flippedCards.forEach(card => {
        card.classList.add('matched');
        card.removeEventListener('click', flipCard);
    });

    flippedCards = [];
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.remove('flipped');
        });

        flippedCards = [];
        lockBoard = false;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', createCards);
