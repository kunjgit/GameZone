document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    initGame();
    document.getElementById('hint-button').addEventListener('click', showHint);
    document.getElementById('new-game-button').addEventListener('click', newGame);
});

function initGame() {
    const deck = createDeck();
    shuffleDeck(deck);
    dealCards(deck);
    document.getElementById('win-message').classList.add('hidden');
}
function newGame() {
    // Reset the game board and start a new game
    const tableauPiles = document.querySelectorAll('.tableau-pile');
    tableauPiles.forEach(pile => {
        while (pile.firstChild) {
            pile.removeChild(pile.firstChild);
        }
    });
    initGame();
}
function checkWinCondition() {
    const foundations = document.querySelectorAll('.foundation');
    let win = false;

    foundations.forEach(foundation => {
        const cards = foundation.querySelectorAll('.card');
        if (cards.length === 13) {
            win = true;
        }
    });

    if (win) {
        document.getElementById('win-message').classList.remove('hidden');
    }
}

function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }

    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards(deck) {
    const tableauPiles = document.querySelectorAll('.tableau-pile');

    tableauPiles.forEach((pile, pileIndex) => {
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
            const card = deck.pop();
            const cardElement = createCardElement(card);

            if (cardIndex === pileIndex) {
                cardElement.classList.add('face-up');
            } else {
                cardElement.classList.add('face-down');
            }

            pile.appendChild(cardElement);
        }
    });
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.classList.add(card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black');
    cardElement.dataset.suit = card.suit;
    cardElement.dataset.rank = card.rank;
    
    const rankElement = document.createElement('div');
    rankElement.classList.add('rank');
    rankElement.innerText = card.rank;

    const suitElement = document.createElement('div');
    suitElement.classList.add('suit');
    suitElement.innerHTML = getSuitSymbol(card.suit);

    cardElement.appendChild(rankElement);
    cardElement.appendChild(suitElement);

    // Make the card draggable
    cardElement.draggable = true;
    cardElement.addEventListener('dragstart', onDragStart);
    cardElement.addEventListener('dragend', onDragEnd);

    return cardElement;
}

function getSuitSymbol(suit) {
    switch (suit) {
        case 'hearts':
            return '♥';
        case 'diamonds':
            return '♦';
        case 'clubs':
            return '♣';
        case 'spades':
            return '♠';
    }
}

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.suit + ' ' + event.target.dataset.rank);
    event.target.classList.add('dragging');
}

function onDragEnd(event) {
    event.target.classList.remove('dragging');
    checkWinCondition();
}

// Add drop event listeners to card piles
const cardPiles = document.querySelectorAll('.card-pile');
cardPiles.forEach(pile => {
    pile.addEventListener('dragover', onDragOver);
    pile.addEventListener('drop', onDrop);
});

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const [suit, rank] = data.split(' ');
    const card = document.querySelector(`.card[data-suit="${suit}"][data-rank="${rank}"]`);
    event.target.appendChild(card);
    checkWinCondition();
}



function showHint() {
    const moveableCard = findMoveableCard();
    if (moveableCard) {
        highlightCard(moveableCard);
    } else {
        alert('No hints available!');
    }
}

function findMoveableCard() {
    const tableauPiles = document.querySelectorAll('.tableau-pile');
    for (const pile of tableauPiles) {
        const cards = pile.querySelectorAll('.card.face-up');
        if (cards.length > 0) {
            const topCard = cards[cards.length - 1];
            if (canMoveCard(topCard)) {
                return topCard;
            }
        }
    }
    return null;
}

function canMoveCard(card) {
    const suit = card.dataset.suit;
    const rank = card.dataset.rank;
    const foundations = document.querySelectorAll('.foundation');

    for (const foundation of foundations) {
        const cards = foundation.querySelectorAll('.card');
        if (cards.length === 0 && rank === 'A') {
            return true;
        }
        const topCard = cards[cards.length - 1];
        if (topCard && isNextRank(topCard.dataset.rank, rank) && topCard.dataset.suit === suit) {
            return true;
        }
    }
    return false;
}

function isNextRank(topRank, currentRank) {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return ranks.indexOf(currentRank) === ranks.indexOf(topRank) + 1;
}

function highlightCard(card) {
    card.classList.add('highlight');
    setTimeout(() => {
        card.classList.remove('highlight');
    }, 2000);
}

// Add necessary CSS for highlighting
const style = document.createElement('style');
style.innerHTML = `
    .highlight {
        border: 3px solid yellow;
        box-shadow: 0 0 10px yellow;
    }
`;
document.head.appendChild(style);