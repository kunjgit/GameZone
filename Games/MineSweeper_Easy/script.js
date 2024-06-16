const gameBoard = document.getElementById('gameBoard');
const mineCountElement = document.getElementById('mineCount');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const boardSize = 10;
const mineCount = 10;

let board = [];
let mineLocations = [];
let gameOver = false;

function initBoard() {
    board = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({
            mine: false,
            revealed: false,
            flag: false,
            adjacentMines: 0
        }))
    );

    mineLocations = [];
    gameOver = false;
    statusElement.textContent = '';

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            mineLocations.push({ row, col });
            minesPlaced++;
        }
    }

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col].mine) {
                const adjacentMines = getAdjacentCells(row, col).filter(cell => cell.mine).length;
                board[row][col].adjacentMines = adjacentMines;
            }
        }
    }

    renderBoard();
}

function getAdjacentCells(row, col) {
    const cells = [];
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                cells.push({ row: newRow, col: newCol, ...board[newRow][newCol] });
            }
        }
    }
    return cells;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[row][col].revealed) {
                cell.classList.add('revealed');
                if (board[row][col].mine) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[row][col].adjacentMines > 0) {
                    cell.textContent = board[row][col].adjacentMines;
                }
            }
            if (board[row][col].flag) {
                cell.classList.add('flag');
                cell.textContent = '🚩';
            }
            cell.addEventListener('click', () => onCellClick(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                onCellRightClick(row, col);
            });
            gameBoard.appendChild(cell);
        }
    }
}

function onCellClick(row, col) {
    if (gameOver || board[row][col].revealed || board[row][col].flag) return;
    revealCell(row, col);
    if (board[row][col].mine) {
        alert('Game Over! You hit a mine.');
        revealAllMines();
        gameOver = true;
    } else {
        if (board[row][col].adjacentMines === 0) {
            revealAdjacentCells(row, col);
        }
        if (checkWin()) {
            statusElement.textContent = 'YOU WON!';
            gameOver = true;
        }
    }
    renderBoard();
}

function onCellRightClick(row, col) {
    if (gameOver || board[row][col].revealed) return;
    board[row][col].flag = !board[row][col].flag;
    renderBoard();
}

function revealCell(row, col) {
    if (board[row][col].revealed) return;
    board[row][col].revealed = true;
}

function revealAdjacentCells(row, col) {
    getAdjacentCells(row, col).forEach(cell => {
        if (!cell.revealed && !cell.flag) {
            revealCell(cell.row, cell.col);
            if (cell.adjacentMines === 0) {
                revealAdjacentCells(cell.row, cell.col);
            }
        }
    });
}

function revealAllMines() {
    mineLocations.forEach(({ row, col }) => {
        board[row][col].revealed = true;
    });
    renderBoard();
}

function checkWin() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col].mine && !board[row][col].revealed) {
                return false;
            }
        }
    }
    return true;
}

restartButton.addEventListener('click', initBoard);

initBoard();
mineCountElement.textContent = mineCount;
