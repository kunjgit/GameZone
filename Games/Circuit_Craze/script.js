document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const boardSize = 5;
    let board = [];

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear the game board before creating it
        board = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => toggleCell(cell));
                gameBoard.appendChild(cell);
                row.push(cell);
            }
            board.push(row);
        }
    }

    function toggleCell(cell) {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);

        toggleSingleCell(row, col);
        toggleSingleCell(row - 1, col); // Top
        toggleSingleCell(row + 1, col); // Bottom
        toggleSingleCell(row, col - 1); // Left
        toggleSingleCell(row, col + 1); // Right

        checkWin();
    }

    function toggleSingleCell(row, col) {
        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
            let cell = board[row][col];
            cell.classList.toggle('active');
        }
    }

    function checkWin() {
        let allActive = true;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (!board[i][j].classList.contains('active')) {
                    allActive = false;
                    break;
                }
            }
            if (!allActive) break;
        }
        if (allActive) {
            alert('You completed the circuit! You win!');
        }
    }

    function resetGame() {
        board.forEach(row => row.forEach(cell => cell.classList.remove('active')));
    }

    createBoard();
    document.getElementById('controls').querySelector('button').addEventListener('click', resetGame);
});