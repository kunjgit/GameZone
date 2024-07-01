// Game variables
const cells = document.querySelectorAll('.cell');
const clueElement = document.getElementById('clue');
const restartButton = document.getElementById('restart-button');
let treasureLocation;
let attempts;

// Function to start/restart the game
function startGame() {
    // Hide treasure and reset attempts
    cells.forEach(cell => cell.style.backgroundImage = 'url("assets/cell-bg.png")');
    treasureLocation = Math.floor(Math.random() * 9) + 1;
    attempts = 0;
    clueElement.innerText = 'Find the hidden treasure!';
}

// Function to handle cell click
function handleCellClick(event) {
    const cellId = parseInt(event.target.id.split('-')[1]);
    attempts++;
    if (cellId === treasureLocation) {
        event.target.style.backgroundImage = 'url("assets/treasure.png")';
        clueElement.innerText = `Congratulations! You found the treasure in ${attempts} attempts.`;
    } else {
        event.target.style.backgroundImage = 'url("assets/wrong.png")';
        clueElement.innerText = `Keep looking! Attempts: ${attempts}`;
    }
}

// Add event listeners to cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Add event listener to restart button
restartButton.addEventListener('click', startGame);

// Start the game initially
startGame();
