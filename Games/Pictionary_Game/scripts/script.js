const words = [
  "Cat",
  "Dog",
  "House",
  "Tree",
  "Car",
  "Balloon",
  "Sun",
  "Moon",
  "Fish",
  "Flower",
];
let players = [];
let currentPlayerIndex = 0;
let currentWordIndex = 0;
let scoreBoard = [];
let timeLeft = 60;
let timer;

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const clearButton = document.getElementById("clear-button");
const nextButton = document.getElementById("next-button");
const addPlayerButton = document.getElementById("add-player");
const guessButton = document.getElementById("guess-button"); // New: Guess button
const playerNameInput = document.getElementById("player-name");
const wordElement = document.getElementById("word");
const timerElement = document.getElementById("timer");
const scoresElement = document.getElementById("scores");
const playerListElement = document.getElementById("player-list");
const currentPlayerElement = document.getElementById("current-player");

canvas.width = 800;
canvas.height = 600;
let drawing = false;

function updateScores() {
  scoresElement.textContent = players
    .map((player, index) => `${player}: ${scoreBoard[index]}`)
    .join(", ");
}

function displayWord() {
  wordElement.textContent = words[currentWordIndex];
}

function displayCurrentPlayer() {
  currentPlayerElement.textContent = players[currentPlayerIndex];
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timerElement.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`${players[currentPlayerIndex]} ran out of time!`);
      switchTurn();
    }
  }, 1000);
}

function resetGame() {
  clearInterval(timer);
  scoreBoard = players.map(() => 0);
  currentPlayerIndex = 0;
  currentWordIndex = Math.floor(Math.random() * words.length);
  displayWord();
  displayCurrentPlayer();
  updateScores();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function switchTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  currentWordIndex = (currentWordIndex + 1) % words.length;
  displayWord();
  displayCurrentPlayer();
  startTimer();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (drawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

nextButton.addEventListener("click", switchTurn);

startButton.addEventListener("click", () => {
  if (players.length < 2) {
    alert("Please add at least two players.");
    return;
  }
  resetGame();
  startTimer();
});

addPlayerButton.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim();
  if (playerName && !players.includes(playerName)) {
    players.push(playerName);
    scoreBoard.push(0);
    const li = document.createElement("li");
    li.textContent = playerName;
    playerListElement.appendChild(li);
    playerNameInput.value = "";
    updateScores();
  } else {
    alert("Invalid or duplicate player name.");
  }
});

// New: Event listener for the guess button
guessButton.addEventListener("click", () => {
  const guessedWord = prompt("Enter your guess:");
  if (
    guessedWord &&
    guessedWord.toLowerCase() === words[currentWordIndex].toLowerCase()
  ) {
    alert("Correct guess! Congratulations!");
    scoreBoard[currentPlayerIndex]++; // Increase score
    updateScores(); // Update scores
    switchTurn(); // Move to the next player
  } else {
    alert("Incorrect guess. Try again.");
  }
});
