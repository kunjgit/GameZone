const player = document.getElementById('player');
const exit = document.getElementById('exit');
const timeDisplay = document.getElementById('time');
const maze = document.getElementById('maze');

const walls = [
    { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 5 },
    { row: 1, col: 6 }, { row: 1, col: 7 }, { row: 1, col: 5 }, { row: 2, col: 2 },
    { row: 1, col: 8 }, { row: 4, col: 2 }, { row: 5, col: 8 }, { row: 6, col: 8 },
    { row: 7, col: 8 }, { row: 5, col: 8 }, { row: 8, col: 7 }, { row: 8, col: 6 },
    { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 4, col: 2 },
    { row: 7, col: 2 }, { row: 6, col: 2 }, { row: 5, col: 2 }, { row: 5, col: 2 },
    { row: 9, col: 2 }, { row: 9, col: 3 }, { row: 9, col: 4 }, { row: 9, col: 5 }
];

walls.forEach(wall => {
    const wallElement = document.createElement('div');
    wallElement.classList.add('wall');
    wallElement.style.gridColumn = wall.col;
    wallElement.style.gridRow = wall.row;
    maze.appendChild(wallElement);
});

let playerPosition = { row: 1, col: 1 };
let time = 0;
let timer;

document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    const key = event.key;
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;

    if (key === 'ArrowUp') newRow--;
    if (key === 'ArrowDown') newRow++;
    if (key === 'ArrowLeft') newCol--;
    if (key === 'ArrowRight') newCol++;

    if (isValidMove(newRow, newCol)) {
        playerPosition.row = newRow;
        playerPosition.col = newCol;
        player.style.gridRow = playerPosition.row;
        player.style.gridColumn = playerPosition.col;
        checkExit();
    }
}

function isValidMove(row, col) {
    if (row < 1 || row > 10 || col < 1 || col > 10) return false;
    return !walls.some(wall => wall.row === row && wall.col === col);
}

function checkExit() {
    if (playerPosition.row === 10 && playerPosition.col === 10) {
        clearInterval(timer);
        alert(`You reached the exit in ${time} seconds!`);
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
}

startTimer();
