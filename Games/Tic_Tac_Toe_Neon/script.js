const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
let isCircleTurn;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGame = () => {
    isCircleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('circle');
        cell.innerHTML = ''; // Clear the cell's content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
};

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = isCircleTurn ? 'circle' : 'x';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
};

const endGame = (draw) => {
    if (draw) {
        alert("Draw!");
    } else {
        alert(`${isCircleTurn ? "O's" : "X's"} Wins!`);
    }
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('circle');
    });
};

const placeMark = (cell, currentClass) => {
    cell.classList.add(currentClass);
    cell.innerHTML = currentClass === 'x' ? 'X' : 'O'; // Display X or O
};

const swapTurns = () => {
    isCircleTurn = !isCircleTurn;
};

const setBoardHoverClass = () => {
    board.classList.remove('x');
    board.classList.remove('circle');
    if (isCircleTurn) {
        board.classList.add('circle');
    } else {
        board.classList.add('x');
    }
};

const checkWin = (currentClass) => {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
};

startGame();

restartButton.addEventListener('click', startGame);
