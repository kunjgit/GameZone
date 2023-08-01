document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.getElementById("game-board");
  const target = document.getElementById("target");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game";

  let score = 0;
  let time = 10;
  let timer;
  let colors = ["red", "blue", "green", "yellow", "orange", "purple"];

  function startGame() {
    score = 0;
    time = 10;
    scoreDisplay.textContent = "Score: 0";
    timerDisplay.textContent = "Time: 10";

    target.addEventListener("click", handleTargetClick);
    timer = setInterval(updateTimer, 1000);
  }

  function handleTargetClick() {
    if (time > 0) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      moveTarget();
      changeTargetColor();
    }
  }

  function updateTimer() {
    time--;
    timerDisplay.textContent = "Time: " + time;
    if (time === 0) {
      endGame();
    }
  }

  function endGame() {
    clearInterval(timer);
    gameBoard.removeEventListener("click", handleTargetClick);
    target.style.backgroundColor = "red"; // Reset the target color to default

    // Remove the existing restart button, if any
    const existingRestartButton = document.getElementById("restart-button");
    if (existingRestartButton) {
      existingRestartButton.remove();
    }

    restartButton.setAttribute("id", "restart-button");
    restartButton.addEventListener("click", restartGame);
    gameBoard.appendChild(restartButton);
  }

  function restartGame() {
    restartButton.remove();
    startGame();
  }

  function moveTarget() {
    const maxX = gameBoard.clientWidth - target.clientWidth;
    const maxY = gameBoard.clientHeight - target.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
  }

  function changeTargetColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    target.style.backgroundColor = randomColor;
  }

  startGame();
});
