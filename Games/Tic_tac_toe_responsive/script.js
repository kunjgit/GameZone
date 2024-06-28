const cells = document.querySelectorAll('.cell');
const display = document.querySelector('.display');
let restart = document.querySelector('#restart');

display.innerText = "X's turn"
let count = 0;
let xTurn;

const winCombinations = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const handleClick = (cell) => {
    let curCell = cell.target;
    count++;

    if (xTurn) {
        curCell.innerText = 'X';
        display.innerText = "O's turn"
        xTurn = false;
    }
    else {
        curCell.innerText = 'O';
        display.innerText = "X's turn"
        xTurn = true;
    }

    if (count == 9) {
        console.log(count);
        checkDraw();
        return;
    }
    getWinner();
}

const startGame = () => {
    xTurn = true;

    cells.forEach((element) => {
        element.removeEventListener('click', handleClick);
        element.addEventListener('click', handleClick, { once: true }        // so that a cell can be clicked only once
        )
    })
}
startGame();



const showWinner = (winner) => {
    display.innerText = `${winner} won 🍾`;
}


const getWinner = () => {

    for (let combinations of winCombinations) {

        const pos1 = cells[combinations[0]].innerText;
        const pos2 = cells[combinations[1]].innerText;
        const pos3 = cells[combinations[2]].innerText;

        if (pos1 != "", pos2 != "", pos3 != "") {

            if (pos1 === pos2 && pos2 === pos3) {
                showWinner(pos1);
                return true;
            }
        }

    }
    return false;
}


const checkDraw = () => {
    cells.forEach(cell => {
        if (cell.innerText !== "" && !getWinner()) {
            display.innerText = "Draw!🤝";
        }
    })
}

const restartGame = () => {
    cells.forEach(cell => {
        cell.innerText = "";
        count = 0;
        display.innerText = "X's turn"
        startGame();


    })
}

restart.addEventListener('click', restartGame)