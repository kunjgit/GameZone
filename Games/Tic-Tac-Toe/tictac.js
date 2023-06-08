//Win conditions
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];


//Event Listener to get user data
const form = document.querySelector('.myForm');
const modal = document.querySelector('.modal-wrapper');

form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    modal.style.display = "none";
    initializeGame(data);
});


//Game Variables
const gameVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0,1,2,3,4,5,6,7,8];
    data.player1 = "X";
    data.player2 = "O";
    data.round = 0;
    data.currentPlayer = "X";
    data.gameOver = false;
}

//Game Board Events
const addEventListenerToGameBoard = (data) =>{
    const box = document.querySelectorAll('.box');
    box.forEach( item =>{
        item.addEventListener('click', (event) =>{
            playMove(event.target, data);
        })
    });

    resetGameBtn.addEventListener('click', () =>{
        initializeGame(data);
        box.forEach( item =>{
            item.textContent = " ";
        })
    })
}

//Initialize Game
const initializeGame = (data) =>{
 adjustDom('displayTurn', `${data.player1Name}'s turn`);
 gameVariables(data);
 addEventListenerToGameBoard(data);
}

//Play Moves
const playMove = (box, data) => {
  if(data.gameOver || data.round > 8){
    return;
  }

  if(data.board[box.id] === "X" || data.board[box.id] === "O"){
    return;
  }

  data.board[box.id] = data.currentPlayer;
  box.textContent = data.currentPlayer;
  box.classList.add(data.currentPlayer === "X"? "player1": "player2");
  data.round++;


  if(endConditions(data)){
    return;
  }

  //Human vs Human
  if(data.choice === 0){
      changePlayer(data);
  } 
  //Easy Ai
  else if(data.choice === 1){
    easyAi(data);
    data.currentPlayer = "X";
  } 
  //Hard Ai
  else if(data.choice === 2){
    hardAi(data);
    changePlayer(data);
    if(endConditions(data)){
        return
    }
    changePlayer(data)
  }
}

//Change Current Player
const changePlayer = (data) =>{
    data.currentPlayer = data.currentPlayer === "X"? "O" : "X";
    let displayTurnText = data.currentPlayer === "X"? data.player1Name : data.player2Name;
    adjustDom('displayTurn', `${displayTurnText}'s turn`);
}


const endConditions = (data) => {
    if(checkWinner(data, data.currentPlayer)){
        let winnerName = data.currentPlayer === "X"? data.player1Name : data.player2Name;
        adjustDom('displayTurn', winnerName + " has won! ");
        return true;
    } else if(data.round === 9){
        adjustDom('displayTurn',"It's a Tie!");
        data.gameOver = true;
        return true;
    }
    return false;
};

//Adjust Dom
const adjustDom = (className, textContent) => {
    const el = document.querySelector(`.${className}`);
    el.textContent = textContent;
}


const checkWinner = (data, player) => {
   let result = false;

   winConditions.forEach((condition) => {
     if(data.board[condition[0]] === player &&
        data.board[condition[1]] === player &&
        data.board[condition[2]] === player){
            result = true;
             data.gameOver = true;
        }
   });

   return result;
}

//Easy Ai
const easyAi = (data) => {
   changePlayer(data);
   data.round++;

    //Checking available spots on the gameboard
    let availableSpots = data.board.filter( space => space !== "X" && space !== "O");

    let move = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    data.board[move] = data.player2;
 
    
   setTimeout(() =>{
    let box = document.getElementById(`${move}`);
    box.textContent = data.player2;
    box.classList.add('player2'); 
   }, 300)

   if(endConditions(data)){
    return;    
}
   changePlayer(data);
}

//Hard Ai
const hardAi = (data) =>{
   data.round++; 

 const move = minimax(data, "O").index;
 data.board[move] = data.player2;

 let box = document.getElementById(`${move}`);
    box.textContent = data.player2;
    box.classList.add('player2'); 

 data.currentPlayer ="X";

 console.log(data)
}

//minimax algorithm
const minimax = (data,player) => {
    let availableSpots = data.board.filter( space => space !== "X" && space !== "O");

    if(checkWinner(data, data.player1)){
        return { score: -100}
    } else if(checkWinner(data, data.player2)){
        return {score: 100}
    } else if(availableSpots.length === 0){
        return {score: 0}
    }

   const potentialMoves = [];

   for(let i = 0; i < availableSpots.length ; i++ ){
     let move = {};
     move.index = data.board[availableSpots[i]];

     data.board[availableSpots[i]] = player;

     if(player === data.player2){
        move.score = minimax(data, "X").score
     } else{
        move.score = minimax(data, "O").score
     }
     data.board[availableSpots[i]] = move.index;
     potentialMoves.push(move);
   }

   let bestMove = 0;
   if(player === data.player2){
    let bestScore = -10000;
    for(let i=0; i < potentialMoves.length; i++){
       if(potentialMoves[i].score > bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
       }
    }
   } else if(player === data.player1){
    let bestScore = 10000;
    for(let i =0; i < potentialMoves.length; i++){
        if(potentialMoves[i].score < bestScore){
            bestScore = potentialMoves[i].score;
            bestMove = i;
        }
    }
   }
   data.gameOver = false;
   return potentialMoves[bestMove]
}

//Reload Game 
const newGameBtn = document.querySelector('.newGame');
newGameBtn.addEventListener('click', () =>{
    window.location.reload();
});

//Clear boxes
const resetGameBtn = document.querySelector('.resetBtn');


