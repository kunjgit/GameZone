document.addEventListener('mousemove', function(e) {
    const customCursor = document.getElementById('custom-cursor');
    customCursor.style.left = e.pageX + 'px';
    customCursor.style.top = e.pageY + 'px';
})
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    let cards = generateCards();
    let flippedCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let timerInterval;
    let seconds = 0;

    function generateCards() {
        const symbols = ["😀", "😎", "🥳", "🎉", "🚀", "🌟", "🎈", "🎁"];
        let cards = [...symbols, ...symbols];
        cards.sort(() => Math.random() - 0.5);
        return cards;
    }


    function createCard(symbol, index) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.addEventListener("click", flipCard);
        gameContainer.appendChild(card);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCard) return;
        this.textContent = this.dataset.symbol;
        this.classList.add("flipped");

        if (!flippedCard) {
            flippedCard = this;
        } else {
            moves++;
            document.getElementById("moves").textContent = `Moves: ${moves}`;
            if (flippedCard.dataset.symbol !== this.dataset.symbol) {
                lockBoard = true;
                setTimeout(() => {
                    flippedCard.classList.remove("flipped");
                    this.classList.remove("flipped");
                    flippedCard.textContent = "";
                    this.textContent = "";
                    flippedCard = null;
                    lockBoard = false;
                }, 1000);
            } else {
                flippedCard = null;
                matchedPairs++;
                if (matchedPairs === cards.length / 2) {
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        alert(`Congratulations! You completed the game in ${seconds} seconds with ${moves} moves.`);
                    }, 500);
                }
            }
        }
    }

    function initializeGame() {
        gameContainer.innerHTML = "";
        cards.forEach((symbol, index) => {
            createCard(symbol, index);
        });
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        document.getElementById("moves").textContent = `Moves: ${moves}`;
        startTimer();
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            document.getElementById("timer").textContent = `Time: ${seconds} seconds`;
        }, 1000);
    }

    initializeGame();
});

///added chat box functionality
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
sendBtn.addEventListener('click', sendMessage);
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    displayMessage(message, 'user');
    chatInput.value = '';
    respondToMessage(message);
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function respondToMessage(message) {
    let response;
    if (message.toLowerCase().includes('hint')) {
        response = getHint();
    } else {
        response = "I'm here to help! Ask me for a hint or any other question.";
    }
    setTimeout(() => displayMessage(response, 'bot'), 1000);
}

function getHint() {
    // Check for pairs of cards that are not yet matched
    for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
            if (!cards[i].classList.contains('flipped') && !cards[j].classList.contains('flipped')) {
                if (cards[i].querySelector('.card-front').style.backgroundImage === cards[j].querySelector('.card-front').style.backgroundImage) {
                    return `Try flipping the cards at positions ${i + 1} and ${j + 1}.`;
                }
            }
        }
    }
    // If no pairs found, suggest flipping a random unflipped card
    for (let i = 0; i < cards.length; i++) {
        if (!cards[i].classList.contains('flipped')) {
            return `Try flipping the card at position ${i + 1}.`;
        }
    }
    return "No hints available at the moment.";}
