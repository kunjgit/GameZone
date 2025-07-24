// 🎲 Two Player Dice Game Logic

let scores, currentScore, activePlayer, playing;

// 🎯 Initialize Game
function initGame() {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  document.getElementById('score1').textContent = '0';
  document.getElementById('score2').textContent = '0';
  document.getElementById('current1').textContent = '0';
  document.getElementById('current2').textContent = '0';
  document.getElementById('dice').src = 'https://raw.githubusercontent.com/ksuvii21/assets/main/dice-1.png';
}

// 🎲 Roll Dice Handler
function rollDice() {
  if (!playing) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice').src = `https://raw.githubusercontent.com/ksuvii21/assets/main/dice-${roll}.png`;

  if (roll !== 1) {
    currentScore += roll;
    document.getElementById(`current${activePlayer + 1}`).textContent = currentScore;
  } else {
    switchPlayer();
  }
}

// ✋ Hold Score Handler
function holdScore() {
  if (!playing) return;

  scores[activePlayer] += currentScore;
  document.getElementById(`score${activePlayer + 1}`).textContent = scores[activePlayer];

  if (scores[activePlayer] >= 100) {
    alert(`🎉 Player ${activePlayer + 1} Wins!`);
    playing = false;
  } else {
    switchPlayer();
  }
}

// 🔄 Switch Active Player
function switchPlayer() {
  currentScore = 0;
  document.getElementById(`current${activePlayer + 1}`).textContent = '0';
  activePlayer = activePlayer === 0 ? 1 : 0;
}

// 🔁 Reset Game
document.getElementById('reset').addEventListener('click', initGame);
document.getElementById('roll').addEventListener('click', rollDice);
document.getElementById('hold').addEventListener('click', holdScore);

// 🚀 Start
initGame();
