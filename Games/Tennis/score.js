// Get score elements
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");

// Function to update the score display
function updateScore() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
}

// Reset the score
function resetScore() {
  player1Score = 0;
  player2Score = 0;
  updateScore();
}

// Call the initial update
updateScore();
