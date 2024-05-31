window.onload = function() {
    const rollDice = () => Math.floor(Math.random() * 6) + 1;

    const player1Roll = rollDice();
    const player2Roll = rollDice();

    document.getElementById('dice1').src = `images/dice${player1Roll}.png`;
    document.getElementById('dice2').src = `images/dice${player2Roll}.png`;

    document.getElementById('result1').textContent = `Player 1 rolled: ${player1Roll}`;
    document.getElementById('result2').textContent = `Player 2 rolled: ${player2Roll}`;

    let winnerText = '';
    if (player1Roll > player2Roll) {
        winnerText = 'Player 1 wins!';
    } else if (player2Roll > player1Roll) {
        winnerText = 'Player 2 wins!';
    } else {
        winnerText = 'It\'s a tie!';
    }

    document.getElementById('winner').textContent = winnerText;
};
