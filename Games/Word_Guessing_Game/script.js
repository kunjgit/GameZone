// Array of words to be guessed
var words = ["ENJOY", "RIGHT", "HELLO", "JAYANTH", "EBELLA", "GREEDY", "DATA"];

// Index of the current word being guessed
var currentWordIndex = 0;

// Number of attempts made
var attempts = 0;

// Array to store guessed letters
var guessedLetters = [];

// Number of wins
var wins = 0;

// Number of losses
var losses = 0;

// Function to initialize the game
function onStart() {
  updateDisplay();
  document.addEventListener("keyup", onGuess);
}

// Function to handle the guessing logic
function onGuess(event) {
  var keyPressed = event.key.toUpperCase();
  if (isLetterOnly(keyPressed)) {
    if (guessedLetters.indexOf(keyPressed) === -1) {
      guessedLetters.push(keyPressed);
      attempts++;
      updateDisplay();
      if (isRoundLost()) {
        losses++;
        goToNextWord();
        return;
      } else if (isRoundWon()) {
        wins++;
        goToNextWord();
        return;
      }
    }
  }
}

// Function to get the current word with guessed letters
function getGameboardWord() {
  return currentWordLetters().map(function (letter) {
    if (guessedLetters.indexOf(letter) === -1) {
      return "&nbsp;";
    } else {
      return letter;
    }
  });
}

// Function to move to the next word
function goToNextWord() {
  currentWordIndex++;
  attempts = 0;
  guessedLetters = [];
  updateDisplay();
}

// Function to check if the round is lost
function isRoundLost() {
  return getGuessesAllowed() - attempts === 0;
}

// Function to check if the round is won
function isRoundWon() {
  return getGameboardWord().indexOf("&nbsp;") === -1;
}

// Function to check if a character is a letter
function isLetterOnly(character) {
  if (character.length !== 1) {
    return false;
  }
  var checker = /^[A-Z]+$/i.test(character);
  return checker;
}

// Function to update the display
function updateDisplay() {
  document.getElementById("guessed").innerHTML = guessedLetters.reduce(function (list, letter) {
    return list + letter + " ";
  }, "");
  showGameBoard();
  document.getElementById("wins").innerHTML = wins;
  document.getElementById("losses").innerHTML = losses;
  document.getElementById("guesses_remaining").innerHTML = getGuessesAllowed() - attempts;
}

// Function to show the game board with guessed letters
function showGameBoard() {
  var container = document.getElementById("game_board_container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  getGameboardWord().forEach(function (letter) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "game_board_letter");
    newDiv.innerHTML = letter;
    if (letter !== "&nbsp;") {
      newDiv.setAttribute("class", "no_border");
    }
    container.appendChild(newDiv);
  });
}

// Function to get the letters of the current word
function currentWordLetters() {
  return words[currentWordIndex].split("");
}

// Function to get the number of guesses allowed

function getGuessesAllowed() {
  return 10;
}

// Start the game
onStart();
