document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const memoryMessageElement = document.getElementById('memory-message');
    const resetButton = document.getElementById('reset-button');
    let cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
    let firstCard, secondCard;
    let hasFlippedCard = false;
    let lockBoard = false;
    let score = 0;
    let matchedPairs = 0;

    function startGame() {
        
        cardValues.sort(() => 0.5 - Math.random());
        gameBoard.innerHTML = '';

       
        score = 0;
        matchedPairs = 0;
        updateScore();

        
        cardValues.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.textContent = this.dataset.value;

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.value === secondCard.dataset.value;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        score++;
        matchedPairs++;
        updateScore();
        resetBoard();

        if (matchedPairs === cardValues.length / 2) {
            displayMemoryScore();
        }
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';

            if (score > 0) score--; 
            updateScore();

            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function displayMemoryScore() {
        let message = '';

        if (score >= 3) {
            message = 'You Have a Good Memory! 🔥';
        } else if (score >= 1 && score <= 2) {
            message = 'You Have a Decent Memory 🤯';
        } else if (score === 0) {
            message = 'Eat Almonds 💀';
        }

        memoryMessageElement.textContent = message;
    }

    function resetGame() {
        memoryMessageElement.textContent = ''; 
        startGame();
    }

    resetButton.addEventListener('click', resetGame);

   
    startGame();
});
