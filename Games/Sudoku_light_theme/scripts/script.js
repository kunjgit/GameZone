document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const solveButton = document.getElementById('solve-button');
    const randomButton = document.getElementById('random-button');
    const difficultySelect = document.getElementById('difficulty-select');
    const timerElement = document.getElementById('timer');

    let timerInterval;
    let seconds = 0;

    const startTimer = () => {
        clearInterval(timerInterval);
        seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    // Sudoku puzzle samples
    const puzzles = {
        easy: [
            '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
            '000260701680070090190004500820100040004602900050003028009300074040050036703018000'
        ],
        medium: [
            '060090020050007000004000250007000086030005070410000900046000800000100090080030040',
            '009001070300000500000200040020067300700080009006430020090002000003000008050600900'
        ],
        hard: [
            '000003017000020000009084500700109000400000002000407009001860300000050000580300000',
            '030000000500003607000007040200005001007000300100800009040500000309200004000000050'
        ]
    };

    // Create a 9x9 grid
    const createBoard = () => {
        boardElement.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            cell.appendChild(input);
            boardElement.appendChild(cell);
        }
    };

    createBoard();

    const fillBoard = (puzzle) => {
        const inputs = boardElement.querySelectorAll('input');
        for (let i = 0; i < 81; i++) {
            inputs[i].value = puzzle[i] === '0' ? '' : puzzle[i];
            inputs[i].readOnly = puzzle[i] !== '0'; // make initial numbers read-only
        }
    };

    // Generate a random puzzle based on the selected difficulty
    const generateRandomPuzzle = () => {
        const difficulty = difficultySelect.value;
        const puzzlesArray = puzzles[difficulty];
        const randomPuzzle = puzzlesArray[Math.floor(Math.random() * puzzlesArray.length)];
        fillBoard(randomPuzzle);
        startTimer();
    };

    // Solve button event listener
    solveButton.addEventListener('click', () => {
        const inputs = boardElement.querySelectorAll('input');
        const board = [];
        for (let i = 0; i < 81; i += 9) {
            const row = Array.from(inputs).slice(i, i + 9).map(input => input.value ? parseInt(input.value) : 0);
            board.push(row);
        }
        if (solveSudoku(board)) {
            for (let i = 0; i < 81; i++) {
                inputs[i].value = board[Math.floor(i / 9)][i % 9];
            }
            stopTimer();
        } else {
            alert('No solution found!');
        }
    });

    randomButton.addEventListener('click', generateRandomPuzzle);

    // Sudoku solver function
    const solveSudoku = (board) => {
        const findEmpty = (board) => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        return [row, col];
                    }
                }
            }
            return null;
        };

        const isValid = (board, num, pos) => {
            const [row, col] = pos;

            // Check row
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num && i !== col) {
                    return false;
                }
            }

            // Check column
            for (let i = 0; i < 9; i++) {
                if (board[i][col] === num && i !== row) {
                    return false;
                }
            }

            // Check box
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = boxRow; i < boxRow + 3; i++) {
                for (let j = boxCol; j < boxCol + 3; j++) {
                    if (board[i][j] === num ) {
                        return false;
                    }
                }
            }

            return true;
        };

        const solver = () => {
            const currPos = findEmpty(board);
            if (currPos === null) {
                return true;
            }
            for (let num = 1; num <= 9; num++) {
                if (isValid(board, num, currPos)) {
                    board[currPos[0]][currPos[1]] = num;
                    if (solver()) {
                        return true;
                    }
                    board[currPos[0]][currPos[1]] = 0;
                }
            }
            return false;
        };

        return solver();
    };

    // Initialize with a random puzzle
    generateRandomPuzzle();
});
