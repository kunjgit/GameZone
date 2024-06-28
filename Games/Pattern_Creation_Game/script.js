const gridContainer = document.getElementById('grid-container');
const patternCode = document.getElementById('pattern-code');
let selectedColor = 'black';
let brushSize = 1;
let grid = [];
let history = [];
let redoStack = [];

function createGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.addEventListener('click', () => colorCell(i, j));
            grid[i][j] = { element: cell, color: 'white' };
            gridContainer.appendChild(cell);
        }
    }
}

function colorCell(row, col) {
    for (let i = 0; i < brushSize; i++) {
        for (let j = 0; j < brushSize; j++) {
            if (grid[row + i] && grid[row + i][col + j]) {
                const cell = grid[row + i][col + j];
                if (cell.color !== selectedColor) {
                    history.push({ row: row + i, col: col + j, color: cell.color });
                    redoStack = [];
                    cell.color = selectedColor;
                    cell.element.style.backgroundColor = selectedColor;
                }
            }
        }
    }
}

function selectColor(color) {
    selectedColor = color;
}

function savePattern() {
    const pattern = grid.map(row => row.map(cell => cell.color));
    patternCode.value = JSON.stringify(pattern);
}

function loadPattern() {
    try {
        const pattern = JSON.parse(patternCode.value);
        pattern.forEach((row, i) => {
            row.forEach((color, j) => {
                grid[i][j].color = color;
                grid[i][j].element.style.backgroundColor = color;
            });
        });
        history = [];
        redoStack = [];
    } catch (error) {
        alert('Invalid pattern code');
    }
}

function undo() {
    const lastAction = history.pop();
    if (lastAction) {
        redoStack.push({ ...lastAction, color: grid[lastAction.row][lastAction.col].color });
        grid[lastAction.row][lastAction.col].color = lastAction.color;
        grid[lastAction.row][lastAction.col].element.style.backgroundColor = lastAction.color;
    }
}

function redo() {
    const lastUndo = redoStack.pop();
    if (lastUndo) {
        history.push({ ...lastUndo, color: grid[lastUndo.row][lastUndo.col].color });
        grid[lastUndo.row][lastUndo.col].color = lastUndo.color;
        grid[lastUndo.row][lastUndo.col].element.style.backgroundColor = lastUndo.color;
    }
}

function clearGrid() {
    for (let row of grid) {
        for (let cell of row) {
            cell.color = 'white';
            cell.element.style.backgroundColor = 'white';
        }
    }
    history = [];
    redoStack = [];
}

function fillGrid() {
    for (let row of grid) {
        for (let cell of row) {
            if (cell.color !== selectedColor) {
                history.push({ row: grid.indexOf(row), col: row.indexOf(cell), color: cell.color });
                cell.color = selectedColor;
                cell.element.style.backgroundColor = selectedColor;
            }
        }
    }
    redoStack = [];
}

function changeBrushSize(size) {
    brushSize = parseInt(size);
}

createGrid();
