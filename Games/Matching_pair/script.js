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
