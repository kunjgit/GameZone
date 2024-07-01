var hitButton = document.getElementById("hitButton");
var resultElement = document.getElementById("result");
var pitcherElement = document.querySelector(".pitcher");
var batterElement = document.querySelector(".batter");
var strikes = 0;
var balls = 0;
var score = 0;
var inning = 1;
var outs = 0;
var gameInProgress = false;
var hitCount = 0;

function hit() {
  if (!gameInProgress) {
    gameInProgress = true;
    resultElement.textContent = "Game Started. Good luck!";
    setTimeout(startNextInning, 2000);
    return;
  }

  if (outs >= 3) {
    endInning();
    return;
  }

  hitButton.disabled = true;
  pitcherElement.classList.add("pitcher-throw");
  setTimeout(function() {
    pitcherElement.classList.remove("pitcher-throw");
    var randomNumber = Math.floor(Math.random() * 10) + 1;
    if (randomNumber % 2 === 1) {
      strikes++;
      resultElement.textContent = "Strike " + strikes;
    } else {
      balls++;
      resultElement.textContent = "Ball " + balls;
    }
    if (strikes === 3) {
      resultElement.textContent = "Strikeout!";
      outs++;
      updateOutsDisplay();
    } else if (balls === 4) {
      resultElement.textContent = "Walked!";
      score++;
      updateScoreDisplay();
    }
    setTimeout(function() {
      hitButton.disabled = false;
    }, 1000);
  }, 1000);
  batterElement.classList.add("batter-swing");
  setTimeout(function() {
    batterElement.classList.remove("batter-swing");
  }, 500);

  hitCount++;
  if (hitCount >= 10) {
    hitButton.disabled = true;
    setTimeout(endGame, 2000);
  }
}

function startNextInning() {
  inning++;
  strikes = 0;
  balls = 0;
  outs = 0;
  hitCount = 0;
  updateInningDisplay();
  updateOutsDisplay();
  updateScoreDisplay();
  resultElement.textContent = "Inning " + inning + " - Ready to play!";
  hitButton.disabled = false;
}

function endInning() {
  resultElement.textContent = "Three outs! Inning over.";
  hitButton.disabled = true;
  setTimeout(startNextInning, 2000);
}

function endGame() {
  gameInProgress = false;
  resultElement.textContent = "Game Over! Final Score: " + score;
}

function updateInningDisplay() {
  var inningElement = document.getElementById("inning");
  inningElement.textContent = "Inning: " + inning;
}

function updateOutsDisplay() {
  var outsElement = document.getElementById("outs");
  outsElement.textContent = "Outs: " + outs;
}

function updateScoreDisplay() {
  var scoreElement = document.getElementById("score");
  scoreElement.textContent = "Score: " + score;
}

hitButton.addEventListener("click", hit);
