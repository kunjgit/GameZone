document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.getElementById("game-board");
  const target = document.getElementById("target");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");

  let score = 0;
  let time = 10;
  let timer;

  function startGame() {
    score = 0;
    time = 10;
    scoreDisplay.textContent = "Score: 0";
    timerDisplay.textContent = "Time: 10";

    target.addEventListener("click", increaseScore);
    timer = setInterval(updateTimer, 1000);
  }

  function increaseScore() {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    moveTarget();
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
    gameBoard.removeEventListener("click", increaseScore);
    alert("Game Over! Your score is: " + score);
  }

  function moveTarget() {
    const maxX = gameBoard.clientWidth - target.clientWidth;
    const maxY = gameBoard.clientHeight - target.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
  }

  startGame();
});
