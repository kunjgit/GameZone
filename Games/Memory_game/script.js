document.addEventListener('DOMContentLoaded', () => {
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    let flippedCards = [];
    let matchedCards = [];
  
    function createCard(value) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = value;
      card.addEventListener('click', flipCard);
      return card;
    }
  
    function shuffleCards(array) {
      let currentIndex = array.length;
      let temporaryValue, randomIndex;
  
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
  
      return array;
    }
  
    function flipCard() {
      if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        flippedCards.push(this);
  
        if (flippedCards.length === 2) {
          const card1 = flippedCards[0];
          const card2 = flippedCards[1];
  
          if (card1.innerHTML === card2.innerHTML) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCards.push(card1, card2);
          } else {
            setTimeout(() => {
              card1.classList.remove('flipped');
              card2.classList.remove('flipped');
            }, 1000);
          }
  
          flippedCards = [];
        }
      }
  
      if (matchedCards.length === cardValues.length) {
        setTimeout(() => {
          alert('Congratulations! You won!');
        }, 500);
      }
    }
  
    function initializeGame() {
      const cardsContainer = document.getElementById('cards');
      const shuffledCards = shuffleCards(cardValues);
  
      shuffledCards.forEach((value) => {
        const card = createCard(value);
        cardsContainer.appendChild(card);
      });
    }
  
    initializeGame();
  });
  