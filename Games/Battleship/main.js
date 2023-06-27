// Setup grid function defined below.

const setupGrid = (letterArr, gridName, labelArr, parentGridDiv) => {
  let newDiv = document.createElement("div");
  // Generate number labels
  for (let i=10; i>=0; i--) {
    newDiv = document.createElement("div");
    newDiv.setAttribute("class", `${gridName}__number-labels ${gridName}__label-${i}`);
    if (i != 0) {
      newDiv.innerHTML = i; 
    }
    parentGridDiv.prepend(newDiv);
  }
  // Generate letter labels 
  let lastNumberLabel = document.querySelector(`.${gridName}__label-${10}`); 
  for (let i=9; i>=0; i--) {
    newLabel = document.createElement("div");
    newLabel.setAttribute("class", `${gridName}__labels ${gridName}__label-${letterArr[i]}`);
    newLabel.innerHTML = letterArr[i]; 
    lastNumberLabel.after(newLabel);
  }
  if (gridName == "Player-grid") {
    labelArr = document.querySelectorAll(".Player-grid__labels"); 
  } else {
    labelArr = document.querySelectorAll(".Guess-grid__labels")
  }
  // Generate buttons 
  let newButton = document.createElement("button");
    for (let i=0; i<labelArr.length; i++) {
      for (let j=10; j>0; j--) {
        newButton = document.createElement("button");
        newButton.setAttribute("id", `${gridName}__${letterArr[i]}${j}`);
        newButton.setAttribute("class", `${gridName}__buttons`);
        labelArr[i].after(newButton);
        // labelArr[i].parentNode.insertBefore(newButton, labelArr[i].nextSibling);
      }
    }
}
// Setup both player and guess grids

let guessGridParent = document.querySelector(".Guess-grid");
let playerGridParent = document.querySelector(".Player-grid");
setupGrid(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], "Player-grid", [], playerGridParent);
setupGrid(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], "Guess-grid", [], guessGridParent);

// Some variables grouped together for use below. 

let allPlayerButtons = document.querySelectorAll(".Player-grid__buttons");
let allGuessButtons = document.querySelectorAll(".Guess-grid__buttons");
let gameLogPlayer = document.querySelector(".battleship-game__info__log-content-player");
let gameLogOpponent = document.querySelector(".battleship-game__info__log-content-opponent");
let playerGrid = document.querySelector(".Player-grid");
let opponentGrid = document.querySelector(".Guess-grid");
let gameInstructions = document.querySelector(".battleship-game__info__header");
let boardHeaders = document.querySelectorAll(".battleship-game__headers");  
const startGameButton = document.querySelector(".battleship-game__info__start-game-button"); 

// This function is defined separately so we can use removeEventListener later to lock in the ship choices (not possible with anonymous functions)

const chooseShips = (event) => {
  event.target.classList.toggle("ship-location-choice");
}

allPlayerButtons.forEach(coordinate => {
  coordinate.addEventListener("click", chooseShips)
})

const gameSetup = () => {
  // Remove start game button after game is started.  
  startGameButton.classList.add("game-started");
  // Lock ship choices in after "Start Game" is pressed. 
  allPlayerButtons.forEach(coordinate => {
    coordinate.removeEventListener("click", chooseShips);
  })
}

const generateGameComponents = () => {
    // Store player ship choices.
    let playerShips = document.querySelectorAll(".ship-location-choice"); // Note this returns a node list. We need to use the spread operator to turn this into an array so that we can use the .filter or .map array iteration methods.
    let playerShipsIdArray = [...playerShips].map(ship => {return ship.id}); // Make new array with all ship choices 
    const numberOfShips = playerShipsIdArray.length; // Get number of ships (used to make an equal number of ships for opponent) 
    const playerBoardIdArray = [...allPlayerButtons].map(coordinate => {
      return coordinate.id;
    }); 
    let opponentBoardIdArray = [...allGuessButtons].map(button => {return button.id});
    let opponentShipsIndexArray = []; // This will be an array generated with a for loop to containing indexes chosen randomly from 0-100. 
    // The amount of indexes generated will be equal to the number of ships chosen by the player. 
    for (i=0; i<numberOfShips; i++) {
      opponentShipsIndexArray.push(Math.floor(Math.random() * 100));
    }
    let opponentShipsIdArray = opponentShipsIndexArray.map(index => {
      return opponentBoardIdArray[index];
    })
    let gameComponentsObj = {
      "playerShipsIdArray" : playerShipsIdArray,
      "playerBoardIdArray" : playerBoardIdArray,
      "opponentShipsIdArray" : opponentShipsIdArray
    }
    console.log(opponentShipsIdArray); 
    return gameComponentsObj;
}

