//Score object
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
}; //instead of resetting the score to 0 when we load, it will load the score from localstorage

updateScoreElement();

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = "";

  if (playerMove === "Scissors") {
    if (computerMove === "Rock") {
      result = "You Lose";
    } else if (computerMove === "Paper") {
      result = "You Win";
    } else if (computerMove === "Scissors") {
      result = "Tie";
    }
  } else if (playerMove === "Paper") {
    if (computerMove === "Rock") {
      result = "You Win";
    } else if (computerMove === "Paper") {
      result = "Tie";
    } else if (computerMove === "Scissors") {
      result = "You Lose";
    }
  } else if (playerMove === "Rock") {
    if (computerMove === "Rock") {
      result = "Tie";
    } else if (computerMove === "Paper") {
      result = "You Lose";
    } else if (computerMove === "Scissors") {
      result = "You Win";
    }
  }

  if (result === "You Win") {
    score.wins += 1;
  } else if (result === "You Lose") {
    score.losses += 1;
  } else if (result === "Tie") {
    score.ties += 1;
  }

  localStorage.setItem("score", JSON.stringify(score)); //It will store the score in localstorage

  updateScoreElement();

  document.querySelector(".js-result").innerHTML = result;

  document.querySelector(".js-moves").innerHTML = `You
  <img src="images/${playerMove}-emoji.png" alt="rock" class="move-icon" />
  <img src="images/${computerMove}-emoji.png" alt="scissor" class="move-icon" />
  Computer`;
}

function updateScoreElement() {
  const scoreElement = document.querySelector(".js-score");
  scoreElement.innerHTML = `
    <div class=" score-container">
      <span class="wins">Wins: ${score.wins}</span>
      <span class="losses">Losses: ${score.losses}</span>
      <span class="ties">Ties: ${score.ties}</span>
    </div>`;
}

function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = "";

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = "Rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = "Paper";
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = "Scissors";
  }

  return computerMove;
}
