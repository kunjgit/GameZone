let points = 0;
const results = ['six', 'four', 'single', 'double', 'triple'];


function guess(userGuess) {
    const actualResult = results[Math.floor(Math.random() * results.length)];
    const resultDisplay = document.getElementById('game-result');
    const pointsDisplay = document.getElementById('points');
    
    if (userGuess === actualResult) {
        points += 1;
        resultDisplay.innerHTML = `<span class="sparkle">Luck is great! It was a ${actualResult}.</span>`;
        pointsDisplay.textContent = points;
    } else {
        resultDisplay.innerHTML = `<span class="sparkle">Sorry! Your luck is bad. It was a ${actualResult}.</span>`;
        disableButtons();
    }
}

function disableButtons() {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function resetGame() {
    points = 0;
    document.getElementById('points').textContent = points;
    document.getElementById('game-result').textContent = '';
    
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}