const gameLogic = (gameComponents) => {
  allGuessButtons.forEach(coordinate => {
    coordinate.addEventListener("click", (e) => {
      handlePlayerGuess(gameComponents.opponentShipsIdArray, e.target.id, e.target.classList); // Handle player guess
      setTimeout(handleOpponentGuess(gameComponents.playerShipsIdArray, gameComponents.playerBoardIdArray), 1000); 
      // Handle opponent guess, which is delayed slightly. 
    });
  })
}

const runGame = () => {
  gameSetup();
  const gameComponents = generateGameComponents();
  gameLogic(gameComponents);  
}

// Event listener to start the game 
startGameButton.addEventListener("click", runGame);

// Handle player guess section 

const handlePlayerGuess = (shipsArr, id, classList) => {
  // 1. Determine if it's a hit
  const isHit = isValidHit(shipsArr, id); 
  // 2. For valid hits, remove it from the array and display it on the game log. 
  if (isHit) {
    removeShip(shipsArr, id, classList);
    classList.toggle("ship-guess-choice-success");
    gameLogPlayer.style.color = "green";
    gameLogPlayer.innerHTML = "<h3> You got a hit! </h3>";
  } else {
    classList.toggle("ship-guess-choice-fail");
    gameLogPlayer.innerHTML = "<h3> You missed! </h3>";
    gameLogPlayer.style.color = "red";
  }
  // 3. If The array length is zero - They have no more ships left - they loose!
  if (shipsArr.length == 0) {
    gameLogPlayer.innerHTML = "<h3> Well Done. You have won Battleship! <br> Your grand prize is: Nothing. </h3>";
    gameLogOpponent.visibility = "hidden";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden";
    gameInstructions.style.visibility = "hidden";
    boardHeaders.forEach(header => {
      header.style.visibility = "hidden"; 
    })  
  } 
}

const isValidHit = (shipsArr, id) => {
  if (shipsArr.includes(id)) {
    return true;
  } else {
    return false;
  }
}

const removeShip = (shipsArr, id) => {
  let index = shipsArr.indexOf(id);
  shipsArr.splice(index, 1);
  return index > -1;
}

// Handle opponent guess section

const handleOpponentGuess = (shipsArr, playerBoardArray) => {
  // 0. Get the computer to generate a guess (done here to allow scope access later on)
  // Generate a random index from 0-100
  let randomOpponentGuessIndex = Math.floor(Math.random() * playerBoardArray.length);
  // // Generate a random player coordinate ID using this index. 
  let randomOpponentIdGuess = playerBoardArray[randomOpponentGuessIndex]; // This has to run everytime the opponent guesses. Therefore, it's placed here. 
  // 1. Determine if it's a hit
  const isHit = isValidHit(shipsArr, randomOpponentIdGuess); 
  // 2. For valid hits, remove it from the array and display it on the game log.
  if (isHit) {
    removeShip(shipsArr, randomOpponentIdGuess);
    document.querySelector(`#${randomOpponentIdGuess}`).classList.toggle("ship-guess-choice-success");
    gameLogOpponent.style.color = "red";
    gameLogOpponent.innerHTML = "<h3> You opponent hit you! </h3>";
    
  } else {
    document.querySelector(`#${randomOpponentIdGuess}`).classList.toggle("ship-guess-choice-fail");
    gameLogOpponent.innerHTML = "<h3> Your opponent missed! </h3>";
    gameLogOpponent.style.color = "green";
  }
  // 3. If the array length is zero - You have no ships left - You lose!
  if (shipsArr.length == 0) {
    gameLogOpponent.innerHTML = "<h3> Oh no! All your ships are sunk and you have lost Battleship. <br> Better luck next time! </h3>";
    gameLogOpponent.style.color = "red";
    gameLogPlayer.innerHTML = "";
    playerGrid.style.visibility = "hidden";
    opponentGrid.style.visibility = "hidden";
    gameInstructions.style.visibility = "hidden";
    boardHeaders.forEach(header => {
      header.style.visibility = "hidden"; 
    })  
  }
  // 4. Stop guesses from being guessed again
  playerBoardArray.splice(randomOpponentGuessIndex, 1); // Remove the current guess from the player board array.  
}




