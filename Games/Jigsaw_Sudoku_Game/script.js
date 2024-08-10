const initialBoard = [
    [0, 9, 5, 8, 4, 0, 0, 7, 3],
    [0, 0, 0, 3, 0, 0, 0, 9, 0],
    [0, 0, 0, 0, 0, 1, 0, 2, 5],
    [0, 4, 0, 0, 9, 0, 5, 0, 0],
    [0, 0, 0, 5, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 3, 5, 0, 0, 0],
    [0, 0, 4, 0, 0, 3, 0, 0, 0],
    [2, 1, 6, 0, 0, 0, 0, 5, 8],
    [9, 3, 0, 2, 5, 0, 1, 0, 0]
];

const solutionBoard = [
    [1, 9, 5, 8, 4, 2, 6, 7, 3],
    [6, 5, 2, 3, 1, 7, 8, 9, 4],
    [3, 8, 9, 4, 6, 1, 7, 2, 5],
    [7, 4, 1, 6, 9, 8, 5, 3, 2],
    [8, 7, 3, 5, 2, 9, 4, 6, 1],
    [4, 2, 7, 1, 3, 5, 9, 8, 6],
    [5, 6, 4, 7, 8, 3, 2, 1, 9],
    [2, 1, 6, 9, 7, 4, 3, 5, 8],
    [9, 3, 8, 2, 5, 6, 1, 4, 7]
];

const regions = [
    [1, 2, 2, 2, 2, 2, 3, 3, 3],
    [1, 1, 1, 2, 2, 2, 3, 3, 3],
    [1, 1, 1, 5, 2, 7, 7, 7, 3],
    [4, 1, 5, 5, 5, 5, 7, 7, 3],
    [4, 1, 5, 5, 6, 6, 7, 7, 3],
    [4, 5, 5, 6, 6, 6, 7, 7, 8],
    [4, 6, 6, 6, 6, 8, 8, 8, 8],
    [4, 4, 4, 9, 9, 9, 9, 8, 8],
    [4, 4, 9, 9, 9, 9, 9, 8, 8]
];

function createBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Add region class based on the regions array
            const regionClass = 'region' + regions[i][j];
            cell.classList.add(regionClass);

            // Add border attributes where needed
            if (j === 0 || regions[i][j] !== regions[i][j - 1]) {
                cell.setAttribute('data-border-left', '');
            }
            if (j === 8 || regions[i][j] !== regions[i][j + 1]) {
                cell.setAttribute('data-border-right', '');
            }
            if (i === 0 || regions[i][j] !== regions[i - 1][j]) {
                cell.setAttribute('data-border-top', '');
            }
            if (i === 8 || regions[i][j] !== regions[i + 1][j]) {
                cell.setAttribute('data-border-bottom', '');
            }
            
            // Create input element
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.oninput = function() {
                this.value = this.value.replace(/[^1-9]/g, '');
            };

            // Set initial value and disable if needed
            if (initialBoard[i][j] !== 0) {
                input.value = initialBoard[i][j];
                input.disabled = true;
            }
            
            cell.appendChild(input);
            boardElement.appendChild(cell);
        }
    }
}

function checkSolution() {
    const cells = document.querySelectorAll('.cell input');
    let isCorrect = true;

    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        const inputValue = parseInt(cell.value) || 0 
    
        if (inputValue !== solutionBoard[row][col] && inputValue !== 0) {
            isCorrect = false
        }
    });
    if (isCorrect) {
        alert('Go ahead!');
    } 
    else {
        alert('Some cells are incorrect. Keep trying!');
    }
}

function solve(){
    const cells = document.querySelectorAll('.cell input');
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        const initialValue = initialBoard[row][col];
        // Set the value from solutionBoard if the cell is empty
        if (initialValue === 0) {
            cell.value = solutionBoard[row][col];
        }
    });
}

function reset(){
    const cells = document.querySelectorAll('.cell input');
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        const initialValue = initialBoard[row][col];
        // Set the value from solutionBoard if the cell is empty
        if (initialValue === 0) {
            cell.value = ''
        }
    });
}

createBoard();
