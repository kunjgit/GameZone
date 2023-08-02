const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerTurn = false;
let level = 1;
let playerSequenceIndex = 0;

// Function to start a new level
function newLevel() {
  playerTurn = false;
  playerSequenceIndex = 0;
  sequence.push(colors[Math.floor(Math.random() * colors.length)]);
  showSequence();
}

// Function to display the current sequence to the player
function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    highlightColor(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      setTimeout(() => {
        clearColors();
        playerTurn = true;
        document.getElementById("message").textContent = "Your Turn! Repeat the sequence.";
      }, 500);
    }
  }, 1000);
}

// Function to highlight a color briefly
function highlightColor(color) {
  const element = document.getElementById(color);
  element.style.opacity = "1";
  setTimeout(() => {
    element.style.opacity = "0.7";
  }, 500);
}

// Function to clear all highlighted colors
function clearColors() {
  colors.forEach(color => {
    const element = document.getElementById(color);
    element.style.opacity = "0.7";
  });
}

// Function to check the player's sequence against the current level's sequence
function checkSequence(color) {
  if (!playerTurn) return;

  if (color === sequence[playerSequenceIndex]) {
    highlightColor(color);
    playerSequenceIndex++;

    if (playerSequenceIndex === sequence.length) {
      level++;
      document.getElementById("message").textContent = "Correct! Next level.";
      setTimeout(() => {
        newLevel();
      }, 1000);
    }
  } else {
    gameOver();
  }
}

// Function to end the game when the player makes a mistake
function gameOver() {
  document.getElementById("message").textContent = "Game Over! Your final level: " + (level - 1);
  sequence = [];
  level = 1;
  playerSequenceIndex = 0;
}

// Start the game
newLevel();
