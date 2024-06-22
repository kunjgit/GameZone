document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'A', id: 1 }, { name: 'A', id: 2 },
        { name: 'B', id: 3 }, { name: 'B', id: 4 },
        { name: 'C', id: 5 }, { name: 'C', id: 6 },
        { name: 'D', id: 7 }, { name: 'D', id: 8 },
        { name: 'E', id: 9 }, { name: 'E', id: 10 },
        { name: 'F', id: 11 }, { name: 'F', id: 12 },
        { name: 'G', id: 13 }, { name: 'G', id: 14 },
        { name: 'H', id: 15 }, { name: 'H', id: 16 }
    ];
    
    cardArray.sort(() => 0.5 - Math.random());
    
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let score = 0;
    
    function createBoard() {
        cardArray.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.setAttribute('data-id', index);
            cardElement.classList.add('card');
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }
    
    function checkForMatch() {
        const cards = document.querySelectorAll('.card');
        const [optionOneId, optionTwoId] = cardsChosenId;
        
        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].classList.add('flipped');
            cards[optionTwoId].classList.add('flipped');
            cardsWon.push(cardsChosen);
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            cards[optionOneId].innerHTML = '';
            cards[optionTwoId].innerHTML = '';
        }
        
        cardsChosen = [];
        cardsChosenId = [];
        
        if (cardsWon.length === cardArray.length / 2) {
            setTimeout(() => alert(`Congratulations! You found all the matches! Your final score is ${score}.`), 100);
        }
    }
    
    function flipCard() {
        const cardId = this.getAttribute('data-id');
        if (!cardsChosenId.includes(cardId) && cardsChosen.length < 2) {
            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);
            this.innerHTML = cardArray[cardId].name;
            this.classList.add('flipped');
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }
    
    createBoard();
});
