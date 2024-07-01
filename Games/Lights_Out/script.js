var count = 0;
var cellArray = [];
var winCont;
var gameSize = 5; // grid size
var cellNeighborArray = [];
var probabilityOfOn = 30;
var cellState;

function Game() {
  // The probability of percentage of on light

  cellArray = document.getElementsByClassName("lightit");
  winCont = document.getElementsByClassName("winner-cont")[0];

  start();
}

function start() {
  for (var i = 0, j = cellArray.length; i < j; i++) {
    // check for topleft corner
    if (i === 0) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i + 1],
        cellArray[i + gameSize]
      ];
      // check for bottomright corner
    } else if (i === gameSize * gameSize - 1) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i - gameSize]
      ];
      // check for bottomleft corner
    } else if (i === gameSize * gameSize - gameSize) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i + 1],
        cellArray[i - gameSize]
      ];
      // check for topright corner
    } else if (i === gameSize - 1) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i + gameSize]
      ];
      // check for left side border
    } else if (i % gameSize === 0) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i + 1],
        cellArray[i - gameSize],
        cellArray[i + gameSize]
      ];
      // check for right side border
    } else if (i % gameSize === gameSize - 1) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i - gameSize],
        cellArray[i + gameSize]
      ];
      // check for top border
    } else if (i < gameSize) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i + 1],
        cellArray[i + gameSize]
      ];
      // check for bottom border
    } else if (i >= gameSize * gameSize - gameSize) {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i + 1],
        cellArray[i - gameSize]
      ];
      // rest of cells
    } else {
      cellNeighborArray[i] = [
        cellArray[i],
        cellArray[i - 1],
        cellArray[i + 1],
        cellArray[i - gameSize],
        cellArray[i + gameSize]
      ];
    }
  }
  for (var ii = 0, jj = cellArray.length; ii < jj; ii++) {
    cellState = Math.floor(Math.random() * 100);
    if (cellState < probabilityOfOn) {
      cellArray[ii].classList.add("light-on");
    } else {
      cellArray[ii].classList.remove("light-on");
    }
    cellArray[ii].addEventListener("click", lightClick);
  }
}

function resetGame() {
  var gameContainer = document.getElementById("container");
  var gameOverScreen = document.getElementById("game-over");
  count = 0;

  // Show game container
  gameContainer.style.display = "block";

  // Hide game over screen
  gameOverScreen.style.display = "none";
  var element = document.getElementById("count");
  element.innerHTML = `Click Count: ${count}`;
  start();
}

function showGameOver() {
  var gameContainer = document.getElementById("container");
  var gameOverScreen = document.getElementById("game-over");
  var scoreElement = document.getElementById("score");
  // Hide game container
  gameContainer.style.display = "none";

  // Update score element
  scoreElement.textContent = `Score: ${count}`;
  count = 0;
  // Show game over screen
  gameOverScreen.style.display = "block";
  var resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetGame);
}

function lightClick() {
  this.classList.toggle("light-on");
  for (var iii = 0, jjj = cellNeighborArray.length; iii < jjj; iii++) {
    if (this === cellNeighborArray[iii][0]) {
      for (var iiii = 1; iiii < cellNeighborArray[iii].length; iiii++) {
        cellNeighborArray[iii][iiii].classList.toggle("light-on");
      }
    }
  }
  count++;
  var element = document.getElementById("count");
  element.innerHTML = `Click Count: ${count}`;

  if (testWinner()) {
    element.innerHTML = `Click Count: ${count}`;
    showGameOver();
  }
}

function testWinner() {
  if (document.getElementsByClassName("light-on")[0]) {
    return false;
  }
  return true;
}

function toggleDarkMode() {
  var darkModeToggle = document.getElementById("darkModeToggle");
  var homeIcon = document.querySelector('.home-icon');
  var body = document.body;
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
    homeIcon.style.color = "white"; 
  } else {
    body.classList.remove("dark-mode");
    homeIcon.style.color = "black";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  Game();

  var darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("change", toggleDarkMode);

  var resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetGame);

  var resetButtonNow = document.getElementById("reset-button-now");
  resetButtonNow.addEventListener("click", resetGame);
});

function resetGame() {
  var gameContainer = document.getElementById("container");
  var gameOverScreen = document.getElementById("game-over");
  count = 0;

  // Show game container
  gameContainer.style.display = "block";

  // Hide game over screen
  gameOverScreen.style.display = "none";
  var element = document.getElementById("count");
  element.innerHTML = `Click Count: ${count}`;
  start();
}
