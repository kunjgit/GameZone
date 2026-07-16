const rows = 8;
const columns = 8;
const minesCount = 10;

const gameState = {
    board: [],
    minesLocation: [],
    tilesClicked: 0,
    flagEnabled: false,
    gameOver: false
};

window.onload = function() {
    registerEventListeners();
    startGame();
}


function getElement(id) {
    return document.getElementById(id);
}

function setMines() {

    if (window.Cypress) {
        gameState.minesLocation = [
            "0-0",
            "0-1",
            "0-2",
            "0-3",
            "0-4",
            "0-5",
            "0-6",
            "0-7",
            "1-0",
            "1-1"
        ];
        return;
    }

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!gameState.minesLocation.includes(id)) {
            gameState.minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    initializeUI();
    initializeBoard();
}

function initializeUI() {
    getElement("mines-count").innerText = minesCount;
}

function registerEventListeners() {
    getElement("flag-button").addEventListener("click", setFlag);
    getElement("restart-button").addEventListener("click", resetGame);
}

function initializeBoard() {
    setMines();
    createBoardTiles();
}

function createBoardTiles() {
    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);

            getElement("board").append(tile);
            row.push(tile);
        }

        gameState.board.push(row);
    }
}

function setFlag() {
    if (gameState.flagEnabled) {
        gameState.flagEnabled = false;
        getElement("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        gameState.flagEnabled = true;
        getElement("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameState.gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (gameState.flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (gameState.minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameState.gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = gameState.board[r][c];
            if (gameState.minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
    
    const restartButton = getElement("restart-button");
    restartButton.innerText = "Restart";
    restartButton.style.display = "block";
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (gameState.board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    gameState.board[r][c].classList.add("tile-clicked");
    gameState.tilesClicked += 1;

    let minesFound = 0;

    
    minesFound += checkTile(r-1, c-1);      
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      

   
    minesFound += checkTile(r, c-1);        
    minesFound += checkTile(r, c+1);        

    
    minesFound += checkTile(r+1, c-1);      
    minesFound += checkTile(r+1, c);        
    minesFound += checkTile(r+1, c+1);      

    if (minesFound > 0) {
        gameState.board[r][c].innerText = minesFound;
        gameState.board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        
        checkMine(r-1, c-1);    
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    

        
        checkMine(r, c-1);      
        checkMine(r, c+1);      

        
        checkMine(r+1, c-1);    
        checkMine(r+1, c);      
        checkMine(r+1, c+1);    
    }

    if (gameState.tilesClicked == rows * columns - minesCount) {
        getElement("mines-count").innerText = "Cleared";
        gameState.gameOver = true;

        const restartButton = getElement("restart-button");
        restartButton.innerText = "AGAIN";
        restartButton.style.display = "block";
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (gameState.minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function resetGame() {
    gameState.board = [];
    gameState.minesLocation = [];
    gameState.tilesClicked = 0;
    gameState.flagEnabled = false;
    gameState.gameOver = false;

    getElement("board").innerHTML = "";
    getElement("flag-button").style.backgroundColor = "lightgray";
    getElement("mines-count").innerText = minesCount;
    getElement("restart-button").style.display = "none";

    startGame();
}