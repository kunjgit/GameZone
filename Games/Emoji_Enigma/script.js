const emojis = [
    '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉',
    '🍓', '🍓', '🍒', '🍒', '🍍', '🍍', '🥭', '🥭'
  ];
  
  const gameBoard = document.getElementById('gameBoard');
  const timerElement = document.getElementById('timer');
  const restartButton = document.getElementById('restartButton');
  const leaderboardList = document.getElementById('leaderboardList');
  const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
}

// Check user's theme preference from local storage and apply it
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  body.classList.add('dark-theme');
} else {
  body.classList.add('light-theme'); // Default to light theme
}

  
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let timer = 0;
  let intervalId;
  let matches = 0;
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  
  restartButton.addEventListener('click', restartGame);
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(emojis);
    emojis.forEach(emoji => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.innerHTML = `<div class="emoji">${emoji}</div>`;
      cardElement.addEventListener('click', flipCard);
      gameBoard.appendChild(cardElement);
    });
  }
  
  function startTimer() {
    timer = 0;
    timerElement.textContent = `Time: 0s`;
    intervalId = setInterval(() => {
      timer++;
      timerElement.textContent = `Time: ${timer}s`;
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(intervalId);
  }
  
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
  
    this.classList.add('flipped');
  
    if (!firstCard) {
      firstCard = this;
    } else {
      secondCard = this;
      checkForMatch();
    }
  }
  
  function checkForMatch() {
    const isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
  }
  
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches += 2;
    resetBoard();
  
    if (matches === emojis.length) {
      stopTimer();
      const username = prompt('Congratulations! Enter your name:');
      saveScore(username, timer);
      updateLeaderboard();
    }
  }
  
  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }
  
  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }
  
  function restartGame() {
    stopTimer();
    startTimer();
    matches = 0;
    createBoard();
  }
  
  function saveScore(username, score) {
    leaderboard.push({ username, score });
    leaderboard.sort((a, b) => a.score - b.score);
    leaderboard = leaderboard.slice(0, 5); // Keep only top 5 scores
  
    // Save leaderboard data to local storage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }
  
  function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${entry.username}: ${entry.score}s`;
      leaderboardList.appendChild(listItem);
    });
  }
  
  createBoard();
  startTimer();
  
