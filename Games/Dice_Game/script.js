let currentPlayer = 1;
let totalScores = [0, 0];
let currentScores = [0, 0];

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const switchPlayer = () => {
    currentScores[currentPlayer - 1] = 0;
    document.getElementById(`current-score-${currentPlayer}`).textContent = currentScores[currentPlayer - 1];
    currentPlayer = currentPlayer === 1 ? 2 : 1;
};

const checkWinner = () => {
    if (totalScores[currentPlayer - 1] >= 100) {
        document.getElementById('winner').textContent = `Player ${currentPlayer} wins!`;
        document.getElementById('roll-button').disabled = true;
        document.getElementById('hold-button').disabled = true;
    }
};

document.getElementById('roll-button').addEventListener('click', () => {
    const diceValue = rollDice();
    document.getElementById('dice').src = `images/dice${diceValue}.png`;
    if (diceValue === 1) {
        switchPlayer();
    } else {
        currentScores[currentPlayer - 1] += diceValue;
        document.getElementById(`current-score-${currentPlayer}`).textContent = currentScores[currentPlayer - 1];
    }
});

document.getElementById('hold-button').addEventListener('click', () => {
    totalScores[currentPlayer - 1] += currentScores[currentPlayer - 1];
    document.getElementById(`total-score-${currentPlayer}`).textContent = totalScores[currentPlayer - 1];
    checkWinner();
    if (totalScores[currentPlayer - 1] < 100) {
        switchPlayer();
    }
});
