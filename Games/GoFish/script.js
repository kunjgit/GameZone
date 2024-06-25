let deck = [];
let playerHand = [];
let computerHand = [];
let playerPairs = 0;
let computerPairs = 0;

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({suit, value});
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards() {
    for (let i = 0; i < 7; i++) {
        playerHand.push(deck.pop());
        computerHand.push(deck.pop());
    }
    renderHands();
}

function renderHands() {
    const playerCardsDiv = document.getElementById('player-cards');
    const computerCardsDiv = document.getElementById('computer-cards');
    playerCardsDiv.innerHTML = '';
    computerCardsDiv.innerHTML = '';
    playerHand.forEach(card => {
        playerCardsDiv.innerHTML += `<div class="card">${card.value} ${card.suit[0]}</div>`;
    });
    computerHand.forEach(card => {
        computerCardsDiv.innerHTML += `<div class="card">?</div>`;
    });
}

function checkForPairs(hand) {
    const cardCount = {};
    hand.forEach(card => {
        cardCount[card.value] = (cardCount[card.value] || 0) + 1;
    });
    for (let value in cardCount) {
        if (cardCount[value] === 4) {
            return value;
        }
    }
    return null;
}

function removePairs(hand, value) {
    return hand.filter(card => card.value !== value);
}

function askForCard() {
    const askCardValue = document.getElementById('ask-card').value.trim().toUpperCase();
    if (!askCardValue) {
        alert('Please enter a card value.');
        return;
    }

    let log = document.getElementById('game-log');
    const initialHandSize = computerHand.length;
    computerHand = computerHand.filter(card => card.value !== askCardValue);
    const cardsTaken = initialHandSize - computerHand.length;

    if (cardsTaken > 0) {
        log.innerHTML += `You took ${cardsTaken} ${askCardValue}(s) from the computer.<br>`;
        playerHand.push(...Array(cardsTaken).fill({value: askCardValue}));
    } else {
        log.innerHTML += `Go Fish! You drew a card.<br>`;
        playerHand.push(deck.pop());
    }

    const playerPair = checkForPairs(playerHand);
    if (playerPair) {
        playerHand = removePairs(playerHand, playerPair);
        playerPairs++;
        log.innerHTML += `You formed a pair of ${playerPair}s.<br>`;
        document.getElementById('player-score').innerText = `Player Pairs: ${playerPairs}`;
    }

    renderHands();
    setTimeout(computerTurn, 1000);
}

function computerTurn() {
    const askCardValue = computerHand[Math.floor(Math.random() * computerHand.length)].value;
    let log = document.getElementById('game-log');
    log.innerHTML += `Computer asks for ${askCardValue}.<br>`;

    const initialHandSize = playerHand.length;
    playerHand = playerHand.filter(card => card.value !== askCardValue);
    const cardsTaken = initialHandSize - playerHand.length;

    if (cardsTaken > 0) {
        log.innerHTML += `Computer took ${cardsTaken} ${askCardValue}(s) from you.<br>`;
        computerHand.push(...Array(cardsTaken).fill({value: askCardValue}));
    } else {
        log.innerHTML += `Computer goes fishing and draws a card.<br>`;
        computerHand.push(deck.pop());
    }

    const computerPair = checkForPairs(computerHand);
    if (computerPair) {
        computerHand = removePairs(computerHand, computerPair);
        computerPairs++;
        log.innerHTML += `Computer formed a pair of ${computerPair}s.<br>`;
        document.getElementById('computer-score').innerText = `Computer Pairs: ${computerPairs}`;
    }

    renderHands();
    checkForGameEnd();
}

function checkForGameEnd() {
    if (deck.length === 0 && (playerHand.length === 0 || computerHand.length === 0)) {
        const log = document.getElementById('game-log');
        if (playerPairs > computerPairs) {
            log.innerHTML += `<strong>You win!</strong><br>`;
        } else if (playerPairs < computerPairs) {
            log.innerHTML += `<strong>Computer wins!</strong><br>`;
        } else {
            log.innerHTML += `<strong>It's a tie!</strong><br>`;
        }
    }
}

document.getElementById('ask-button').addEventListener('click', askForCard);

createDeck();
shuffleDeck();
dealCards();
