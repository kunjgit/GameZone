// Function to check if the Sudoku solution is correct
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    const grid = [];

    // Convert cell values to a 2D array for easier manipulation
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            const cell = cells[i * 9 + j];
            grid[i][j] = cell.textContent === '' ? 0 : parseInt(cell.textContent);
        }
    }

    if (isSolutionValid(grid)) {
        alert('Congratulations! Sudoku solution is correct.');
    } else {
        alert('Oops! Sudoku solution is incorrect.');
    }
}

// Function to validate the Sudoku solution
function isSolutionValid(grid) {
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        if (!isUnitValid(grid[i]) || !isUnitValid(grid.map(row => row[i]))) {
            return false;
        }
    }

    // Check 3x3 boxes
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            const box = [];
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    box.push(grid[i + x][j + y]);
                }
            }
            if (!isUnitValid(box)) {
                return false;
            }
        }
    }

    return true;
}

// Helper function to check if a unit (row, column, or 3x3 box) is valid
function isUnitValid(unit) {
    const seen = new Set();
    for (const num of unit) {
        if (num !== 0 && seen.has(num)) {
            return false;
        }
        seen.add(num);
    }
    return true;
}
