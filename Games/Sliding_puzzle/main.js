let board =[];
let moves =0;
let seconds=0;
let tileContainer = document.querySelector(".tileContainer");
let moveElement = document.getElementById("moveElement");
let timerElement = document.getElementById("timer");
let intervalId;
const alert = document.getElementById("alert");

createBoard();
fillBoard();

function createBoard() {
  for(let i=0;i<4;i++) {
    let row=[];
    for(let j=0;j<4;j++) {
      row.push(0);
    }
    board.push(row);
  }
}

function fillBoard() {
  let numbers = Array.from({length:15},(_,i)=>i+1);
  numbers.push(null);
  let emptyIndex = numbers.length-1;
  for (let i=0;i<1000;i++) {
    let swapIndex = getRandomValidMove(emptyIndex);
    [numbers[emptyIndex],numbers[swapIndex]] = [numbers[swapIndex],numbers[emptyIndex]] ;
    emptyIndex = swapIndex;
  }
  let index = 0;
  for (let y=3;y>=0;y--) {
    for (let x=0;x<4;x++) {
      if(index<numbers.length) {
        if(numbers[index]!==null) {
          addTileAt(x,y,numbers[index]);
        }
        index++;
      }
    }
  }
}

function getRandomValidMove(emptyIndex) {
  let validMoves = [];
  let x = emptyIndex%4;
  let y = Math.floor(emptyIndex/4);

  if(x>0) validMoves.push(emptyIndex-1);
  if(x<3) validMoves.push(emptyIndex+1);
  if(y>0) validMoves.push(emptyIndex-4);
  if(y<3) validMoves.push(emptyIndex+4);

  return validMoves[Math.floor(Math.random()*validMoves.length)];
}

function addTileAt(x,y,value) {
  board[x][y] = value;
  addTileToPage(x,y,board[x][y]);
}

function addTileToPage(row,column,value) {
  let tile = document.createElement("div");
  tile.classList.add(
    "tile",
    "row"+(row+1),
    "column"+(column+1),
    "value"+value
  );
  tile.innerHTML = value;
  tileContainer.appendChild(tile);
}

function startNewGame() {
  alert.style.display = "none";
  tileContainer.innerHTML = "";
  moveElement.innerHTML =0;
  timerElement.innerHTML = 0;
  board = [];
  moves = 0;
  seconds = 0;
  createBoard();
  fillBoard();
  window.onload = addClickEventToTiles();
  stopTimer();
}

function startTimer() {
  intervalId = setInterval(function(){
    seconds++;
    timerElement.innerHTML = seconds;
  },1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

window.onload = addClickEventToTiles();

function addClickEventToTiles() {
  let tiles = document.querySelectorAll(".tile");
  tiles.forEach(function(tile){
      tile.addEventListener("click",onTileClick);
  });
}

function onTileClick(event) {
  if(moves ==0)
    startTimer();
  let [row,column] = getRowAndColumn(event.target);
  moveTiles(row-1,column-1);
  let gameOver = isGameOver();
  if(gameOver){
    showAlert();
    stopTimer();
  }
}

function getRowAndColumn(element) {
  let classes = element.classList;
  let row,column;
  for (let i=0;i<classes.length;i++) {
    if(classes[i].startsWith("row")) {
      row = parseInt(classes[i].slice(3));
    } else if (classes[i].startsWith("column")) {
      column = parseInt(classes[i].slice(6));
    }
  }
  return [row,column];
}

function moveTiles(x,y) {
  let directions = [[0,-1],[0,1],[-1,0],[1,0]];

  for(let i=0;i<directions.length;i++) {
    let newX = x + directions[i][0];
    let newY = y + directions[i][1];

    if(newX>=0 && newX<4 && newY>=0 && newY<4 && board[newX][newY]=== 0) {
      board[newX][newY] = board[x][y];
      board[x][y] = 0;
      let tileClass = ".row"+(x+1)+".column"+(y+1);
      let tile = document.querySelector(tileClass);
      moveTileOnPage(newX,newY,tile);
      moves++;
      moveElement.innerHTML = moves;
      break;
    }
  }
}

function moveTileOnPage(row,column,tile) {
  let classes = Array.from(tile.classList);
  classes.forEach((className)=>{
    if(className.startsWith("row") || className.startsWith("column")) {
      tile.classList.remove(className);
    }
  });
  tile.classList.add("row"+(row+1),"column"+(column+1));
}

function isGameOver() {
  for(let i=0;i<15;i++) {
    if(board[3-Math.floor(i/4)][i%4]!== i+1) {
      return false;
    }
  }
  return board[0][3]===0;
}

function showAlert() {
  alert.innerHTML = '<div>You won!</div> <button class="newGame"onclick="startNewGame()">New game</button>';
  alert.style.display = "flex";
  alert.style.flexDirection = "column";
  stopTimer();
}