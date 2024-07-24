const gameContainer = document.getElementById('game');
const flagCountDisplay = document.getElementById('flag-count');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupButton = document.getElementById('popup-button');

const gridSize = 10;
const mineCount = 10;
let flagCount = 0;
let grid = [];
let minePositions = [];
let timer;
let secondsElapsed = 0;
let isGameOver = false;

function initializeGame() {
    grid = [];
    minePositions = [];
    flagCount = 0;
    secondsElapsed = 0;
    isGameOver = false;
    clearInterval(timer);
    timerDisplay.textContent = secondsElapsed;
    flagCountDisplay.textContent = flagCount;
    mineCountDisplay.textContent = mineCount;

    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = { isMine: false, isFlagged: false, isOpen: false, adjacentMines: 0 };
        }
    }

    placeMines();
    calculateAdjacentMines();
    renderGrid();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = secondsElapsed;
    }, 1000);
}

function placeMines() {
    while (minePositions.length < mineCount) {
        const pos = Math.floor(Math.random() * gridSize * gridSize);
        const row = Math.floor(pos / gridSize);
        const col = pos % gridSize;

        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minePositions.push([row, col]);
        }
    }
}

function calculateAdjacentMines() {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    minePositions.forEach(([row, col]) => {
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                grid[newRow][newCol].adjacentMines += 1;
            }
        });
    });
}

function renderGrid() {
    gameContainer.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.addEventListener('click', () => openCell(rowIndex, colIndex));
            hex.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(rowIndex, colIndex);
            });
            gameContainer.appendChild(hex);
        });
    });
}

function openCell(row, col) {
    if (isGameOver || grid[row][col].isOpen || grid[row][col].isFlagged) return;

    grid[row][col].isOpen = true;
    const hex = gameContainer.children[row * gridSize + col];

    if (grid[row][col].isMine) {
        hex.classList.add('mine');
        showPopup('Game Over! You hit a mine.');
    } else {
        hex.textContent = grid[row][col].adjacentMines || '';
        hex.style.backgroundColor = '#bbb';
        if (grid[row][col].adjacentMines === 0) {
            openAdjacentCells(row, col);
        }
        checkWinCondition();
    }
}

function openAdjacentCells(row, col) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    directions.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            openCell(newRow, newCol);
        }
    });
}

function flagCell(row, col) {
    if (isGameOver || grid[row][col].isOpen) return;

    grid[row][col].isFlagged = !grid[row][col].isFlagged;
    const hex = gameContainer.children[row * gridSize + col];
    hex.classList.toggle('flagged');
    flagCount += grid[row][col].isFlagged ? 1 : -1;
    flagCountDisplay.textContent = flagCount;
}

function checkWinCondition() {
    let isWin = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j].isMine && !grid[i][j].isFlagged) {
                isWin = false;
            }
            if (!grid[i][j].isMine && !grid[i][j].isOpen) {
                isWin = false;
            }
        }
    }

    if (isWin) {
        showPopup('Congratulations! You win!');
    }
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'flex';
    isGameOver = true;
    clearInterval(timer);
}

popupButton.addEventListener('click', () => {
    popup.style.display = 'none';
    initializeGame();
});

initializeGame();
