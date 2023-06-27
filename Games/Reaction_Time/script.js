let gameStarted = false;
let shape = document.getElementById("shape");
let timerElement = document.getElementById("timer");
let reactionTimeElement = document.getElementById("reaction-time");
let startTime;

// Function to start the game
function startGame() {
  gameStarted = true;
  shape.style.display = "block";
  shape.style.backgroundColor = "#ff5f5f";

  setTimeout(function() {
    if (!gameStarted) {
      return;
    }

    shape.style.backgroundColor = "#2ecc71";
    startTime = new Date().getTime();
    timerElement.textContent = "Click now!";
  }, Math.random() * 3000 + 1000);
}

// Function to handle click on the shape
shape.addEventListener("click", function() {
  if (gameStarted) {
    let endTime = new Date().getTime();
    let reactionTime = endTime - startTime;

    gameStarted = false;
    shape.style.display = "none";
    timerElement.textContent = "Click when the shape appears!";
    reactionTimeElement.textContent = "Reaction Time: " + reactionTime + "ms";
  }
});
